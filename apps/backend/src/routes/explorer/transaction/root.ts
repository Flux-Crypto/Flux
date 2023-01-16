import {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions
} from "fastify";
import _ from "lodash";

import { alchemy } from "@lib/blockchain/alchemy";
import { FastifyDone } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { ExplorerTransactionRequestParams } from "@lib/types/routeOptions";

const baseRoute = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    const { log } = server;

    server.get(
        "/:transactionHash",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey])
            // TODO: add schema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { transactionHash } =
                request.params as ExplorerTransactionRequestParams;

            if (!transactionHash) {
                const message = "Missing transaction hash parameter";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
                return;
            }

            // Validate transaction hash
            const TRANSACTION_HASH_REGEX = /^0x([A-Fa-f0-9]{64})$/;
            if (!transactionHash.match(TRANSACTION_HASH_REGEX)) {
                const message = "Invalid transaction hash";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
                return;
            }

            const transactionInfo = await alchemy.core.getTransaction(
                transactionHash
            );

            // no transaction found
            if (!transactionInfo) {
                reply.send({
                    data: {
                        message: "Transaction not found."
                    }
                });
            }

            let txn = _.pick(transactionInfo, [
                "blockHash",
                "blockNum",
                "hash",
                "from",
                "to",
                "value",
                "gas",
                "gasPrice"
            ]);

            if (txn.blockHash) {
                const { timestamp } = await alchemy.core.getBlock(
                    txn.blockHash
                );
                txn = {
                    ...txn,
                    timestamp
                };
            }

            reply.send({
                transaction: txn
            });
        }
    );

    done();
};

export default baseRoute;
