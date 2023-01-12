import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ethers } from "ethers";
import { FastifyInstance } from "fastify";
import _ from "lodash";

import { FastifyDone, JWT } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { WalletsBaseSchema } from "@lib/types/jsonObjects";
import {
    WalletsRequestParams,
    WalletsRequestPostBody,
    WalletsRequestPutBody
} from "@lib/types/routeOptions";

const baseRoute = (
    server: FastifyInstance,
    {
        get: getSchema,
        post: postSchema,
        delete: deleteSchema
    }: WalletsBaseSchema,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            schema: getSchema
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
                                address: true,
                                walletNames: {
                                    where: {
                                        userId: id
                                    },
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        rdwrWallets: {
                            select: {
                                address: true,
                                seedPhrase: true,
                                walletNames: {
                                    where: {
                                        userId: id
                                    },
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                });

                if (!user) {
                    const message = "Couldn't find user!";
                    log.error(message);
                    reply.code(HttpStatus.NOT_FOUND).send(message);
                    return;
                }

                const { rdWallets, rdwrWallets } = user;
                const flattenWallets = (
                    wallets: {
                        address: string;
                        seedPhrase?: string;
                        walletNames: {
                            name: string;
                        }[];
                    }[]
                ) =>
                    _.map(wallets, (wallet) =>
                        _.omit(
                            {
                                ...wallet,
                                name:
                                    wallet.walletNames[0] &&
                                    wallet.walletNames[0].name
                            },
                            "walletNames"
                        )
                    );

                reply.send({
                    rdWallets: flattenWallets(rdWallets),
                    rdwrWallets: flattenWallets(rdwrWallets)
                });
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                    return;
                }

                log.error(e);
                reply
                    .code(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send("Couldn't get wallets");
            }
        }
    );

    server.post(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            schema: postSchema
        },
        async (request, reply) => {
            const { id } = (request.user as JWT).user;

            const { walletAddress, seedPhrase } =
                request.body as WalletsRequestPostBody;
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

                log.error(e);
                reply
                    .code(HttpStatus.BAD_REQUEST)
                    .send("Couldn't create wallet");
            }
        }
    );

    server.put(
        "/:walletAddress",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey])
        },
        async (request, reply) => {
            const { id } = (request.user as JWT).user;

            const { walletAddress } = request.params as WalletsRequestParams;
            const { seedPhrase, walletName } =
                request.body as WalletsRequestPutBody;
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
                const wallet = await prisma.wallet.findUnique({
                    where: {
                        address: walletAddress
                    },
                    select: {
                        rdUserIds: true,
                        rdwrUserIds: true,
                        walletNames: {
                            where: {
                                userId: id,
                                walletAddress
                            },
                            select: {
                                id: true
                            }
                        }
                    }
                });

                if (!wallet) {
                    const message = "Wallet hasn't been initialized!";
                    log.error(message);
                    reply.code(HttpStatus.NOT_FOUND).send(message);
                    return;
                }

                const { rdUserIds, rdwrUserIds, walletNames } = wallet;
                if (!(rdUserIds.includes(id) || rdwrUserIds.includes(id))) {
                    const message = "Wallet hasn't been linked to user";
                    log.error(message);
                    reply.code(HttpStatus.BAD_REQUEST).send(message);
                    return;
                }

                if (!seedPhrase && walletName === undefined) {
                    const message = "Missing field(s) to update";
                    log.error(message);
                    reply.code(HttpStatus.BAD_REQUEST).send(message);
                    return;
                }

                const formattedWalletName = walletName?.trim();
                const existingName = walletNames[0];
                let updateData;
                if (formattedWalletName !== undefined) {
                    updateData = {
                        walletNames: !existingName
                            ? {
                                  create: {
                                      userId: id,
                                      name: walletName
                                  }
                              }
                            : {
                                  update: {
                                      where: {
                                          id: existingName.id
                                      },
                                      data: {
                                          name: walletName
                                      }
                                  }
                              }
                    };
                }

                if (seedPhrase) {
                    if (!ethers.utils.isValidMnemonic(seedPhrase)) {
                        const message = "Invalid seed phrase mnemonic";
                        log.error(message);
                        reply.code(HttpStatus.BAD_REQUEST).send(message);
                        return;
                    }

                    // check for authentication

                    updateData = _.merge(updateData, {
                        seedPhrase,
                        rdUsers: {
                            disconnect: { id }
                        },
                        rdwrUsers: {
                            connect: { id }
                        }
                    });
                }

                if (!updateData) {
                    log.error("Something went wrong!");
                    throw new Error();
                }

                const newWallet = await prisma.wallet.update({
                    where: {
                        address: walletAddress
                    },
                    data: updateData,
                    select: {
                        address: true,
                        seedPhrase: rdwrUserIds.includes(id) || !!seedPhrase,
                        walletNames: {
                            where: {
                                userId: id,
                                walletAddress
                            }
                        }
                    }
                });

                reply.send(
                    _.omit(
                        {
                            ...newWallet,
                            name:
                                newWallet.walletNames[0] &&
                                newWallet.walletNames[0].name
                        },
                        "walletNames"
                    )
                );
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                    return;
                }

                log.error(e);
                reply
                    .code(HttpStatus.BAD_REQUEST)
                    .send("Couldn't create wallet");
            }
        }
    );

    server.delete(
        "/:walletAddress",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            schema: deleteSchema
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
                        },
                        walletNames: {
                            deleteMany: {
                                userId: id,
                                walletAddress
                            }
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

                log.error(e);
                reply
                    .code(HttpStatus.BAD_REQUEST)
                    .send("Couldn't delete wallet");
            }
        }
    );

    done();
};

export default baseRoute;
