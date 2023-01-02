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

import { prismaPlugin } from "@plugins/index";

import { envToLogger } from "@lib/logger";
import { FastifyDone } from "@lib/types/fastifyTypes";
import users from "@routes/users/base";
import transactions from "@src/routes/explorer/transactions";

import SwaggerOptions from "@docs/options";

const runServer = async () => {
    const server = fastify({
        logger: envToLogger.development ?? true
    });

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
            server.log.fatal(err);
            process.exit(1);
        }
        server.log.debug(`Server listening at ${address}`);
    });
};

runServer();
