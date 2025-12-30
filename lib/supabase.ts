import { createClient, SupabaseClient } from "@supabase/supabase-js";
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

// Create and export the Supabase client instance used by the app.
// Falls back to process.env if getOptionalEnv doesn't provide a value.
const supabaseUrl = getSupabaseConfig().url ?? process.env.SUPABASE_URL ?? "";
const supabaseAnonKey = getSupabaseConfig().anonKey ?? process.env.SUPABASE_ANON_KEY ?? "";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
