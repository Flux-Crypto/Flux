import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { logger } from "@lib/logger";
import { UserTransactionsSchema } from "@lib/types/jsonObjects";
import {
    UserRequestParams,
    UserTransactionsRequestBody,
    UsersTransactionsRequestParams
} from "@lib/types/routeParams";
import HttpStatus from "@src/lib/types/httpStatus";

const transactionsRoute = (
    server: FastifyInstance,
    {
        get: getSchema,
        post: postSchema,
        delete: deleteSchema
    }: UserTransactionsSchema,
    done: () => void
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        getSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { userId } = request.params as UserRequestParams;
            if (!userId)
                logger(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing user id parameter"
                );

            try {
                const transactions = await prisma.user.findMany({
                    where: {
                        id: userId
                    },
                    select: {
                        transactions: true
                    }
                });

                reply.send(transactions);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                }

                logger(
                    log.error,
                    reply,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Couldn't get transactions"
                );
            }
        }
    );

    server.post(
        "/",
        postSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { userId } = request.params as UserRequestParams;
            if (!userId)
                logger(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing user id parameter"
                );

            const { transaction: transactionData } =
                request.body as UserTransactionsRequestBody;
            if (!transactionData)
                logger(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing transaction parameter"
                );

            try {
                const transaction = await prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        transactions: {
                            push: [{ ...transactionData }]
                        }
                    }
                });

                reply.code(201).send(transaction);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                }

                logger(
                    log.error,
                    reply,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Couldn't create transaction"
                );
            }
        }
    );

    server.delete(
        "/:transactionId",
        deleteSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { userId, transactionId } =
                request.params as UsersTransactionsRequestParams;
            if (!userId || !transactionId)
                logger(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing user id or transaction id parameter"
                );

            try {
                await prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        transactions: {
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
                }

                logger(
                    log.error,
                    reply,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Couldn't delete wallet"
                );
            }
        }
    );

    done();
};

export default transactionsRoute;
