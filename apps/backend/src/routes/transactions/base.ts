import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { FastifyDone, JWT } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { TransactionsBaseSchema } from "@lib/types/jsonObjects";
import {
    TransactionsRequestBody,
    TransactionsRequestParams
} from "@lib/types/routeOptions";

const baseRoute = (
    server: FastifyInstance,
    {
        get: getSchema,
        post: postSchema,
        delete: deleteSchema
    }: TransactionsBaseSchema,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            ...getSchema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = (request.user as JWT).user;

            try {
                const transactions = await prisma.user.findMany({
                    where: {
                        id
                    },
                    select: {
                        importTransactions: true
                    }
                });

                reply.send(transactions);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                    return;
                }

                const message = "Couldn't get transactions";
                log.error(message);
                reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
            }
        }
    );

    server.post(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            ...postSchema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = (request.user as JWT).user;

            const { transactions: transactionsData } =
                request.body as TransactionsRequestBody;
            if (!transactionsData) {
                const message = "Missing or empty transaction data";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
            }

            // TODO: validate Transaction type for each transaction

            try {
                const transactions = await prisma.user.update({
                    where: {
                        id
                    },
                    data: {
                        importTransactions: {
                            push: transactionsData
                        }
                    }
                });

                reply.code(201).send(transactions);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                    return;
                }

                const message = "Couldn't create transaction(s)";
                log.error(message);
                reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
            }
        }
    );

    server.delete(
        "/:transactionId",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            ...deleteSchema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = (request.user as JWT).user;

            const { transactionId } =
                request.params as TransactionsRequestParams;
            if (!transactionId) {
                const message = "Missing transaction id parameter";
                log.error(message);
                reply.status(HttpStatus.BAD_REQUEST).send(message);
            }

            try {
                await prisma.user.update({
                    where: {
                        id
                    },
                    data: {
                        importTransactions: {
                            deleteMany: {
                                where: {
                                    id: transactionId
                                }
                            }
                        }
                    }
                });
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                    return;
                }

                const message = "Couldn't delete transaction";
                log.error(message);
                reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
            }
        }
    );

    done();
};

export default baseRoute;
