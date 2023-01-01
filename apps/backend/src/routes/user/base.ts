import { FastifyInstance } from "fastify";

import index from "./index";
import transactions from "./transactions";
import wallets from "./wallets";
import IndexSchema from "../../../docs/schemas/user/index.json";
import WalletsSchema from "../../../docs/schemas/user/wallets.json";
import TransactionsSchema from "../../../docs/schemas/user/transactions.json";

const user = (server: FastifyInstance, _opts: any, done: () => void) => {
    server.register(index, IndexSchema);
    server.register(wallets, { prefix: "/wallets", ...WalletsSchema });
    server.register(transactions, {
        prefix: "/transactions",
        ...TransactionsSchema
    });

    done();
};

export default user;
