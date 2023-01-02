import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { log } from "@lib/logger";
import { UserTransactionsSchema } from "@lib/types/jsonObjects";
import {
    UserRequestParams,
    UserTransactionsRequestBody,
    UsersTransactionsRequestParams
} from "@lib/types/routeParams";

const transactionsRoute = (
    server: FastifyInstance,
    {
        get: getSchema,
        post: postSchema,
        delete: deleteSchema
    }: UserTransactionsSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.get(
        "/",
        getSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { userId } = request.params as UserRequestParams;
            if (!userId) 
                log(request.log.error, reply, 400, "Missing user id parameter");
            

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
                    request.log.fatal(e);
                    reply.code(500).send("Server error");
                }

                log(request.log.error, reply, 500, "Couldn't get transactions");
            }
        }
    );

    server.post(
        "/",
        postSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { userId } = request.params as UserRequestParams;
            if (!userId) 
                log(request.log.error, reply, 400, "Missing user id parameter");
            

            const { transaction: transactionData } =
                request.body as UserTransactionsRequestBody;
            if (!transactionData) 
                log(
                    request.log.error,
                    reply,
                    400,
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
                    request.log.fatal(e);
                    reply.code(500).send("Server error");
                }

                log(
                    request.log.error,
                    reply,
                    500,
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
                log(
                    request.log.error,
                    reply,
                    400,
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
                    request.log.fatal(e);
                    reply.code(500).send("Server error");
                }

                log(request.log.error, reply, 500, "Couldn't delete wallet");
            }
        }
    );

    done();
};

export default transactionsRoute;
