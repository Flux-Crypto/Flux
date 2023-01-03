import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import _ from "lodash";

import { logger } from "@lib/logger";
import { TransactionHashRequestParams } from "@lib/types/routeParams";
import { alchemy } from "@src/lib/blockchain";
import HttpStatus from "@src/lib/types/httpStatus";

const transaction = (
    server: FastifyInstance,
    _opts: unknown,
    done: () => void
) => {
    const { log } = server;

    server.get(
        "/:hash",
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { hash } = request.params as TransactionHashRequestParams;

            // Check for transaction hash parameter
            if (!hash) {
                logger(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing transaction hash parameter"
                );
            }

            // Validate transaction hash
            const TRANSACTION_HASH_REGEX = /^0x([A-Fa-f0-9]{64})$/;
            if (!hash.match(TRANSACTION_HASH_REGEX)) {
                logger(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Invalid transaction hash"
                );
            }

            const transactionInfo = await alchemy.core.getTransaction(hash);

            // No transaction found
            if (!transactionInfo) {
                reply.send({
                    data: {
                        message: "Transaction not found."
                    }
                });
            }

            const tx = _.pick(transactionInfo, [
                "blockHash",
                "blockNum",
                "hash",
                "from",
                "to",
                "value",
                "gas",
                "gasPrice"
            ]);

            if (tx.blockHash) {
                tx.timestamp = (
                    await alchemy.core.getBlock(tx.blockHash)
                ).timestamp;
            }

            reply.send({
                data: {
                    transaction: tx
                }
            });
        }
    );

    done();
};

export default transaction;
