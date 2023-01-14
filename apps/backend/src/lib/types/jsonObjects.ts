/**
 * /users
 */
import TransactionsBaseSchemaJSON from "@flux/prisma/docs/schemas/transactions";
import UserBaseSchemaJSON from "@flux/prisma/docs/schemas/user";
import UsersBaseSchemaJSON from "@flux/prisma/docs/schemas/users";
import WalletsBaseSchemaJSON from "@flux/prisma/docs/schemas/wallets";

export type UsersBaseSchema = typeof UsersBaseSchemaJSON;
export type UserBaseSchema = typeof UserBaseSchemaJSON;
export type WalletsBaseSchema = typeof WalletsBaseSchemaJSON;
export type TransactionsBaseSchema = typeof TransactionsBaseSchemaJSON;
