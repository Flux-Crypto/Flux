import {
    UserRequestParams,
    UserWalletsRequestBody
} from "@backend/types/routeParams";
import { logError } from "@backend/utils/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance } from "fastify";

const user = (server: FastifyInstance, _opts: unknown, done: () => void) => {
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
        return "";
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
