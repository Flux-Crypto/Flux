import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import {
    UserRequestParams,
    UserTransactionsRequestBody,
    UserWalletsRequestBody
} from "../../../types/routeParams";
import { logError } from "../../lib/utils";
import { UserTransactionsSchema } from "../../../types/jsonObjects";

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
            const transactions = await prisma.transaction.findMany({
                where: {
                    id: userId
                }
            });

            return transactions;
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
            const transaction = await prisma.transaction.create({
                data: {
                    ...transactionData,
                    userId
                }
            });

            return transaction;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "creating transaction");
        }
    });

    server.delete("/", deleteSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 404, "missing user id param");
            return;
        }

        const { walletAddress } = request.body as UserWalletsRequestBody;
        if (!walletAddress) {
            logError(reply, 404, "missing wallet address param");
            return;
        }

        try {
            await prisma.wallet.delete({
                where: {
                    address: walletAddress
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
