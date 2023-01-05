/**
 * /users
 */
import UsersIndexSchemaJSON from "@docs/schemas/users"
import UserTransactionsSchemaJSON from "@docs/schemas/users/transactions"
import UserSchemaJSON from "@docs/schemas/users/user"
import UserWalletsSchemaJSON from "@docs/schemas/users/wallets"

export type UsersIndexSchema = typeof UsersIndexSchemaJSON
export type UserIndexSchema = typeof UserSchemaJSON
export type UserWalletsSchema = typeof UserWalletsSchemaJSON
export type UserTransactionsSchema = typeof UserTransactionsSchemaJSON
