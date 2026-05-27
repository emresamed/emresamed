import { Stack } from 'expo-router';

/**
 * Public (unauthenticated) route group.
 * Phase 2 will add login / register / forgot-password screens here.
 */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
