import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./utils";

/**
 * Cliente de Supabase para uso en servidor (Route Handlers).
 *
 * Recomendación:
 * - Usa `SUPABASE_SERVICE_ROLE_KEY` en el servidor para inserts sin depender de RLS.
 * - Si no existe, cae a `SUPABASE_ANON_KEY` (requiere política RLS que permita insert).
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || requireEnv("SUPABASE_URL");
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    requireEnv("SUPABASE_ANON_KEY");

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
