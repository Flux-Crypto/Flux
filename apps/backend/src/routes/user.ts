import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import {
    UserRequestParams,
    UserWalletsRequestBody
} from "src/types/routeParams";
import { logError } from "src/utils/utils";

const user = (server: FastifyInstance, _: any, done: () => void) => {
    const { prisma } = server;

    server.get("/:userId", async (request, reply) => {
        const { userId } = request.params as UserRequestParams;

        if (!userId) logError(reply, 400, "missing user id param");

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

    server.post("/:userId/wallets", async (request, reply) => {
        const { userId } = request.params as UserRequestParams;

        if (!userId) logError(reply, 400, "missing user id param");

        const { walletAddress, operation } =
            request.body as UserWalletsRequestBody;

        try {
            if (operation === "link") {
                const wallet = await prisma.wallet.create({
                    data: {
                        address: walletAddress,
                        userId
                    }
                });

                return wallet;
            }

            const deletedWallet = await prisma.wallet.delete({
                where: {
                    address: walletAddress
                }
            });

            return deletedWallet;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "creating wallet");
        }
    });

    done();
};

export default user;
