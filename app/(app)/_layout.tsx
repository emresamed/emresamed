import { Redirect, Stack } from "expo-router";

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { routes } from "@/navigation/routes";

export default function ProtectedAppLayout() {
  const { isInitializing, session } = useAuthSession();

  if (isInitializing) {
    return <AuthLoadingScreen />;
  }

  if (!session) {
    return <Redirect href={routes.auth.login} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
