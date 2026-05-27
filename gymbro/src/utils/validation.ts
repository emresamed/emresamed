export const Validation = {
  isValidEmail: (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),

  isValidPassword: (password: string): boolean =>
    password.length >= 8,

  isNotEmpty: (value: string): boolean =>
    value.trim().length > 0,
};

export interface FormError {
  field: string;
  message: string;
}

export function validateSignIn(email: string, password: string): FormError[] {
  const errors: FormError[] = [];
  if (!Validation.isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address.' });
  }
  if (!Validation.isValidPassword(password)) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters.' });
  }
  return errors;
}

export function validateSignUp(
  email: string,
  password: string,
  fullName: string
): FormError[] {
  const errors = validateSignIn(email, password);
  if (!Validation.isNotEmpty(fullName)) {
    errors.push({ field: 'fullName', message: 'Full name is required.' });
  }
  return errors;
}
