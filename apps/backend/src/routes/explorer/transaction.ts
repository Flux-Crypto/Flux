import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import _ from "lodash"

import { logAndSendReply } from "@lib/logger"
import { ExplorerTransactionRequestParams } from "@lib/types/routeParams"
import { alchemy } from "@src/lib/blockchain"
import HttpStatus from "@src/lib/types/httpStatus"

const transaction = (
    server: FastifyInstance,
    _opts: unknown,
    done: () => void
) => {
    const { log } = server

    server.get(
        "/:transactionHash",
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { transactionHash } =
                request.params as ExplorerTransactionRequestParams

            if (!transactionHash)
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing transaction hash parameter"
                )

            // Validate transaction hash
            const TRANSACTION_HASH_REGEX = /^0x([A-Fa-f0-9]{64})$/
            if (!transactionHash.match(TRANSACTION_HASH_REGEX))
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Invalid transaction hash"
                )

            const transactionInfo = await alchemy.core.getTransaction(
                transactionHash
            )

            // No transaction found
            if (!transactionInfo) {
                reply.send({
                    data: {
                        message: "Transaction not found."
                    }
                })
            }

            const txn = _.pick(transactionInfo, [
                "blockHash",
                "blockNum",
                "hash",
                "from",
                "to",
                "value",
                "gas",
                "gasPrice"
            ])

            if (txn.blockHash) {
                txn.timestamp = (
                    await alchemy.core.getBlock(txn.blockHash)
                ).timestamp
            }

            reply.send({
                data: {
                    transaction: txn
                }
            })
        }
    )

    done()
}

export default transaction
