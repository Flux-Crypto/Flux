import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ethers } from "ethers";
import { FastifyInstance } from "fastify";

import { logAndSendReply } from "@lib/logger";
import { UserWalletsSchema } from "@lib/types/jsonObjects";
import {
    UserRequestParams,
    UserWalletsRequestBody,
    UserWalletsRequestParams
} from "@lib/types/routeParams";
import HttpStatus from "@src/lib/types/httpStatus";

const walletsRoute = (
    server: FastifyInstance,
    { post: postSchema, delete: deleteSchema }: UserWalletsSchema,
    done: () => void
) => {
    const { prisma, log } = server;

    server.post("/", postSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId)
            logAndSendReply(
                log.error,
                reply,
                HttpStatus.BAD_REQUEST,
                "Missing user id parameter"
            );

        const { walletAddress, seedPhrase } =
            request.body as UserWalletsRequestBody;
        if (!walletAddress)
            logAndSendReply(
                log.error,
                reply,
                HttpStatus.BAD_REQUEST,
                "Missing wallet address parameter"
            );
        if (!ethers.utils.isAddress(walletAddress))
            logger(
                log.error,
                reply,
                HttpStatus.BAD_REQUEST,
                "Invalid wallet address"
            );

        try {
            if (seedPhrase) {
                // check for authentication
                if (!ethers.utils.isValidMnemonic(seedPhrase))
                    logger(
                        log.error,
                        reply,
                        HttpStatus.BAD_REQUEST,
                        "Invalid seed phrase mnemonic"
                    );

                // auth or kick
            }

            const checkWallet = await prisma.wallet.findUnique({
                where: {
                    address: walletAddress
                }
            });

            if (!checkWallet) {
                const wallet = await prisma.wallet.create({
                    data: {
                        address: walletAddress,
                        [seedPhrase ? "rdwrUsers" : "rdUsers"]: {
                            connect: { id: userId }
                        }
                    }
                });

                reply.code(201).send(wallet);
            }

            const wallet = await prisma.wallet.update({
                where: {
                    address: walletAddress
                },
                data: {
                    [seedPhrase ? "rdwrUsers" : "rdUsers"]: {
                        connect: { id: userId }
                    }
                }
            });

            reply.send(wallet);
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                log.fatal(e);
                reply
                    .code(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send("Server error");
            }

            logAndSendReply(
                log.error,
                reply,
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Couldn't create wallet"
            );
        }
    });

    server.delete("/:walletAddress", deleteSchema, async (request, reply) => {
        const { userId, walletAddress } =
            request.params as UserWalletsRequestParams;
        if (!userId || !walletAddress)
            logAndSendReply(
                log.error,
                reply,
                HttpStatus.BAD_REQUEST,
                "Missing user id or wallet address parameter"
            );

        try {
            const { rdUsers, rdwrUsers } = await prisma.wallet.update({
                where: {
                    address: walletAddress
                },
                data: {
                    rdUsers: {
                        disconnect: [{ id: userId }]
                    },
                    rdwrUsers: {
                        disconnect: [{ id: userId }]
                    }
                },
                select: {
                    rdUsers: true,
                    rdwrUsers: true
                }
            });

            if (!rdUsers && !rdwrUsers) {
                await prisma.wallet.delete({
                    where: {
                        address: walletAddress
                    }
                });
            }

            reply.code(HttpStatus.NO_CONTENT);
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                log.fatal(e);
                reply
                    .code(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send("Server error");
            }

            logAndSendReply(
                log.error,
                reply,
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Couldn't delete wallet"
            );
        }
    });

    done();
};

export default walletsRoute;
