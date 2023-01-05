declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
            CLERK_API_KEY: string;
            CLERK_JWT_KEY: string;
            NEXT_PUBLIC_CLERK_FRONTEND_API: string;
            API_HOSTNAME: string;
        }
    }
}

export {};
