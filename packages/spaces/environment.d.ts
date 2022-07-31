declare global {
  namespace NodeJS {
    interface ProcessEnv {
      S3_ENDPOINT?: string
      S3_KEY?: string
      S3_SECRET?: string
    }
  }
}

export {}
