import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance } from "fastify";

import { log } from "@lib/logger";
import { UserWalletsSchema } from "@lib/types/jsonObjects";
import {
    UserRequestParams,
    UserWalletsRequestBody,
    UserWalletsRequestParams
} from "@lib/types/routeParams";

const wallets = (
    server: FastifyInstance,
    { post: postSchema, delete: deleteSchema }: UserWalletsSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.post("/", postSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            log(request.log.error, reply, 400, "Missing user id parameter");
            return;
        }

        const { walletAddress } = request.body as UserWalletsRequestBody;
        if (!walletAddress) {
            log(
                request.log.error,
                reply,
                400,
                "Missing wallet address parameter"
            );
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
            if (e instanceof PrismaClientKnownRequestError) {
                request.log.fatal(e);
                reply.code(500).send("Server error");
            }
            log(request.log.error, reply, 500, "Couldn't create wallet");
        }
    });

    server.delete("/:walletAddress", deleteSchema, async (request, reply) => {
        const { userId, walletAddress } =
            request.params as UserWalletsRequestParams;
        if (!userId || !walletAddress) {
            log(
                request.log.error,
                reply,
                400,
                "Missing user id or wallet address parameter"
            );
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
            if (e instanceof PrismaClientKnownRequestError) {
                request.log.fatal(e);
                reply.code(500).send("Server error");
            }
            log(request.log.error, reply, 500, "Couldn't delete wallet");
        }
    });

    done();
};

export default wallets;
