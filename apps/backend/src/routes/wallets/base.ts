import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ethers } from "ethers";
import { FastifyInstance } from "fastify";
import _ from "lodash";

import { FastifyDone, JWT } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { WalletsBaseSchema } from "@lib/types/jsonObjects";
import {
    WalletsRequestBody,
    WalletsRequestParams
} from "@lib/types/routeOptions";

const baseRoute = (
    server: FastifyInstance,
    { post: postSchema, delete: deleteSchema }: WalletsBaseSchema,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey])
        },
        async (request, reply) => {
            const { id } = (request.user as JWT).user;
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id
                    },
                    select: {
                        rdWallets: {
                            select: {
                                address: true
                            }
                        },
                        rdwrWallets: {
                            select: {
                                address: true,
                                seedPhrase: true
                            }
                        },
                        walletNames: true
                    }
                });

                if (!user) {
                    const message = "Couldn't find user!";
                    log.error(message);
                    reply.code(HttpStatus.NOT_FOUND).send(message);
                    return;
                }

                const { walletNames } = user;
                const flatWalletNames: { [address: string]: string } = _.reduce(
                    walletNames,
                    (newWalletNames, { address, name }) => ({
                        ...newWalletNames,
                        [address]: name
                    }),
                    {}
                );

                let { rdWallets, rdwrWallets } = user;
                rdWallets = _.map(rdWallets, (wallet) => ({
                    ...wallet,
                    name: flatWalletNames[wallet.address]
                }));
                rdwrWallets = _.map(rdwrWallets, (wallet) => ({
                    ...wallet,
                    name: flatWalletNames[wallet.address]
                }));

                reply.send({
                    rdWallets,
                    rdwrWallets
                });
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                    return;
                }

                const message = "Couldn't get transactions";
                log.error(message);
                reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
            }
        }
    );

    server.post(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            ...postSchema
        },
        async (request, reply) => {
            const { id } = (request.user as JWT).user;

            const { walletAddress, seedPhrase } =
                request.body as WalletsRequestBody;
            if (!walletAddress) {
                const message = "Missing wallet address parameter";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
                return;
            }
            if (!ethers.utils.isAddress(walletAddress)) {
                const message = "Invalid wallet address";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
                return;
            }

            try {
                if (seedPhrase) {
                    if (!ethers.utils.isValidMnemonic(seedPhrase)) {
                        const message = "Invalid seed phrase mnemonic";
                        log.error(message);
                        reply.code(HttpStatus.BAD_REQUEST).send(message);
                        return;
                    }

                    // check for authentication
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
                            seedPhrase,
                            [seedPhrase ? "rdwrUsers" : "rdUsers"]: {
                                connect: { id }
                            }
                        }
                    });

                    reply.code(201).send(wallet);
                    return;
                }

                const wallet = await prisma.wallet.update({
                    where: {
                        address: walletAddress
                    },
                    data: {
                        seedPhrase,
                        [seedPhrase ? "rdwrUsers" : "rdUsers"]: {
                            connect: { id }
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
                    return;
                }

                const message = "Couldn't create wallet";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
            }
        }
    );

    server.delete(
        "/:walletAddress",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            ...deleteSchema
        },
        async (request, reply) => {
            const { id } = (request.user as JWT).user;

            const { walletAddress } = request.params as WalletsRequestParams;
            if (!walletAddress) {
                const message = "Invalid seed phrase mnemonic";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
                return;
            }

            try {
                const { rdUsers, rdwrUsers } = await prisma.wallet.update({
                    where: {
                        address: walletAddress
                    },
                    data: {
                        rdUsers: {
                            disconnect: [{ id }]
                        },
                        rdwrUsers: {
                            disconnect: [{ id }]
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
                    return;
                }

                const message = "Couldn't delete wallet";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
            }
        }
    );

    done();
};

export default baseRoute;
