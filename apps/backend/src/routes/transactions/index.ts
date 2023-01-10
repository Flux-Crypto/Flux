import TransactionsSchema from "@aurora/prisma/docs/schemas/transactions";
import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import baseRoute from "./base";

const transactions = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(baseRoute, TransactionsSchema);

    done();
};

export default transactions;
