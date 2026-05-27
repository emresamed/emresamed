import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/features/auth';

/**
 * Public (unauthenticated) route group.
 * Authenticated users are bounced to the tabs — they shouldn't see auth screens.
 */
export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
