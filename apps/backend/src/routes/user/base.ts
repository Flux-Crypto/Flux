import { FastifyInstance } from "fastify";

import base from ".";
import transactions from "./transactions";
import wallets from "./wallets";

const user = (server: FastifyInstance, _opts: any, done: () => void) => {
    server.register(base);
    server.register(wallets, { prefix: "/wallets" });
    server.register(transactions, { prefix: "/transactions" });

    done();
};

export default user;
