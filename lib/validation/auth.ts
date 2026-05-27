export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): ValidationResult {
  const value = email.trim();

  if (!value) {
    return { isValid: false, error: 'Email is required.' };
  }

  if (!EMAIL_REGEX.test(value)) {
    return { isValid: false, error: 'Enter a valid email address.' };
  }

  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required.' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters.' };
  }

  return { isValid: true };
}

export function validateFullName(fullName: string): ValidationResult {
  const value = fullName.trim();

  if (!value) {
    return { isValid: false, error: 'Full name is required.' };
  }

  if (value.length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters.' };
  }

  return { isValid: true };
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password.' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match.' };
  }

  return { isValid: true };
}
