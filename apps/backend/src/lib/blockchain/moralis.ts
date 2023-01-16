import { PrismaClient, TokenMetadata } from "@prisma/client";
import { FastifyBaseLogger } from "fastify";
import _ from "lodash";

import {
    FormattedTransaction,
    MoralisTransaction,
    MoralisTransactionWithMetadata
} from "../types/externalAPIOptions";
import { fetchMetadata } from "./alchemy";

export const getMoralisTransactions = async (
    walletAddress: string,
    limit: number,
    fromDate?: Date,
    toDate?: Date,
    fromBlock?: number,
    toBlock?: number,
    cursor?: string,
    page?: number,
    chain = "eth"
) => {
    const fromDateQuery = fromDate ? `&from_date=${fromDate}` : "";
    const toDateQuery = toDate ? `&to_date=${toDate}` : "";
    const fromBlockQuery = fromBlock ? `&from_block=${fromBlock}` : "";
    const toBlockQuery = toBlock ? `&to_block=${toBlock}` : "";
    const cursorQuery = cursor ? `&cursor=${cursor}` : "";
    const pageQuery = page ? `&page=${page}` : "";

    const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20/transfers?&chain=${chain}&limit=${limit}${fromDateQuery}${toDateQuery}${fromBlockQuery}${toBlockQuery}${cursorQuery}${pageQuery}&disable_total=false`;

    const response = await fetch(url, {
        headers: {
            "x-api-key": process.env.MORALIS_API_KEY as string,
            accept: "application/json"
        }
    });
    return response;
};

export const formatTransaction = (
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

    if (!tokens[address]) {
        const metadata = await fetchMetadata(prisma, log, address);
        if (!metadata) return formatTransaction(transaction);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tokens[address] = metadata;
    }

    const newTxn = { ...transaction, token: tokens[address] };
    return formatTransaction(newTxn);
};
