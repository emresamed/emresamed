import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

import { getRequiredEnvValue } from "@/config/env";

export function createSupabaseClient() {
  return createClient(getRequiredEnvValue("supabaseUrl"), getRequiredEnvValue("supabaseAnonKey"), {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: AsyncStorage
    }
  });
}
