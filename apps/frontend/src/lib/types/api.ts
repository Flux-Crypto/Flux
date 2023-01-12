export interface Transaction {
    date: Date;
    receivedQuantity: number;
    receivedCurrency: string;
    sentQuantity: number;
    sentCurrency: string;
    feeAmount: number;
    feeCurrency: string;
    tag: string;
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
