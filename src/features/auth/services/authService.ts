import type { Session } from "@supabase/supabase-js";

import { authConfig } from "@/config/auth";
import type { LoginFormValues, RegisterFormValues } from "@/features/auth/types";
import { getSupabaseClient } from "@/services/supabase/client";

export async function getCurrentSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export function subscribeToAuthChanges(onSessionChange: (session: Session | null) => void) {
  const {
    data: { subscription }
  } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
    onSessionChange(session);
  });

  return () => subscription.unsubscribe();
}

export async function signInWithPassword(values: LoginFormValues) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: values.email.trim(),
    password: values.password
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUpWithPassword(values: RegisterFormValues) {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email: values.email.trim(),
    password: values.password,
    options: {
      data: {
        full_name: values.fullName.trim()
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function requestPasswordReset(email: string) {
  const { data, error } = await getSupabaseClient().auth.resetPasswordForEmail(email.trim(), {
    redirectTo: authConfig.passwordResetRedirectTo
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut();

  if (error) {
    throw error;
  }
}
