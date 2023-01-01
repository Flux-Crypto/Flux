import { UserTransactionsSchema } from "@lib/types/jsonObjects";
import {
    UserRequestParams,
    UsersTransactionsRequestParams,
    UserTransactionsRequestBody
} from "@lib/types/routeParams";
import { logError } from "@lib/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance } from "fastify";

const transactions = (
    server: FastifyInstance,
    {
        get: getSchema,
        post: postSchema,
        delete: deleteSchema
    }: UserTransactionsSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.get("/", getSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 404, "missing user id param");
            return;
        }

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
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "getting transactions");
        }
    });

    server.post("/", postSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 404, "missing user id param");
            return;
        }

        const { transaction: transactionData } =
            request.body as UserTransactionsRequestBody;
        if (!transactionData) {
            logError(reply, 404, "missing transaction param");
            return;
        }

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
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "creating transaction");
        }
    });

    server.delete("/:transactionId", deleteSchema, async (request, reply) => {
        const { userId, transactionId } =
            request.params as UsersTransactionsRequestParams;
        if (!userId || !transactionId) {
            logError(reply, 404, "missing user id or transaction id param");
            return;
        }

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
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "deleting wallet");
        }
    });

    done();
};

export default transactions;
