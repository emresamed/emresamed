import { Redirect, Stack } from 'expo-router';

import { ROUTES } from '@/constants/routes';
import { colors } from '@/constants/theme';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function AuthLayout() {
  const { isInitialized, isAuthenticated } = useAuthGuard();

  if (!isInitialized) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href={ROUTES.tabs.home} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
