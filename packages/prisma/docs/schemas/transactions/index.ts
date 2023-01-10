import _ from "lodash";

import {
    ImportTransactionExample,
    ImportTransactionSchema
} from "../apiSchema";

export default {
    get: {
        schema: {
            description: "Gets user transactions based on supplied user id.",
            tags: ["transactions"],
            summary: "Gets user transactions.",
            response: {
                "200": {
                    description: "OK",
                    type: "array",
                    items: {
                        type: "object",
                        properties: ImportTransactionSchema,
                        example: ImportTransactionExample
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
                "Creates transactions for a provided user based on supplied transactions details.",
            tags: ["transactions"],
            summary: "Creates user transactions.",
            body: {
                type: "object",
                properties: {
                    transactions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: _.omit(ImportTransactionSchema, ["id"])
                        }
                    }
                },
                examples: [
                    { transactions: [_.omit(ImportTransactionExample, ["id"])] }
                ]
            },
            response: {
                "201": {
                    description: "Successful creation.",
                    type: "object",
                    properties: ImportTransactionSchema,
                    example: ImportTransactionExample
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
            tags: ["transactions"],
            summary: "Deletes user transaction.",
            params: {
                type: "object",
                properties: {
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
