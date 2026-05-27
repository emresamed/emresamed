import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import type { ForgotPasswordPayload, SignInPayload, SignUpPayload } from "../../types/auth";
import { getSupabaseClient } from "../supabase/client";

export const signInWithPassword = async ({ email, password }: SignInPayload) => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }
};

export const signUpWithPassword = async ({ email, password }: SignUpPayload) => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message);
  }
};

export const sendPasswordResetEmail = async ({ email }: ForgotPasswordPayload) => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentSession = async (): Promise<Session | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
};

export const subscribeToAuthChanges = (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
  const supabase = getSupabaseClient();

  return supabase.auth.onAuthStateChange(callback);
};
