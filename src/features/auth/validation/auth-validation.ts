const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthFieldErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export const validateEmail = (email: string): string | undefined => {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return "Email is required.";
  }

  if (!emailRegex.test(normalizedEmail)) {
    return "Enter a valid email address.";
  }

  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return undefined;
};

export const validateSignInFields = (input: { email: string; password: string }): AuthFieldErrors => {
  return {
    email: validateEmail(input.email),
    password: validatePassword(input.password)
  };
};

export const validateSignUpFields = (input: {
  email: string;
  password: string;
  confirmPassword: string;
}): AuthFieldErrors => {
  const errors: AuthFieldErrors = {
    email: validateEmail(input.email),
    password: validatePassword(input.password)
  };

  if (!input.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export const hasAuthErrors = (errors: AuthFieldErrors) => Object.values(errors).some(Boolean);
