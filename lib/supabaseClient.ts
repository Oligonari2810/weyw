import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./utils";
import { getSupabaseConfig } from "./supabase";

/**
 * Cliente de Supabase para uso en servidor (Route Handlers).
 *
 * Recomendación:
 * - Usa `SUPABASE_SERVICE_ROLE_KEY` en el servidor para inserts sin depender de RLS.
 * - Si no existe, cae a `SUPABASE_ANON_KEY` (requiere política RLS que permita insert).
 */
export function getSupabaseServerClient() {
  const cfg = getSupabaseConfig();
  const url = cfg.url ?? requireEnv("SUPABASE_URL");
  const key =
    cfg.serviceRoleKey ??
    cfg.anonKey ??
    requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

