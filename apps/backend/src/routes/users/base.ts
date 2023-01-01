import { FastifyInstance } from "fastify";

import index from "./index";
import user from "./user";
import transactions from "./transactions";
import wallets from "./wallets";
import IndexSchema from "../../../docs/schemas/users/index.json";
import UserSchema from "../../../docs/schemas/users/user.json";
import WalletsSchema from "../../../docs/schemas/users/wallets.json";
import TransactionsSchema from "../../../docs/schemas/users/transactions.json";

const users = (server: FastifyInstance, _opts: any, done: () => void) => {
    server.register(index, IndexSchema);
    server.register(user, { prefix: "/:userId", ...UserSchema });
    server.register(wallets, { prefix: "/:userId/wallets", ...WalletsSchema });
    server.register(transactions, {
        prefix: "/:userId/transactions",
        ...TransactionsSchema
    });

    done();
};

export default users;
