import { PrismaClient, TokenMetadata } from "@prisma/client";
import { TokenMetadataResponse } from "alchemy-sdk";
import { FastifyBaseLogger } from "fastify";
import _ from "lodash";

import {
    FormattedTransaction,
    MoralisTransaction,
    MoralisTransactionWithMetadata
} from "@lib/types/externalAPIOptions";

import alchemy from "./alchemy";

const formatTransaction = (
    transaction: MoralisTransactionWithMetadata | MoralisTransaction
): FormattedTransaction => {
    const keys = [
        "transaction_hash",
        "block_timestamp",
        "block_hash",
        "block_number",
        "from_address",
        "to_address",
        "value"
        // * transaction fee is gasPrice * gasUsed
    ];

    if (_.has(transaction, "token")) keys.push("token");
    else keys.push("address");
    const txn = _.pick(transaction, keys);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return _.mapKeys(txn, (_value, key) => _.camelCase(key));
};

export const processTransaction = async (
    prisma: PrismaClient,
    log: FastifyBaseLogger,
    tokens: Record<string, TokenMetadata>,
    transaction: MoralisTransaction
) => {
    // get address
    const { address } = transaction;

    // check if in tokens obj
    let newTxn: MoralisTransactionWithMetadata;
    if (tokens[address]) {
        newTxn = { ...transaction, token: tokens[address] };
        return formatTransaction(newTxn);
    }

    // call database with address to get metadata
    try {
        const tokenMetadata = await prisma.tokenMetadata.findUnique({
            where: {
                address
            }
        });

        if (tokenMetadata) {
            newTxn = { ...transaction, token: tokenMetadata };
            tokens[address] = tokenMetadata;
            return formatTransaction(newTxn);
        }
    } catch (e) {
        // TODO: ERROR HANDLING
        log.fatal(e);
        return formatTransaction(transaction);
    }

    // else call API and update DB and tokens
    const result: TokenMetadataResponse = await alchemy.core.getTokenMetadata(
        address
    );
    if (!result) return formatTransaction(transaction); // TODO: handle if doesn't exist

    try {
        const { decimals, logo, name, symbol } = result;
        await prisma.tokenMetadata.create({
            data: {
                address,
                decimals: decimals ?? 0,
                logo: logo ?? "",
                name: name ?? "",
                symbol: symbol ?? ""
            }
        });
    } catch (e) {
        // TODO: ERROR HANDLING
        log.fatal(e);
        return formatTransaction(transaction);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    tokens[address] = result;

    // add metadata to object
    newTxn = { ...transaction, token: tokens[address] };

    return formatTransaction(newTxn);
};

export default processTransaction;
