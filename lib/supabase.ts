import { getOptionalEnv } from "./utils";

export type SupabaseConfig = {
  url?: string;
  anonKey?: string;
};

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: getOptionalEnv("SUPABASE_URL"),
    anonKey: getOptionalEnv("SUPABASE_ANON_KEY"),
  };
}

