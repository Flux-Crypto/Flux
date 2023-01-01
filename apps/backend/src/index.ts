import prisma from "@backend/plugins/prisma";
import transactions from "@backend/routes/transactions";
import user from "@backend/routes/user";
import users from "@backend/routes/users";
import swagger from "@fastify/swagger";
// @ts-ignore:next-line
import swaggerUI from "@fastify/swagger-ui";
import fastify, { FastifyInstance } from "fastify";

import SwaggerOptions from "../docs/options";
import { prismaPlugin } from "./plugins";
import users from "./routes/users/base";

const runServer = async () => {
    const server = fastify();

    await server.register(prismaPlugin);

    const { swaggerOptions, swaggerUIOptions } = SwaggerOptions;
    // @ts-ignore
    await server.register(swagger, swaggerOptions);
    await server.register(swaggerUI, swaggerUIOptions);

    server.register(
        (server: FastifyInstance, _opts: any, done: () => void) => {
            server.register(users, { prefix: "/users" });
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
