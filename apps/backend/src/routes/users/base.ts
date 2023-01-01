import index from "./index";
import transactions from "./transactions";
import user from "./user";
import wallets from "./wallets";
import IndexSchema from "@docs/schemas/users/index.json";
import TransactionsSchema from "@docs/schemas/users/transactions.json";
import UserSchema from "@docs/schemas/users/user.json";
import WalletsSchema from "@docs/schemas/users/wallets.json";
import { FastifyInstance } from "fastify";

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
