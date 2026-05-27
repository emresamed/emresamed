import "react-native-url-polyfill/auto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@shared/config/env";
import type { Database } from "@app-types/database";

import { secureStorage } from "./secureStorage";

let client: SupabaseClient<Database> | null = null;

export const getSupabaseClient = () => {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase environment variables are required before using the API client.");
  }

  if (!client) {
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
