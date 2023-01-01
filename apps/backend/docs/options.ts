import jsonSchema from "./schemas/json-schema.json";

const swaggerOptions = {
    openapi: {
        openapi: "3.0.3",
        info: {
            title: "Aurora API Docs",
            description: "API Documentation for Aurora",
            version: "0.1.0"
        },
        servers: [
            {
                url: "http://localhost"
            }
        ],
        tags: [{ name: "users", description: "User specific endpoints" }],
        components: {
            schemas: {
                User: jsonSchema.definitions.User,
                Wallet: jsonSchema.definitions.Wallet,
                Transaction: jsonSchema.definitions.Transaction
            }
        }
    },
    hideUntagged: true
};

const swaggerUIOptions = {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "list",
        deepLinking: false
    },
    staticCSP: true,
    transformSpecification: (swaggerObject: any, _request: any, _reply: any) =>
        swaggerObject,
    transformSpecificationClone: true,
    exposeRoute: true
};

export default {
    swaggerOptions,
    swaggerUIOptions
};
