import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getRequiredEnvValue } from "@/config/env";
import { secureStorage } from "@/services/supabase/secureStorage";

let supabaseClient: SupabaseClient | null = null;

export function createSupabaseClient() {
  return createClient(getRequiredEnvValue("supabaseUrl"), getRequiredEnvValue("supabaseAnonKey"), {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: secureStorage
    }
  });
}

export function getSupabaseClient() {
  supabaseClient ??= createSupabaseClient();

  return supabaseClient;
}
