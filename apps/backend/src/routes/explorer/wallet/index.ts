import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import baseRoute from "./base";

const wallet = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(baseRoute, { prefix: "/wallet" });

    done();
};

export default wallet;
