import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { prisma } from "../index";
import {
    UserRequestParams,
    UserWalletsRequestBody
} from "src/types/routeParams";
import { logError } from "src/utils/utils";

const user = (server: FastifyInstance, _: any, done: () => void) => {
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

        const { walletAddress } = request.body as UserWalletsRequestBody;

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

    done();
};

export default user;
