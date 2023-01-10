import { FastifyInstance, FastifyServerOptions } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";

import transactionRoute from "./transaction";
import walletRoute from "./wallet";

const explorer = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(walletRoute, { prefix: "/wallet" });
    server.register(transactionRoute, { prefix: "/transaction" });

    done();
};

export default explorer;
