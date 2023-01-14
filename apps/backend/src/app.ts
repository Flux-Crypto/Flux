import authPlugin from "@fastify/auth";
import cors from "@fastify/cors";
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

import { apiKeyAuthPlugin, jwtAuthPlugin, prismaPlugin } from "@plugins/index";

import envToLogger from "@lib/logger";
import { swaggerOptions, swaggerUIOptions } from "@lib/swaggerOptions";
import { FastifyDone } from "@lib/types/fastifyTypes";
import explorer from "@routes/explorer";
import transactions from "@routes/transactions";
import user from "@routes/user";
import users from "@routes/users";
import wallets from "@routes/wallets";

const app = () => {
    // TODO: fix `Type 'undefined' cannot be used as an index type`
    const NODE_ENV = env.DOPPLER_ENVIRONMENT as "dev" | "test" | "stg" | "prd";

    const fastifyServer = fastify({
        logger: envToLogger[NODE_ENV] ?? true
    });

    fastifyServer.register(cors, {
        origin: NODE_ENV === "dev" ? "*" : process.env.CLIENT_HOSTNAME
    });
    fastifyServer.register(prismaPlugin);
    fastifyServer.register(jwtAuthPlugin);
    fastifyServer.register(apiKeyAuthPlugin);
    fastifyServer.register(authPlugin);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    fastifyServer.register(swagger, swaggerOptions);
    fastifyServer.register(swaggerUI, swaggerUIOptions);

    fastifyServer.register(
        (
            server: FastifyInstance,
            _opts: FastifyServerOptions,
            done: FastifyDone
        ) => {
            server.register(users, { prefix: "/users" });
            server.register(user, { prefix: "/user" });
            server.register(wallets, { prefix: "/wallets" });
            server.register(transactions, { prefix: "/transactions" });
            server.register(explorer, { prefix: "/explorer" });

            done();
        },
        { prefix: "/api/v1" }
    );

    fastifyServer.get(
        "/ping",
        async (_request: FastifyRequest, _reply: FastifyReply) => "pong\n"
    );

    return fastifyServer;
};

export default app;
