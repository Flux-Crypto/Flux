import {
    AssetTransfersCategory,
    AssetTransfersResult,
    SortingOrder
} from "alchemy-sdk";
import {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions
} from "fastify";
import _ from "lodash";

import { alchemy } from "@lib/blockchain";
import { FastifyDone } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import {
    ExplorerWalletRequestHeaders,
    ExplorerWalletRequestParams
} from "@lib/types/routeOptions";
import { AlchemyTransactionsOptions } from "@src/lib/types/externalAPIOptions";

const wallet = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    const { log } = server;

    server.get(
        "/:walletAddress",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey])
            // TODO: add schema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { "x-page-key": pageKey } =
                request.headers as ExplorerWalletRequestHeaders;

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

            let alchemyOpts: AlchemyTransactionsOptions = {
                fromBlock: "0x0",
                fromAddress: walletAddress,
                excludeZeroValue: true,
                order: SortingOrder.DESCENDING,
                withMetadata: true,
                maxCount: 25,
                category: [
                    AssetTransfersCategory.EXTERNAL,
                    AssetTransfersCategory.ERC20
                ]
            };

            // Multiple pages of data
            // NOTE: Page key only lasts for 10 min before expiring!
            const PAGE_KEY_REGEX =
                /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
            if (pageKey.match(PAGE_KEY_REGEX)) {
                alchemyOpts = { ...alchemyOpts, pageKey };
            }

            const { transfers } = await alchemy.core.getAssetTransfers(
                alchemyOpts
            );
            if (!transfers.length)
                reply.send("No transactions for this wallet.");

            const results = _.map(transfers, (transfer: AssetTransfersResult) =>
                _.pick(transfer, [
                    "blockNum",
                    "hash",
                    "from",
                    "to",
                    "value",
                    "asset",
                    "metadata",
                    "pageKey"
                ])
            );

            reply.send({
                data: {
                    results
                }
            });
        }
    );

    done();
};

export default wallet;
