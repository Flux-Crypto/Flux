import * as Prisma from "@flux/prisma";
import { PrismaClient } from "@prisma/client";
import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyServerOptions
} from "fastify";
import fp from "fastify-plugin";

// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const prismaPlugin: FastifyPluginAsync = fp(
    async (fastify: FastifyInstance, _opts: FastifyServerOptions) => {
        const { prisma } = await Prisma.createContext();

        await prisma.$connect();

        // Make Prisma Client available through the fastify server instance: server.prisma
        fastify.decorate("prisma", prisma);

        fastify.addHook("onClose", async (serv) => {
            await serv.prisma.$disconnect();
        });
    }
);

export default prismaPlugin;
