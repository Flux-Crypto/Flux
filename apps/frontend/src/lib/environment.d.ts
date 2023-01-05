declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
            NEXTAUTH_SECRET: string;
            NEXTAUTH_URL: string;
            API_HOSTNAME: string;
        }
    }
}

export {};
