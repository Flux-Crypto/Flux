import IndexSchema from "@aurora/prisma/docs/schemas/users";
import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import rootRoute from "./root";

const users = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(rootRoute, IndexSchema);

    done();
};

export default users;
