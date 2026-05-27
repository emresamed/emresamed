export type AuthUser = {
  id: string;
  email: string | null;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};
