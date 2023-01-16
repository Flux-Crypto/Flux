export interface Transaction {
    date: Date;
    receivedQuantity: number;
    receivedCurrency: string;
    sentQuantity: number;
    sentCurrency: string;
    feeAmount: number;
    feeCurrency: string;
    tags: string[];
}

export interface Token {
    address: string;
    decimals: number;
    logo: string;
    name: string;
    symbol: string;
}
export interface BlockchainTransaction {
    blockHash: string;
    blockNumber: string;
    blockTimestamp: string;
    fromAddress: string;
    toAddress: string;
    gas: number;
    gasPrice: string;
    transactionHash: string;
    value: string;
    token: Token;
}

export interface BlockchainTransactionsResponse {
    page: number;
    pageKey: string | null;
    total: number;
    result: BlockchainTransaction[];
}

export interface UserWallet {
    address: string;
    seedPhrase?: string;
    name: string;
}

export interface UserWallets {
    rdWallets: UserWallet[];
    rdwrWallets: UserWallet[];
}
