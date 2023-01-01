/**
 * /users
 */
import UsersIndexSchemaJSON from "../docs/schemas/users/index.json";
import UserSchemaJSON from "../docs/schemas/users/user.json";
import UserWalletsSchemaJSON from "../docs/schemas/users/wallets.json";
import UserTransactionsSchemaJSON from "../docs/schemas/users/transactions.json";

export type UsersIndexSchema = typeof UsersIndexSchemaJSON;
export type UserIndexSchema = typeof UserSchemaJSON;
export type UserWalletsSchema = typeof UserWalletsSchemaJSON;
export type UserTransactionsSchema = typeof UserTransactionsSchemaJSON;
