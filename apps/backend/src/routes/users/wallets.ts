import { UserWalletsSchema } from "@lib/types/jsonObjects";
import {
    UserRequestParams,
    UserWalletsRequestBody,
    UserWalletsRequestParams
} from "@lib/types/routeParams";
import { logError } from "@lib/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance } from "fastify";

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
            const wallet = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    wallets: {
                        push: [{ address: walletAddress }]
                    }
                }
            });

            reply.code(201).send(wallet);
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "creating wallet");
        }
    });

    server.delete("/:walletAddress", deleteSchema, async (request, reply) => {
        const { userId, walletAddress } =
            request.params as UserWalletsRequestParams;
        if (!userId || !walletAddress) {
            logError(reply, 404, "missing user id or wallet address param");
            return;
        }

        try {
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    wallets: {
                        deleteMany: {
                            where: {
                                address: walletAddress
                            }
                        }
                    }
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
