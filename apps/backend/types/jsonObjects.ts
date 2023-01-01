/**
 * /users
 */
import UsersIndexSchemaJSON from "../docs/schemas/users/index.json";

export type UsersIndexSchema = typeof UsersIndexSchemaJSON;

/**
 * /user
 */
import UserIndexSchemaJSON from "../docs/schemas/user/index.json";
import UserWalletsSchemaJSON from "../docs/schemas/user/wallets.json";
import UserTransactionsSchemaJSON from "../docs/schemas/user/transactions.json";

export type UserIndexSchema = typeof UserIndexSchemaJSON;
export type UserWalletsSchema = typeof UserWalletsSchemaJSON;
export type UserTransactionsSchema = typeof UserTransactionsSchemaJSON;
