import { AssetTransfersCategory, SortingOrder } from "alchemy-sdk";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import _ from "lodash";

import { logger } from "@lib/logger";
import { AlchemyOptions } from "@lib/types/apiOptions";
import { AddressRequestParams } from "@lib/types/routeParams";
import { alchemy } from "@src/lib/blockchain";
import HttpStatus from "@src/lib/types/httpStatus";

const transactions = (
    server: FastifyInstance,
    _opts: unknown,
    done: () => void
) => {
    const { log } = server;

    server.get(
        "/:walletAddress",
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { "page-key": pageKey } = request.headers;

            const { walletAddress } =
                request.params as ExplorerTransactionsRequestParams;
            if (!walletAddress)
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing wallet address parameter"
                );

            // Validate wallet address
            const WALLET_ADDRESS_REGEX = /^0[xX][0-9a-fA-F]+$/g;
            if (!walletAddress.match(WALLET_ADDRESS_REGEX))
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Invalid address"
                );

            const alchemyOpts: AlchemyTransactionsOptions = {
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
            if (pageKey?.toString().match(PAGE_KEY_REGEX)) {
                alchemyOpts.pageKey = pageKey.toString();
            }

            const response = await alchemy.core.getAssetTransfers(alchemyOpts);
            const { transfers } = response;

            if (transfers.length <= 0)
                reply.send({
                    success: true,
                    data: {
                        message: "No transactions for this wallet."
                    }
                });

            // TODO: provide type for transfer
            const results = transfers.map((transfer: unknown) =>
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
                success: true,
                data: {
                    results
                }
            });
        }
    );

    done();
};

export default transactions;
