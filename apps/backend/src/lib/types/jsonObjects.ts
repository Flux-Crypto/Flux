/**
 * /users
 */
import TransactionsRootSchemaJSON from "@flux/prisma/docs/schemas/transactions";
import UserRootSchemaJSON from "@flux/prisma/docs/schemas/user";
import UsersRootSchemaJSON from "@flux/prisma/docs/schemas/users";
import WalletsRootSchemaJSON from "@flux/prisma/docs/schemas/wallets";

export type UsersRootSchema = typeof UsersRootSchemaJSON;
export type UserRootSchema = typeof UserRootSchemaJSON;
export type WalletsRootSchema = typeof WalletsRootSchemaJSON;
export type TransactionsRootSchema = typeof TransactionsRootSchemaJSON;
