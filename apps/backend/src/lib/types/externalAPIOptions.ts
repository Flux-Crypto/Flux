import { TokenMetadata } from "@prisma/client";
import { TokenMetadataResponse } from "alchemy-sdk";

export interface MoralisTransaction {
    transaction_hash: string;
    address: string;
    block_timestamp: string;
    block_number: string;
    block_hash: string;
    value: string;
    to_address: string;
    from_address: string;
    transaction_index: number;
    log_index: number;
}

export interface FormattedTransaction {
    transactionHash: string;
    blockTimestamp: string;
    blockHash: string;
    blockNumber: string;
    fromAddress: string;
    toAddress: string;
    value: string;
    token?: TokenMetadata;
}

export interface MoralisTokenMetadata extends TokenMetadataResponse {
    address: string;
}

export interface MoralisTransactionWithMetadata extends MoralisTransaction {
    token: MoralisTokenMetadata;
}
export interface MoralisTransactionsResponse {
    total: number;
    page: number;
    page_size: number;
    cursor: string;
    result: MoralisTransaction[];
}

export interface TokenTransactionsCollection {
    total: number;
    page: number;
    pageKey: string;
    result: MoralisTransaction[];
}

export interface QNTokenAsset {
    address: string;
    amount: number;
    chain: string;
    decimals: number;
    name: string;
    network: string;
    symbol: string;
    logoURI: string;
}
export interface QNTokenBalanceResult {
    assets: QNTokenAsset[];
    owner: string;
    totalPages: number;
    totalItems: number;
    pageNumber: number;
}

export interface QNTokenBalanceResponse {
    jsonrpc: string;
    id: number;
    result: QNTokenBalanceResult;
}

export interface TokenAsset {
    address: string;
    amount: number;
    decimals: number;
    name: string;
    symbol: string;
    logo: string;
}
