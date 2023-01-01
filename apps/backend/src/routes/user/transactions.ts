import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import {
    UserRequestParams,
    UserTransactionsRequestBody,
    UserWalletsRequestBody
} from "../../types/routeParams";
import UserSchema from "../../../docs/schemas/user.json";
import { logError } from "../../lib/utils";

const transactions = (
    server: FastifyInstance,
    _opts: any,
    done: () => void
) => {
    const { prisma } = server;

    const { GetUserSchema, PostUserWalletSchema, DeleteUserWalletSchema } =
        UserSchema;

    server.get("/", GetUserSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 400, "missing user id param");
            return;
        }

        try {
            const transaction = await prisma.transaction.findUnique({
                where: {
                    id: userId
                }
            });

            return transaction;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "fetching transaction");
        }
    });

    server.post("/", PostUserWalletSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 400, "missing user id param");
            return;
        }

        const { transaction: transactionData } =
            request.body as UserTransactionsRequestBody;
        if (!transactionData) {
            logError(reply, 400, "missing transaction param");
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

    server.delete("/", DeleteUserWalletSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 400, "missing user id param");
            return;
        }

        const { walletAddress } = request.body as UserWalletsRequestBody;
        if (!walletAddress) {
            logError(reply, 400, "missing wallet address param");
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
