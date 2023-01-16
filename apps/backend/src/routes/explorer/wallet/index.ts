import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import infoRoute from "./info/root";
import rootRoute from "./root";

const wallet = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(rootRoute);
    server.register(infoRoute, { prefix: "/:walletAddress/info" });

    done();
};

export default wallet;
