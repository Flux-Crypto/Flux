import * as Prisma from "@flux/prisma";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyServerOptions } from "fastify";
import fp from "fastify-plugin";

import { FastifyDone } from "@lib/types/fastifyTypes";

// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const prismaPlugin = fp(
    async (
        fastify: FastifyInstance,
        _opts: FastifyServerOptions,
        done: FastifyDone
    ) => {
        const { prisma } = await Prisma.createContext();

        await prisma.$connect();

        // Make Prisma Client available through the fastify server instance: server.prisma
        fastify.decorate("prisma", prisma);

        fastify.addHook("onClose", async (serv) => {
            await serv.prisma.$disconnect();
        });

        done();
    }
);

export default prismaPlugin;
