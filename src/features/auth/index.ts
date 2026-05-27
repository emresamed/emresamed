/**
 * Public surface of the auth feature.
 * Outside code should ONLY import from `@/features/auth` (not deeper paths)
 * so we can refactor internals freely.
 */
export { useAuth } from './hooks/useAuth';
export { useAuthBootstrap } from './hooks/useAuthBootstrap';
export {
  useSignIn,
  useSignUp,
  useResetPassword,
  useSignOut,
} from './hooks/useAuthMutations';
export { authService } from './services/authService';
