import { FastifyInstance } from "fastify";

import { prisma } from "../index";
import {
    UserRequestParams,
    UserWalletsRequestParams
} from "src/types/routeParams";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const user = (server: FastifyInstance, _: any, done: () => void) => {
    server.post("/:userId/wallets", async (request, reply) => {
        const { userId } = request.params as UserRequestParams;

        if (!userId) {
            console.error(
                `[${new Date().toISOString()}] error: missing user id param`
            );
            reply.code(400).send("error: missing user id param");
        }

        const { walletAddress } = request.body as UserWalletsRequestParams;

        try {
            const wallet = await prisma.wallet.create({
                data: {
                    address: walletAddress,
                    userId
                }
            });

            return wallet;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                const message = `error: ${e.message}`;
                console.error(`[${new Date().toISOString()}] ${message}`);
                reply.code(500).send(`error: ${message}`);
            }
            const message = "error: creating wallet";
            console.error(`[${new Date().toISOString()}] ${message}`);
            reply.code(500).send(message);
        }
    });

    done();
};

export default user;
