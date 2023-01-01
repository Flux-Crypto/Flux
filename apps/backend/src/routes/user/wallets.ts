import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import {
    UserRequestParams,
    UserWalletsRequestParams,
    UserWalletsRequestBody
} from "../../types/routeParams";
import UserSchema from "../../../docs/schemas/user.json";
import { logError } from "../../lib/utils";

const wallets = (server: FastifyInstance, _: any, done: () => void) => {
    const { prisma } = server;

    const { PostUserWalletSchema, DeleteUserWalletSchema } = UserSchema;

    server.post("/", PostUserWalletSchema, async (request, reply) => {
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
    });

    server.delete("/", DeleteUserWalletSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 400, "missing user id param");
            return;
        }

        const { walletId } = request.params as UserWalletsRequestParams;
        if (!walletId) {
            logError(reply, 400, "missing wallet id param");
            return;
        }

        try {
            await prisma.wallet.delete({
                where: {
                    id: walletId
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

export default wallets;
