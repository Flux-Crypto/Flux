import prisma from "@backend/plugins/prisma";
import transactions from "@backend/routes/transactions";
import user from "@backend/routes/user";
import users from "@backend/routes/users";
import swagger from "@fastify/swagger";
// @ts-ignore:next-line
import swaggerUI from "@fastify/swagger-ui";
import fastify, { FastifyInstance } from "fastify";

const runServer = async () => {
    const server = fastify();
    await server.register(prisma);
    await server.register(swagger);
    await server.register(swaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "full",
            deepLinking: false
        },
        uiHooks: {
            onRequest(request, reply, next) {
                next();
            },
            preHandler(request, reply, next) {
                next();
            }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) =>
            swaggerObject,
        transformSpecificationClone: true
    });

    server.register(
        (server: FastifyInstance, _: any, done: () => void) => {
            server.register(users, { prefix: "/users" });
            server.register(user, { prefix: "/user" });
            server.register(transactions, { prefix: "/transactions" });
            done();
        },
        { prefix: "/api/v1" }
    );

    server.get("/ping", async (_request, _reply) => "pong\n");

    await server.ready();
    server.listen({ port: 8000 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
};

runServer();
