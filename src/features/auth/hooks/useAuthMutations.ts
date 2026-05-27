import { useMutation } from '@tanstack/react-query';

import { authService, type SignInInput, type SignUpInput } from '../services/authService';

/**
 * One mutation per auth action. Loading + error state come from React Query.
 *
 * No `onSuccess` writes to the auth store: the Supabase listener
 * (useAuthBootstrap) updates the store reactively for every auth event,
 * so we never end up with two sources of truth.
 */

export function useSignIn() {
  return useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: (input: SignInInput) => authService.signIn(input),
  });
}

export function useSignUp() {
  return useMutation({
    mutationKey: ['auth', 'signUp'],
    mutationFn: (input: SignUpInput) => authService.signUp(input),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationKey: ['auth', 'resetPassword'],
    mutationFn: (email: string) => authService.resetPassword(email),
  });
}

export function useSignOut() {
  return useMutation({
    mutationKey: ['auth', 'signOut'],
    mutationFn: () => authService.signOut(),
  });
}
