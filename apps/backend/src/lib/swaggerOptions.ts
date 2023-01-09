import {
    ChainTransactionExample,
    ImportTransactionExample,
    UserExample,
    WalletExample
} from "@aurora/prisma/docs/schemas/apiSchema";
import jsonSchema from "@aurora/prisma/docs/schemas/json-schema.json";

export const swaggerOptions = {
    openapi: {
        openapi: "3.0.3",
        info: {
            title: "Aurora API Docs",
            description: "API Documentation for Aurora",
            version: "0.1.0"
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
            schemas: {
                User: {
                    ...jsonSchema.definitions.User,
                    example: UserExample
                },
                Wallet: {
                    ...jsonSchema.definitions.Wallet,
                    example: WalletExample
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
        }
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
