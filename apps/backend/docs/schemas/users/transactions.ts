import _ from "lodash";

import { TransactionExample, TransactionSchema } from "../apiSchema";

export default {
    get: {
        schema: {
            description: "Gets user transactions based on supplied user id.",
            tags: ["users"],
            summary: "Gets user transactions.",
            params: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "user id"
                    }
                }
            },
            response: {
                "200": {
                    description: "OK",
                    type: "array",
                    items: {
                        type: "object",
                        properties: TransactionSchema,
                        example: TransactionExample
                    }
                },
                "400": {
                    description:
                        "Bad request. Missing user id or transaction id parameter.",
                    type: "null"
                },
                "5XX": {
                    description: "Unexpected error.",
                    type: "null"
                }
            }
        }
    },
    post: {
        schema: {
            description:
                "Creates a transaction for a provided user based on supplied transaction details.",
            tags: ["users"],
            summary: "Creates user transaction.",
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
                properties: _.omit(TransactionSchema, ["id"])
            },
            response: {
                "201": {
                    description: "Successful creation.",
                    type: "object",
                    properties: TransactionSchema,
                    example: TransactionExample
                },
                "400": {
                    description:
                        "Bad request. Missing user id or transaction parameter.",
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
                "Deletes a transaction based on supplied user id and transaction id.",
            tags: ["users"],
            summary: "Deletes user transaction.",
            params: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "user id"
                    },
                    transactionId: {
                        type: "string",
                        description: "database id of transaction"
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
