declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd"
            ALCHEMY_API_KEY: string
            DB_URL: string
        }
    }
}

export {}
