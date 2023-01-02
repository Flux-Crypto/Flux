import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance } from "fastify";

import { UserWalletsSchema } from "@lib/types/jsonObjects";
import {
    UserRequestParams,
    UserWalletsRequestBody,
    UserWalletsRequestParams
} from "@lib/types/routeParams";
import { logError } from "@lib/utils";

const walletsRoute = (
    server: FastifyInstance,
    { post: postSchema, delete: deleteSchema }: UserWalletsSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.post("/", postSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) logError(reply, 400, "missing user id param");

        const { walletAddress } = request.body as UserWalletsRequestBody;
        if (!walletAddress)
            logError(reply, 400, "missing wallet address param");

        try {
            const checkWallet = await prisma.wallet.findUnique({
                where: {
                    address: walletAddress
                }
            });

            if (!checkWallet) {
                const wallet = await prisma.wallet.create({
                    data: {
                        address: walletAddress,
                        userId
                    }
                });

                reply.code(201).send(wallet);
            }

            if (!checkWallet?.userId) {
                const wallet = await prisma.wallet.update({
                    where: {
                        address: walletAddress
                    },
                    data: {
                        userId
                    }
                });

                reply.send(wallet);
            }

            logError(reply, 409, "wallet already exists");
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "creating wallet");
        }
    });

    server.delete("/:walletAddress", deleteSchema, async (request, reply) => {
        const { userId, walletAddress } =
            request.params as UserWalletsRequestParams;
        if (!userId || !walletAddress)
            logError(reply, 400, "missing user id or wallet address param");

        // TODO: delete wallet connection, delete wallet if no connections
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

export default walletsRoute;
