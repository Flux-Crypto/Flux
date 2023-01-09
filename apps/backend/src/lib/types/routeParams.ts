import { ImportTransaction } from "@prisma/client";

/**
 *  /users
 */
export interface UsersPostRequestBody {
    email: string;
}

export interface UsersPutRequestBody {
    email?: string;
    firstName?: string;
    lastName?: string;
    apiKey?: string;
    processorAPIKeys?: string[];
    exchangeAPIKeys?: string[];
}

/**
 *  /users?id=<userId>&email=<email>
 */
export interface UserRequestQuery {
    id: string;
    email: string;
}

/**
 * /users/:userId
 */
export interface UserRequestParams {
    userId: string;
}

/**
 * /users/:userId/transactions/:transactionId
 */
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
