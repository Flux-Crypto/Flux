import {
    ChainTransactionExample,
    ImportTransactionExample,
    UserExample,
    WalletExample,
    WalletNameExample
} from "@aurora/prisma/docs/schemas/apiSchema";
import jsonSchema from "@aurora/prisma/docs/schemas/json-schema.json";

export const swaggerOptions = {
    openapi: {
        openapi: "3.0.3",
        info: {
            title: "Aurora API Docs",
            description: "API Documentation for Aurora",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://127.0.0.1:8000"
            }
        ],
        tags: [
            { name: "users", description: "Global users endpoints" },
            { name: "user", description: "User specific endpoints" },
            { name: "wallets", description: "User wallets endpoints" },
            { name: "transactions", description: "User transactions endpoints" }
        ],
        components: {
            securitySchemes: {
                apiKey: {
                    type: "apiKey",
                    name: "apiKey",
                    in: "header"
                }
            },
            schemas: {
                User: {
                    ...jsonSchema.definitions.User,
                    example: UserExample
                },
                Wallet: {
                    ...jsonSchema.definitions.Wallet,
                    example: WalletExample
                },
                WalletName: {
                    ...jsonSchema.definitions.WalletName,
                    example: WalletNameExample
                },
                ImportTransaction: {
                    ...jsonSchema.definitions.ImportTransaction,
                    example: ImportTransactionExample
                },
                ChainTransaction: {
                    ...jsonSchema.definitions.ChainTransaction,
                    example: ChainTransactionExample
                }
            }
        },
        security: [
            {
                apiKey: [
                    // TODO: create fixed key in ENV vars or db
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlAYS5jb20iLCJzdWIiOiI2M2I3OWYyZGJlMjM3YTkxMjg3Y2FiYmUiLCJ1c2VyIjp7ImlkIjoiNjNiNzlmMmRiZTIzN2E5MTI4N2NhYmJlIiwiZW1haWwiOiJpQGEuY29tIiwiZW1haWxWZXJpZmllZCI6IjIwMjMtMDEtMDZUMDQ6MTA6MjguODk2WiIsImZpcnN0TmFtZSI6IiIsImxhc3ROYW1lIjoiIiwiYXBpS2V5IjoiIiwicHJvY2Vzc29yQVBJS2V5cyI6W10sImV4Y2hhbmdlQVBJS2V5cyI6W10sInJkV2FsbGV0QWRkcmVzc2VzIjpbXSwicmR3cldhbGxldEFkZHJlc3NlcyI6W10sIndhbGxldE5hbWVzIjpbXSwiaW1wb3J0VHJhbnNhY3Rpb25zIjpbXSwiY2hhaW5UcmFuc2FjdGlvbnMiOltdLCJjcmVhdGVkQXQiOiIyMDIzLTAxLTA2VDA0OjEwOjIxLjc0OFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTAxLTA2VDA0OjEwOjIxLjc0OFoifSwiaWF0IjoxNjczMzA4MTQ4LCJleHAiOjE2NzM5MTI5NDgsImp0aSI6IjUwNTYxY2I3LTEzNTctNGYxYi1iZWVlLThhMGNjMDNmMjlhNCJ9.cYda8V6lmQ4FEu8ls7K4IkRnuhiKLWpoGUIRvCtpPsY"
                ]
            }
        ]
    },
    hideUntagged: true
};

export const swaggerUIOptions = {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "list",
        deepLinking: false
    },
    staticCSP: true,
    transformSpecificationClone: true,
    exposeRoute: true
};
