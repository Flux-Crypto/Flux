import TransactionsSchema from "@aurora/prisma/docs/schemas/transactions";
import IndexSchema from "@aurora/prisma/docs/schemas/users";
import WalletsSchema from "@aurora/prisma/docs/schemas/wallets";
import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@src/lib/types/fastifyTypes";

import baseRoute from "./base";
import transactionsRoute from "./transactions";
import walletsRoute from "./wallets";

const users = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(baseRoute, IndexSchema);
    server.register(walletsRoute, {
        prefix: "/:userId/wallets",
        ...WalletsSchema
    });
    server.register(transactionsRoute, {
        prefix: "/:userId/transactions",
        ...TransactionsSchema
    });

    done();
};

export default users;
