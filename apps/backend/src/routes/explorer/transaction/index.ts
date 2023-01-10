import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import baseRoute from "./base";

const transaction = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(baseRoute, { prefix: "/transaction" });

    done();
};

export default transaction;
