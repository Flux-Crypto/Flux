import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
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
import { env } from "process";

import { prismaPlugin } from "@plugins/index";

import { envToLogger } from "@lib/logger";
import { swaggerOptions, swaggerUIOptions } from "@lib/swaggerOptions";
import { FastifyDone } from "@lib/types/fastifyTypes";
import explorer from "@routes/explorer/base";
import users from "@routes/users/base";

const runServer = async () => {
    // TODO: fix
    const NODE_ENV = env.DOPPLER_ENVIRONMENT as "dev" | "stg" | "prd";

    const fastifyServer = fastify({
        logger: envToLogger[NODE_ENV] ?? true
    });

    await fastifyServer.register(prismaPlugin);
    fastifyServer.register(cookie, {
        secret: "__session", // for cookies signature
        parseOptions: {} // options for parsing cookies
    } as FastifyCookieOptions);

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
            server.register(explorer, { prefix: "/explorer" });

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
            fastifyServer.log.fatal(err);
            process.exit(1);
        }
        fastifyServer.log.debug(`Server err at ${address}`);
    });
};

runServer();
