import { AuthError } from '@supabase/supabase-js';

export function getAuthErrorMessage(error: AuthError | Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }

  if (message.includes('user already registered')) {
    return 'An account with this email already exists.';
  }

  if (message.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }

  if (message.includes('password should be at least')) {
    return 'Password must be at least 6 characters.';
  }

  if (message.includes('unable to validate email address')) {
    return 'Enter a valid email address.';
  }

  if (message.includes('rate limit')) {
    return 'Too many attempts. Please try again later.';
  }

  if (message.includes('network')) {
    return 'Network error. Check your connection and try again.';
  }

  return error.message || 'Something went wrong. Please try again.';
}
