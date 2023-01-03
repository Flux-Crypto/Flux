/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * Wallet
 */
export const WalletSchema = {
    address: {
        type: "string"
    },
    seedPhrase: {
        type: ["string", "null"],
        default: ""
    },
    rdUsers: {
        type: "array",
        items: {
            type: "string"
        }
    },
    rdwrUsers: {
        type: "array",
        items: {
            type: "string"
        }
    }
};

export const WalletExample = {
    address: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
    seedPhrase:
        "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur",
    userId: "507f1f77bcf86cd799439011"
};

/**
 * WalletName
 */
export const WalletNameSchema = {
    address: {
        type: "string"
    },
    name: {
        type: "string"
    }
};

/**
 * Transaction
 */
export const TransactionSchema = {
    id: {
        type: "string"
    },
    hash: {
        type: ["string", "null"]
    },
    date: {
        type: "string",
        format: "date-time"
    },
    receivedQuantity: {
        type: "number",
        default: 0
    },
    receivedCurrency: {
        type: "string",
        default: ""
    },
    sentQuantity: {
        type: "number",
        default: 0
    },
    sentCurrency: {
        type: "string",
        default: ""
    },
    feeAmount: {
        type: "number",
        default: 0
    },
    feeCurrency: {
        type: "string",
        default: ""
    },
    tag: {
        type: ["string", "null"],
        default: "PAYMENT"
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
    id: {
        type: "string"
    },
    email: {
        type: "string"
    },
    name: {
        type: ["string", "null"]
    },
    processorAPIKeys: {
        type: "array",
        items: {
            type: "string"
        }
    },
    exchangeAPIKeys: {
        type: "array",
        items: {
            type: "string"
        }
    },
    rdWallets: {
        type: "array",
        items: {
            type: "object",
            properties: WalletSchema
        }
    },
    rdwrWallets: {
        type: "array",
        items: {
            type: "object",
            properties: WalletSchema
        }
    },
    walletNames: {
        type: "array",
        items: {
            type: "object",
            properties: WalletNameSchema
        }
    },
    transactions: {
        type: "array",
        items: {
            type: "object",
            properties: TransactionSchema
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
