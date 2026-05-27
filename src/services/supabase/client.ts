import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

import { env } from "../../config/env";

const hasSupabaseConfig =
  Boolean(env.EXPO_PUBLIC_SUPABASE_URL) && Boolean(env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = hasSupabaseConfig;

export const supabase = hasSupabaseConfig
  ? createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.EXPO_PUBLIC_SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null;

export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return supabase;
};
