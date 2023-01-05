import { ImportTransaction } from "@prisma/client";

/**
 *  /users
 */
export interface UsersRequestBody {
    email: string;
    firstName: string;
    lastName: string;
}

/**
 *  /users/:userId
 */
export interface UserRequestParams {
    userId: string;
}

export interface UsersTransactionsRequestParams extends UserRequestParams {
    transactionId: string;
}

/**
 *  /users/:userId/wallets
 */
export interface UserWalletsRequestBody {
    walletAddress: string;
    seedPhrase: string;
}

/**
 *  /users/:userId/wallets/:walletAddress
 */
export interface UserWalletsRequestParams extends UserRequestParams {
    walletAddress: string;
}

/**
 * /users/:userId/transactions
 */
export interface UserTransactionsRequestBody {
    transaction: ImportTransaction;
}

/**
 * /explorer/wallet/:walletAddress
 */
export interface ExplorerWalletRequestParams {
    walletAddress: string;
}

/**
 * /explorer/transaction/:transactionHash
 */
export interface ExplorerTransactionRequestParams {
    transactionHash: string;
}
