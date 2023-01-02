/**
 * Wallet
 */
export const WalletSchema = {
    address: { type: "string" },
    userId: { type: "string" },
    readOnly: { type: "boolean" },
    seedPhrase: { type: "string" }
};

export const WalletExample = {
    address: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
    userId: "507f1f77bcf86cd799439011",
    readOnly: true,
    seedPhrase:
        "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
};

/**
 * Transaction
 */
export const TransactionSchema = {
    id: {
        type: "string"
    },
    date: {
        type: "string",
        format: "date-time"
    },
    receivedQuantity: {
        type: "number"
    },
    receivedCurrency: {
        type: "string"
    },
    sentQuantity: {
        type: "number"
    },
    sentCurrency: {
        type: "string"
    },
    feeAmount: {
        type: "number"
    },
    feeCurrency: {
        type: "string"
    },
    tag: {
        type: "string",
        enum: [
            "GIFT",
            "LOSS",
            "DONATION",
            "MARGIN_FEE",
            "FORK",
            "AIRDROP",
            "MINED",
            "PAYMENT",
            "STAKED",
            "MARGIN",
            "MARGIN_REBATE",
            "INTEREST",
            "INCOME"
        ]
    },
    user: {
        type: "string"
    }
};

export const TransactionExample = {
    id: "63b27824cc5b18dda70b8442",
    date: "06/14/2017 20:57:35",
    receivedQuantity: 0.5,
    receivedCurrency: "BTC",
    sentQuantity: 4005.8,
    sentCurrency: "USD",
    feeAmount: 0.00001,
    feeCurrency: "BTC",
    tag: "PAYMENT"
};

/**
 * User
 */
export const UserSchema = {
    id: { type: "string" },
    email: { type: "string" },
    name: { type: "string" },
    wallets: {
        type: "array",
        items: {
            type: "string"
        }
    },
    transactions: {
        type: "array",
        items: {
            type: "string"
        }
    }
};

export const UserExample = {
    id: "507f1f77bcf86cd799439011",
    email: "johndoe@email.com",
    name: "John Doe",
    processorAPIKeys: ["abcdef12345"],
    exchangeAPIKeys: ["uvwxyz67890"],
    wallets: ["0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"],
    transactions: ["63b27824cc5b18dda70b8442"]
};
