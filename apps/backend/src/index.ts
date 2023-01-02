import SwaggerOptions from "@docs/options";

// eslint-disable-next-line import/no-extraneous-dependencies
import swagger from "@fastify/swagger";
// eslint-disable-next-line import/no-extraneous-dependencies
import swaggerUI from "@fastify/swagger-ui";
import fastify, {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions
} from "fastify";

import transactions from "@src/routes/transactions";

import { FastifyDone } from "@lib/types/fastifyTypes";

import users from "@routes/users/base";

import { prismaPlugin } from "@plugins/index";

const runServer = async () => {
    const server = fastify();

    await server.register(prismaPlugin);

    const { swaggerOptions, swaggerUIOptions } = SwaggerOptions;

    // @ts-ignore:next-line
    await server.register(swagger, swaggerOptions);
    await server.register(swaggerUI, swaggerUIOptions);

    server.register(
        (
            server: FastifyInstance,
            _opts: FastifyServerOptions,
            done: FastifyDone
        ) => {
            server.register(users, { prefix: "/users" });
            server.register(transactions, { prefix: "/transactions" });

            done();
        },
        { prefix: "/api/v1" }
    );

    server.get(
        "/ping",
        async (_request: FastifyRequest, _reply: FastifyReply) => "pong\n"
    );

    await server.ready();
    server.listen({ port: 8000 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.info(`Server listening at ${address}`);
    });
};

runServer();
