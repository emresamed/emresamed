import { supabase } from '@/lib/supabase';

export type SignInInput = { email: string; password: string };
export type SignUpInput = { email: string; password: string; fullName: string };

/**
 * Thin wrapper around Supabase auth.
 *
 * Each function THROWS on error — that's what React Query mutations expect.
 * Screens NEVER call supabase.auth.* directly; they always go through this layer.
 * This keeps the Supabase dependency replaceable and makes errors uniform.
 */
export const authService = {
  async signIn({ email, password }: SignInInput) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp({ email, password, fullName }: SignUpInput) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'gymbro://reset-password',
    });
    if (error) throw error;
  },
};
