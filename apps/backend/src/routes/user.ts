import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import {
    UserRequestParams,
    UserWalletsRequestBody
} from "../types/routeParams";
import userSchema from "../../docs/user.json";
import { logError } from "../utils/utils";

const user = (server: FastifyInstance, _: any, done: () => void) => {
    const { prisma } = server;

    const { userIdSchema, walletsSchema } = userSchema;

    server.get("/:userId", userIdSchema, async (request, reply) => {
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

    server.post("/:userId/wallets", walletsSchema, async (request, reply) => {
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

            await prisma.wallet.delete({
                where: {
                    address: walletAddress
                }
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "creating wallet");
        }
    });

    done();
};

export default user;
