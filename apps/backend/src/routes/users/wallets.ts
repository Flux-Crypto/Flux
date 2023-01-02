import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance } from "fastify";

import { log } from "@lib/logger";
import { UserWalletsSchema } from "@lib/types/jsonObjects";
import {
    UserRequestParams,
    UserWalletsRequestBody,
    UserWalletsRequestParams
} from "@lib/types/routeParams";

const walletsRoute = (
    server: FastifyInstance,
    { post: postSchema, delete: deleteSchema }: UserWalletsSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.post("/", postSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId)
            log(request.log.error, reply, 400, "Missing user id parameter");

        const { walletAddress } = request.body as UserWalletsRequestBody;
        if (!walletAddress)
            log(
                request.log.error,
                reply,
                400,
                "Missing wallet address parameter"
            );

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
        if (!userId || !walletAddress) 
            log(
                request.log.error,
                reply,
                400,
                "Missing user id or wallet address parameter"
            );

        // TODO: delete wallet connection, delete wallet if no connections
        try {
            await prisma.wallet.delete({
                where: {
                    address: walletAddress
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

export default walletsRoute;
