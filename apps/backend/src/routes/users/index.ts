import TransactionsSchema from "@aurora/prisma/docs/schemas/transactions";
import IndexSchema from "@aurora/prisma/docs/schemas/users";
import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import baseRoute from "./base";
import transactionsRoute from "./transactions";

const users = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(baseRoute, IndexSchema);
    server.register(transactionsRoute, {
        prefix: "/:userId/transactions",
        ...TransactionsSchema
    });

    done();
};

export default users;
