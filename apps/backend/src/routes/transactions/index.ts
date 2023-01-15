import TransactionsSchema from "@flux/prisma/docs/schemas/transactions";
import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import rootRoute from "./root";

const transactions = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(rootRoute, TransactionsSchema);

    done();
};

export default transactions;
