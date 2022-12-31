import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import {
    UserRequestParams,
    UserWalletsRequestBody
} from "../types/routeParams";
import UserSchema from "../../docs/schemas/user.json";
import { logError } from "../lib/utils";

const user = (server: FastifyInstance, _: any, done: () => void) => {
    const { prisma } = server;

    const { GetUserSchema, PostUserWalletSchema, DeleteUserWalletSchema } =
        UserSchema;

    server.get("/:userId", GetUserSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;

        if (!userId) {
            logError(reply, 400, "missing user id param");
            return;
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            return user;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "fetching user");
        }
    });

    server.post(
        "/:userId/wallets",
        PostUserWalletSchema,
        async (request, reply) => {
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
                const wallet = await prisma.wallet.create({
                    data: {
                        address: walletAddress,
                        userId
                    }
                });

                return wallet;
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError)
                    logError(reply, 500, e.message);

                logError(reply, 500, "creating wallet");
            }
        }
    );

    server.delete(
        "/:userId/wallets",
        DeleteUserWalletSchema,
        async (request, reply) => {
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
        }
    );

    done();
};

export default user;
