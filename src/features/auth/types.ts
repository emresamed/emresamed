export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = LoginFormValues & {
  confirmPassword: string;
  fullName: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;
