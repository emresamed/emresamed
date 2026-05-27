import { Redirect, Slot } from "expo-router";

import { useAuth } from "@features/auth";
import { AppText, Screen } from "@shared/components";

export default function ProtectedAppLayout() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <Screen contentClassName="items-center justify-center">
        <AppText className="text-muted" variant="caption">
          Loading your session...
        </AppText>
      </Screen>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
