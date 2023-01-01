import { AddressRequestParams } from "@backend/types/routeParams";
import { alchemy } from "@backend/utils/blockchain";
import { logError } from "@backend/utils/utils";
import { FastifyInstance } from "fastify";
import _ from "lodash";

const MAX_TWENTY_FIVE_TXNS_HEX = "0x19";

const transactions = (
    server: FastifyInstance,
    _opts: unknown,
    done: () => void
) => {
    server.get("/:address", async (request, reply) => {
        const { address } = request.params as AddressRequestParams;

        if (!address) {
            logError(reply, 400, "Missing address parameter");
        }

        if (!address.match(/^0[xX][0-9a-fA-F]+$/g)) {
            logError(reply, 400, "Invalid address");
        }

        // Grabs at most 25 transactions
        const response = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            fromAddress: address,
            excludeZeroValue: true,
            order: "desc",
            maxCount: MAX_TWENTY_FIVE_TXNS_HEX,
            category: ["external", "erc20"]
        });

        const { transfers } = response;

        // No transactions found
        if (transfers.length <= 0) {
            reply.status(200).send({
                success: true,
                data: {
                    message: "No transactions for this wallet."
                }
            });
        }

        // Multiple pages of data
        // NOTE: Page key only lasts for 10 min before expiring!
        let pageKey = "";
        if (response.pageKey) {
            pageKey = response.pageKey;
        }

        const results = transfers.map((transfer: unknown) =>
            _.pick(transfer, [
                "blockNum",
                "hash",
                "from",
                "to",
                "value",
                "asset",
                "metadata"
            ])
        );

        reply.status(200).send({
            success: true,
            data: {
                results,
                pageKey: pageKey || ""
            }
        });
    });

    done();
};

export default transactions;
