/**
 * /users
 */
import UsersIndexSchemaJSON from "@aurora/prisma/docs/schemas/users";
import UserTransactionsSchemaJSON from "@aurora/prisma/docs/schemas/users/transactions";
import UserSchemaJSON from "@aurora/prisma/docs/schemas/users/user";
import UserWalletsSchemaJSON from "@aurora/prisma/docs/schemas/users/wallets";

export type UsersIndexSchema = typeof UsersIndexSchemaJSON;
export type UserIndexSchema = typeof UserSchemaJSON;
export type UserWalletsSchema = typeof UserWalletsSchemaJSON;
export type UserTransactionsSchema = typeof UserTransactionsSchemaJSON;
