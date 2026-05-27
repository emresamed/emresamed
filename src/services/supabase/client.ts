import "react-native-url-polyfill/auto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@shared/config/env";
import type { Database } from "@app-types/database";

import { secureStorage } from "./secureStorage";

let client: SupabaseClient<Database> | null = null;

export const getSupabaseClient = () => {
  if (!client) {
    const env = getPublicEnv();

    client = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
        storage: secureStorage,
      },
    });
  }

  return client;
};
