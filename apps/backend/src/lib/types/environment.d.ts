declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "staging";
            ALCHEMY_API_KEY: string;
            DB_URL: string;
        }
    }
}

export {};
