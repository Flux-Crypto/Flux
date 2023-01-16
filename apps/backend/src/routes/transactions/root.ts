import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { FastifyDone, JWT } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { TransactionsRootSchema } from "@lib/types/jsonObjects";
import {
    TransactionsRequestBody,
    TransactionsRequestParams
} from "@lib/types/routeOptions";

const rootRoute = (
    server: FastifyInstance,
    {
        get: getSchema,
        post: postSchema,
        delete: deleteSchema
    }: TransactionsRootSchema,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            schema: getSchema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = (request.user as JWT).user;

            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id
                    },
                    select: {
                        importTransactions: true
                    }
                });

                if (!user) {
                    const message = "Couldn't find user!";
                    log.error(message);
                    reply.code(HttpStatus.NOT_FOUND).send(message);
                    return;
                }

                reply.send(user.importTransactions);
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
                const message = "Missing or empty transactions data";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
                return;
            }

            try {
                const { importTransactions } = await prisma.user.update({
                    where: {
                        id
                    },
                    data: {
                        importTransactions: {
                            push: transactionsData
                        }
                    }
                });

                reply.code(201).send(importTransactions);
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

export default rootRoute;
