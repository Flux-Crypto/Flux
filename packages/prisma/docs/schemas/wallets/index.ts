import { WalletExample, WalletSchema } from "../apiSchema";

export default {
    post: {
        schema: {
            description:
                "Creates a wallet based on supplied wallet address and links to provided user id.",
            tags: ["wallets"],
            summary: "Creates user wallet.",
            params: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "user id"
                    }
                }
            },
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
                    description:
                        "Bad request. Missing user id or wallet address parameter.",
                    type: "null"
                },
                "5XX": {
                    description: "Unexpected error.",
                    type: "null"
                }
            }
        }
    },
    delete: {
        schema: {
            description:
                "Deletes (unlinks) a wallet based on supplied user id and wallet address.",
            tags: ["wallets"],
            summary: "Deletes user wallet.",
            params: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "user id"
                    },
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
                    description:
                        "Bad request. Missing user id or wallet address parameter.",
                    type: "null"
                },
                "5XX": {
                    description: "Unexpected error.",
                    type: "null"
                }
            }
        }
    }
};
