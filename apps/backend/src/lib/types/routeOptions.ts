import { ImportTransaction } from "@prisma/client";
import { IncomingHttpHeaders } from "http";

/**
 * Global
 */
export interface APIAuthenticationHeaders extends IncomingHttpHeaders {
    "x-api-key": string;
}

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
    id?: string;
    email?: string;
}

/**
 * /transactions/:transactionId
 */
export interface TransactionsRequestParams {
    transactionId: string;
}

/**
 *  /wallets
 */
export interface WalletsRequestPostBody {
    walletAddress: string;
    seedPhrase?: string;
}

/**
 *  /wallets/:walletAddress
 */
export interface WalletsRequestParams {
    walletAddress: string;
}

export interface WalletsRequestPutBody {
    seedPhrase?: string;
    walletName?: string;
}

/**
 * /transactions
 */
export interface TransactionsRequestBody {
    transactions: ImportTransaction[];
}

/**
 * /explorer/wallet/:walletAddress
 */
export interface ExplorerWalletRequestHeaders extends IncomingHttpHeaders {
    "x-page-key": string;
}

export interface ExplorerWalletRequestParams {
    walletAddress: string;
}

/**
 * /explorer/transaction/:transactionHash
 */
export interface ExplorerTransactionRequestParams {
    transactionHash: string;
}
