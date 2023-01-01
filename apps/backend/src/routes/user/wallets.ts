import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import {
    UserRequestParams,
    UserWalletsRequestParams,
    UserWalletsRequestBody
} from "../../../types/routeParams";
import { logError } from "../../lib/utils";
import { UserWalletsSchema } from "../../../types/jsonObjects";

const wallets = (
    server: FastifyInstance,
    { post: postSchema, delete: deleteSchema }: UserWalletsSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.post("/", postSchema, async (request, reply) => {
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

        // TODO: check if wallet already exists, return 409 (Conflict)
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

    server.delete("/", deleteSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 404, "missing user id param");
            return;
        }

        const { walletId } = request.params as UserWalletsRequestParams;
        if (!walletId) {
            logError(reply, 404, "missing wallet id param");
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
