/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * Wallet
 */
export const WalletSchema = {
    address: {
        type: "string"
    },
    seedPhrase: {
        type: ["string", "null"]
    },
    rdUserIds: {
        type: "array",
        items: {
            type: "string"
        }
    },
    rdwrUserIds: {
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
    rdUserIds: ["507f1f77bcf86cd799439011"],
    rdwrUserIds: ["63b3b68e4e23a9f08b4630e2"]
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

export const WalletNameExample = {
    address: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
    name: "My Personal Wallet"
};

/**
 * ImportTransaction
 */
export const ImportTransactionSchema = {
    id: {
        type: "string"
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
        type: ["string", "null"]
    }
};

export const ImportTransactionExample = {
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
 * ChainTransaction
 */
export const ChainTransactionSchema = {
    hash: {
        type: "string"
    },
    tag: {
        type: ["string", "null"]
    }
};

export const ChainTransactionExample = {
    hash: "0x839b28928a32459391db977632d7be2ce1cf93505ba2e19cdcf63bfe312ba062",
    tag: "AIRDROP"
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
    importTransactions: {
        type: "array",
        items: {
            type: "object",
            properties: ImportTransactionSchema
        }
    },
    chainTransactions: {
        type: "array",
        items: {
            type: "object",
            properties: ChainTransactionSchema
        }
    }
};

export const UserExample = {
    id: "507f1f77bcf86cd799439011",
    email: "johndoe@email.com",
    name: "John Doe",
    processorAPIKeys: ["abcdef12345"],
    exchangeAPIKeys: ["uvwxyz67890"],
    rdWallets: ["0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"],
    rdwrWallets: ["0xd0451f62be92c2e45dbafbf0a9aa5fd42f1798ea"],
    walletNames: [
        {
            address: "0xd0451f62be92c2e45dbafbf0a9aa5fd42f1798ea",
            name: "My Personal Wallet"
        }
    ],
    importTransactions: ["63b27824cc5b18dda70b8442"],
    chainTransactions: [
        "0x839b28928a32459391db977632d7be2ce1cf93505ba2e19cdcf63bfe312ba062"
    ]
};
