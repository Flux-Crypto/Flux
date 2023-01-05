declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
            NEXTAUTH_SECRET: string;
            NEXTAUTH_URL: string;
            API_HOSTNAME: string;
            EMAIL_USER: string;
            EMAIL_PASSWORD: string;
            EMAIL_HOST: string;
            EMAIL_PORT: string;
        }
    }
}

export {};
