import { useMutation } from "@tanstack/react-query";

import {
  sendPasswordResetEmail,
  signInWithPassword,
  signOut,
  signUpWithPassword
} from "../../../services/auth/auth.service";

export const useSignInMutation = () => useMutation({ mutationFn: signInWithPassword });

export const useSignUpMutation = () => useMutation({ mutationFn: signUpWithPassword });

export const useForgotPasswordMutation = () => useMutation({ mutationFn: sendPasswordResetEmail });

export const useSignOutMutation = () => useMutation({ mutationFn: signOut });
