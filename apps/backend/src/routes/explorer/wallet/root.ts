import {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions
} from "fastify";
import _ from "lodash";
import Web3 from "web3";

import {
    getMoralisTransactions,
    processTransaction
} from "@lib/blockchain/moralis";
import {
    MoralisTransactionsResponse,
    TokenTransactionsCollection
} from "@lib/types/externalAPIOptions";
import { FastifyDone } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import {
    ExplorerWalletRequestHeaders,
    ExplorerWalletRequestParams
} from "@lib/types/routeOptions";

const wallet = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/:walletAddress",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey])
            // TODO: add schema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            // Add query string option for most recent or oldest
            const { walletAddress } =
                request.params as ExplorerWalletRequestParams;
            if (!walletAddress) {
                const message = "Missing wallet address parameter";
                log.error(message);
                reply
                    .code(HttpStatus.BAD_REQUEST)
                    .send("Missing wallet address parameter");
                return;
            }

            // Validate wallet address
            const WALLET_ADDRESS_REGEX = /^0[xX][0-9a-fA-F]+$/g;
            if (!walletAddress.match(WALLET_ADDRESS_REGEX)) {
                const message = "Invalid address";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
            }

            const { "x-page-key": pageKey } =
                request.headers as ExplorerWalletRequestHeaders;

            const web3 = new Web3(
                Web3.givenProvider ||
                    `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
            );

            const response = await getMoralisTransactions(
                walletAddress,
                2,
                undefined,
                undefined,
                undefined,
                undefined,
                pageKey ?? undefined
            );
            const rawData: MoralisTransactionsResponse = await response.json();

            if (rawData.total === 0) {
                reply.send({
                    total: 0,
                    result: []
                });
                return;
            }

            const data = _.mapKeys(
                _.omit(rawData, "page_size"),
                (_value, key) => {
                    if (key === "cursor") return "pageKey";
                    return key;
                }
            ) as unknown as TokenTransactionsCollection;

            const tokens = {};
            const rawTransactions = [];

            // eslint-disable-next-line no-restricted-syntax
            for (const transaction of data.result) {
                rawTransactions.push(
                    // eslint-disable-next-line no-await-in-loop
                    await processTransaction(prisma, log, tokens, transaction)
                );
            }

            const chainTxns = await Promise.all(
                rawTransactions.map((txn) =>
                    web3.eth.getTransaction(txn.transactionHash)
                )
            );

            const transactions = rawTransactions.map((txn, index) => {
                const { gasPrice, gas } = chainTxns[index];
                return { ...txn, gasPrice, gas };
            });

            reply.send({
                ...data,
                result: transactions
            });
        }
    );

    done();
};

export default wallet;
