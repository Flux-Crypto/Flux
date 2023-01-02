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

import { FastifyDone } from "@lib/types/fastifyTypes";
import users from "@routes/users/base";
import transactions from "@src/routes/transactions";

import { swaggerOptions, swaggerUIOptions } from "@docs/options";

const runServer = async () => {
    const fastifyServer = fastify();

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
            console.error(err);
            process.exit(1);
        }
        console.info(`Server listening at ${address}`);
    });
};

runServer();
