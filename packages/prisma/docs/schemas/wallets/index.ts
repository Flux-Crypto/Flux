import { WalletExample, WalletSchema } from "../apiSchema";

export default {
    get: {
        description: "Gets all wallets linked to a provided user.",
        tags: ["wallets"],
        summary: "gets user wallets.",
        response: {
            "200": {
                description: "OK.",
                type: "object",
                properties: {
                    rdWallets: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                ...WalletSchema,
                                name: { type: "string" }
                            }
                        }
                    },
                    rdwrWallets: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                ...WalletSchema,
                                name: { type: "string" }
                            }
                        }
                    }
                },
                example: {
                    rdWallets: [WalletExample]
                }
            },
            "400": {
                description: "Bad request. Couldn't find user.",
                type: "null"
            },
            "5XX": {
                description: "Unexpected error.",
                type: "null"
            }
        }
    },
    post: {
        description:
            "Creates a wallet based on supplied wallet address and links to provided user.",
        tags: ["wallets"],
        summary: "Creates user wallet.",
        body: {
            type: "object",
            properties: {
                walletAddress: { type: "string" }
            }
        },
        response: {
            "201": {
                description: "Successful creation and linking.",
                type: "object",
                properties: WalletSchema,
                example: WalletExample
            },
            "400": {
                description: "Bad request. Missing wallet address parameter.",
                type: "null"
            },
            "5XX": {
                description: "Unexpected error.",
                type: "null"
            }
        }
    },
    delete: {
        description:
            "Deletes (unlinks) a wallet for user based on wallet address.",
        tags: ["wallets"],
        summary: "Deletes user wallet.",
        params: {
            type: "object",
            properties: {
                walletAddress: {
                    type: "string",
                    description: "address of wallet"
                }
            }
        },
        response: {
            "204": {
                description: "Successful deletion and unlinking.",
                type: "null"
            },
            "400": {
                description: "Bad request. Missing wallet address parameter.",
                type: "null"
            },
            "5XX": {
                description: "Unexpected error.",
                type: "null"
            }
        }
    }
};
