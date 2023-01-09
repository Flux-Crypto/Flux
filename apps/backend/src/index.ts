import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwtAuth from "@fastify/jwt";
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

import HttpStatus from "./lib/types/httpStatus";

const runServer = async () => {
    // TODO: fix
    const NODE_ENV = env.DOPPLER_ENVIRONMENT as "dev" | "stg" | "prd";

    const fastifyServer = fastify({
        logger: envToLogger[NODE_ENV] ?? true
    });

    // change this in
    await fastifyServer.register(cors, {
        origin: NODE_ENV === "dev" ? "*" : process.env.HOSTNAME
    });

    await fastifyServer.register(prismaPlugin);

    // fastifyServer.register(cookie, {
    //     secret: "__session", // for cookies signature
    //     parseOptions: {} // options for parsing cookies
    // } as FastifyCookieOptions);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    await fastifyServer.register(swagger, swaggerOptions);
    await fastifyServer.register(swaggerUI, swaggerUIOptions);
    await fastifyServer.register(jwtAuth, {
        secret: process.env.NEXTAUTH_SECRET as string
    });

    await fastifyServer.addHook("onRequest", async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(HttpStatus.BAD_REQUEST).send("Invalid authentication.");
        }
    });

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
