import { AlchemyOptions } from "@lib/types/apiOptions";
import { AddressRequestParams } from "@lib/types/routeParams";
import { logError } from "@lib/utils";
import { alchemy } from "@src/utils/blockchain";
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
        const { headers } = request;
        // Check for wallet address parameter
        if (!address) {
            logError(reply, 400, "Missing address parameter");
        }

        // Validate wallet address
        const WALLET_ADDRESS_REGEX = /^0[xX][0-9a-fA-F]+$/g;
        if (!address.match(WALLET_ADDRESS_REGEX)) {
            logError(reply, 400, "Invalid address");
        }

        const alchemyOpts: AlchemyOptions = {
            fromBlock: "0x0",
            fromAddress: address,
            excludeZeroValue: true,
            order: "desc",
            withMetadata: true,
            maxCount: MAX_TWENTY_FIVE_TXNS_HEX,
            category: ["external", "erc20"]
        };

        // Multiple pages of data
        // NOTE: Page key only lasts for 10 min before expiring!
        const PAGE_KEY_REGEX =
            /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        if (
            headers["page-key"] &&
            (headers["page-key"] as string).match(PAGE_KEY_REGEX)
        ) {
            alchemyOpts.pageKey = request.headers["page-key"] as string;
        }

        const response = await alchemy.core.getAssetTransfers(alchemyOpts);
        const { transfers } = response;

        // No transactions found
        if (transfers.length <= 0) {
            reply.send({
                success: true,
                data: {
                    message: "No transactions for this wallet."
                }
            });
        }

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
    });

    done();
};

export default transactions;
