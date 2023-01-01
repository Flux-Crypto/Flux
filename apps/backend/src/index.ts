import fastify, { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

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
