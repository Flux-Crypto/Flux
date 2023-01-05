declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
            NEXTAUTH_SECRET: string;
            NEXTAUTH_URL: string;
            API_HOSTNAME: string;
            EMAIL_SERVER_USER: string;
            EMAIL_SERVER_PASSWORD: string;
            EMAIL_SERVER_HOST: string;
            EMAIL_SERVER_PORT: number;
            EMAIL_FROM: string;
        }
    }
}

export {};
