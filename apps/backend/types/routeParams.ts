import { Transaction } from "@prisma/client";

/**
 *  /users
 */
export interface UsersRequestBody {
    email: string;
    name?: string;
}

/**
 *  /user/:userId
 */
export interface UserRequestParams {
    userId: string;
}

/**
 *  /user/:userId
 */
export interface UserWalletsRequestBody {
    walletAddress: string;
}

/**
 *  /user/:userId/wallets/:walletId
 */
export interface UserWalletsRequestParams {
    walletId: string;
}

/**
 * /user/:userId/transactions
 */
export interface UserTransactionsRequestBody {
    transaction: Transaction;
}
