import WalletsSchema from "@flux/prisma/docs/schemas/wallets";
import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import baseRoute from "./base";

const wallets = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(baseRoute, WalletsSchema);

    done();
};

export default wallets;
