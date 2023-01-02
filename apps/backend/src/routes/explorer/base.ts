import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@src/lib/types/fastifyTypes";

import transactionsRoute from "./transactions";

const users = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(transactionsRoute, { prefix: "/transactions" });

    done();
};

export default users;
