import fastify, { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import { prismaPlugin } from "./plugins";
import user from "./routes/user";
import users from "./routes/users";

const runServer = async () => {
    const server = fastify();
    await server.register(prismaPlugin);
    await server.register(swagger);
    await server.register(swaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "full",
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) {
                next();
            },
            preHandler: function (request, reply, next) {
                next();
            }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => {
            return swaggerObject;
        },
        transformSpecificationClone: true
    });

    server.register(
        (server: FastifyInstance, _: any, done: () => void) => {
            server.register(users, { prefix: "/users" });
            server.register(user, { prefix: "/user" });

            done();
        },
        { prefix: "/api/v1" }
    );

    server.get("/ping", async (_request, _reply) => {
        return "pong\n";
    });

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
