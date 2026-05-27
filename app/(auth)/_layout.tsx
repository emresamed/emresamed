import { Redirect, Stack } from "expo-router";

import { useAuth } from "@features/auth";
import { colors } from "@shared/theme";

export default function AuthLayout() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (!isInitializing && isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShown: false,
      }}
    />
  );
}
