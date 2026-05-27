import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/features/auth';

/**
 * Protected route group.
 * Anonymous users are bounced to the login screen.
 *
 * Phase 4 will replace this Stack with a Tabs navigator
 * (Home / Programs / Exercises / Profile).
 */
export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
