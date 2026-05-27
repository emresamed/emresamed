import type {
  FieldErrors,
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues
} from "@/features/auth/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minimumPasswordLength = 8;

export function validateEmail(email: string) {
  if (!email.trim()) {
    return "Email is required.";
  }

  if (!emailPattern.test(email.trim())) {
    return "Enter a valid email address.";
  }

  return undefined;
}

export function validateLogin(values: LoginFormValues) {
  const errors: FieldErrors<LoginFormValues> = {};
  const emailError = validateEmail(values.email);

  if (emailError) {
    errors.email = emailError;
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function validateRegister(values: RegisterFormValues) {
  const errors: FieldErrors<RegisterFormValues> = {};
  const emailError = validateEmail(values.email);

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (emailError) {
    errors.email = emailError;
  }

  if (values.password.length < minimumPasswordLength) {
    errors.password = `Password must be at least ${minimumPasswordLength} characters.`;
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateForgotPassword(values: ForgotPasswordFormValues) {
  const errors: FieldErrors<ForgotPasswordFormValues> = {};
  const emailError = validateEmail(values.email);

  if (emailError) {
    errors.email = emailError;
  }

  return errors;
}

export function hasValidationErrors(errors: Record<string, string | undefined>) {
  return Object.values(errors).some(Boolean);
}
