import { AuthError, Session } from '@supabase/supabase-js';

import { supabase } from '@/services/api/supabase';

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthServiceResult {
  session: Session | null;
  error: AuthError | null;
}

export async function signInWithEmail({
  email,
  password,
}: SignInParams): Promise<AuthServiceResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  return { session: data.session, error };
}

export async function signUpWithEmail({
  email,
  password,
  fullName,
}: SignUpParams): Promise<AuthServiceResult> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
    },
  });

  return { session: data.session, error };
}

export async function resetPasswordForEmail(email: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

  return { error };
}
