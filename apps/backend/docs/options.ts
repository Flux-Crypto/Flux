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
        components: {
            schemas: {
                User: jsonSchema.definitions.User,
                Wallet: jsonSchema.definitions.Wallet
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
    transformSpecification: (swaggerObject: any, request: any, reply: any) => {
        return swaggerObject;
    },
    transformSpecificationClone: true,
    exposeRoute: true
};

export default {
    swaggerOptions,
    swaggerUIOptions
};
