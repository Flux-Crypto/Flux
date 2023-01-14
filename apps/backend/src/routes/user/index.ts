import UserSchema from "@aurora/prisma/docs/schemas/user";
import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import rootRoute from "./root";

const user = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(rootRoute, UserSchema);

    done();
};

export default user;
