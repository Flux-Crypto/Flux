declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DOPPLER_ENVIRONMENT: "dev" | "test" | "stg" | "prd";
            CLIENT_HOSTNAME: string;
            ALCHEMY_API_KEY: string;
            ETHERSCAN_API_KEY: string;
            INFURA_API_KEY: string;
            MORALIS_API_KEY: string;
            QUICKNODE_API_KEY: string;
            DB_URL: string;
            NEXTAUTH_SECRET: string;
        }
    }
}

export {};
