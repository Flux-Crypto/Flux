import WalletsSchema from "@flux/prisma/docs/schemas/wallets";
import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import rootRoute from "./root";

const wallets = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(rootRoute, WalletsSchema);

    done();
};

export default wallets;
