interface Environment {
    readonly DATABASE_URL: string;
    readonly API_PORT: number;
    readonly NEXT_PUBLIC_API_URL: string;
  
    TZ?: string | undefined;
  
    [key: string]: string | number | undefined;
}

interface ImportMetaEnv extends Environment {}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
interface ProcessEnv extends Environment {}
}  