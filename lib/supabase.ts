import { getOptionalEnv } from "./utils";

export type SupabaseConfig = {
  url?: string;
  anonKey?: string;
  serviceRoleKey?: string;
};

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: getOptionalEnv("SUPABASE_URL"),
    anonKey: getOptionalEnv("SUPABASE_ANON_KEY"),
    serviceRoleKey: getOptionalEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

