/**
 * Tiny dependency-free validators.
 * Returning a discriminated union lets callers do `if (!result.valid) ...`
 * with TypeScript narrowing the error message.
 */
export type ValidationResult = { valid: true } | { valid: false; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: 'Email is required' };
  if (!EMAIL_RE.test(trimmed)) return { valid: false, message: 'Enter a valid email address' };
  return { valid: true };
}

export function validatePassword(value: string): ValidationResult {
  if (!value) return { valid: false, message: 'Password is required' };
  if (value.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
  return { valid: true };
}

export function validateName(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: 'Name is required' };
  if (trimmed.length < 2) return { valid: false, message: 'Name is too short' };
  return { valid: true };
}
