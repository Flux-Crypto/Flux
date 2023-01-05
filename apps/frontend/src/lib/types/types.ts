export interface Transaction {
    date: string;
    receivedQuantity: number;
    receivedCurrency: string;
    sentQuantity: number;
    sentCurrency: string;
    feeAmount: number;
    feeCurrency: string;
    tag: string;
}

export interface ClerkAuthError {
    errors: {
        code: string;
        longMessage: string;
        message: string;
    }[];
}
