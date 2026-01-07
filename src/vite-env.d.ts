/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_AI_PROVIDER: string;
  readonly VITE_AI_API_KEY: string;
  readonly VITE_EMERGENCY_NUMBER: string;
  readonly VITE_AMBULANCE_NUMBER: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
