import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";

import { getSupabaseClient } from "./client";

type RegisterInput = {
  email: string;
  fullName: string;
  password: string;
};

type SignInInput = {
  email: string;
  password: string;
};

type AuthListener = (event: AuthChangeEvent, session: Session | null) => void;

export const authService = {
  getSession: async () => {
    const { data, error } = await getSupabaseClient().auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;
  },
  onAuthStateChange: (listener: AuthListener) => {
    const { data } = getSupabaseClient().auth.onAuthStateChange(listener);
    return data.subscription;
  },
  register: async ({ email, fullName, password }: RegisterInput) => {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: Linking.createURL("/"),
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },
  resetPassword: async (email: string) => {
    const { data, error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL("/login"),
    });

    if (error) {
      throw error;
    }

    return data;
  },
  signIn: async ({ email, password }: SignInInput) => {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },
  signOut: async () => {
    const { error } = await getSupabaseClient().auth.signOut();

    if (error) {
      throw error;
    }
  },
};
