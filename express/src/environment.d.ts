declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined
            PORT?: string
            AUTO_EMPTY_TMP?: 'true' | 'false'
            RTMP_URL?: string
            JWT_SECRET: string
            ORIGIN: string
            DATABASE_URL: string
            BUCKET_NAME: string
            BUCKET_ENDPOINT: string
            BUCKET_REGION: string
            BUCKET_ACCESS_KEY_ID: string
            BUCKET_SECRET_ACCESS_KEY: string
        }
    }
}

export {}
