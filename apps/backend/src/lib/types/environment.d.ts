declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
            HOSTNAME: string;
            ALCHEMY_API_KEY: string;
            DB_URL: string;
        }
    }
}

export {};
