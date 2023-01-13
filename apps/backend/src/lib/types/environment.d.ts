declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
            CLIENT_HOSTNAME: string;
            ALCHEMY_API_KEY: string;
            DB_URL: string;
            NEXTAUTH_SECRET: string;
        }
    }
}

export {};
