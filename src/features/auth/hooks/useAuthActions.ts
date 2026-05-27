import { useState } from "react";

import {
  requestPasswordReset,
  signInWithPassword,
  signOut,
  signUpWithPassword
} from "@/features/auth/services/authService";
import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues
} from "@/features/auth/types";
import { getAuthErrorMessage } from "@/features/auth/utils/errors";
import { useAuthStore } from "@/store/authStore";

export function useAuthActions() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setAuthError = useAuthStore((state) => state.setAuthError);

  async function runAuthAction<T>(action: () => Promise<T>) {
    setError(null);
    setAuthError(null);
    setIsLoading(true);

    try {
      return await action();
    } catch (authError) {
      const message = getAuthErrorMessage(authError);
      setError(message);
      setAuthError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    error,
    isLoading,
    requestPasswordReset: (values: ForgotPasswordFormValues) =>
      runAuthAction(() => requestPasswordReset(values.email)),
    signIn: (values: LoginFormValues) => runAuthAction(() => signInWithPassword(values)),
    signOut: () => runAuthAction(signOut),
    signUp: (values: RegisterFormValues) => runAuthAction(() => signUpWithPassword(values))
  };
}
