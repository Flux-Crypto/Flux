import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import transactionRoute from "./transaction";
import transactionsRoute from "./transactions";

const users = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(transactionsRoute, { prefix: "/transactions" });
    server.register(transactionRoute, { prefix: "/transaction" });

    done();
};

export default users;
