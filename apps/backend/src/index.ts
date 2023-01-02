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

import { swaggerOptions, swaggerUIOptions } from "@docs/options";

const runServer = async () => {
    const fastifyServer = fastify({
        logger: envToLogger.development ?? true
    });

    await fastifyServer.register(prismaPlugin);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    await fastifyServer.register(swagger, swaggerOptions);
    await fastifyServer.register(swaggerUI, swaggerUIOptions);

    fastifyServer.register(
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

    fastifyServer.get(
        "/ping",
        async (_request: FastifyRequest, _reply: FastifyReply) => "pong\n"
    );

    await fastifyServer.ready();
    fastifyServer.listen({ port: 8000 }, (err, address) => {
        if (err) {
            server.log.fatal(err);
            process.exit(1);
        }
        server.log.debug(`Server listening at ${address}`);
    });
};

runServer();
