import { TokenMetadata } from "@prisma/client";

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

export interface MoralisTransactionWithMetadata extends MoralisTransaction {
    token: TokenMetadata;
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
