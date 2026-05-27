export type AuthFormErrors<T extends string> = Partial<Record<T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string) => {
  if (!email.trim()) {
    return "Email is required.";
  }

  if (!emailPattern.test(email.trim())) {
    return "Enter a valid email address.";
  }

  return undefined;
};

export const validatePassword = (password: string) => {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return undefined;
};

export const validateFullName = (fullName: string) => {
  if (!fullName.trim()) {
    return "Full name is required.";
  }

  if (fullName.trim().length < 2) {
    return "Full name is too short.";
  }

  return undefined;
};
