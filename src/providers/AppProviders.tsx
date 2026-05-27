import { QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/config/queryClient";
import { AuthSessionProvider } from "@/features/auth/providers/AuthSessionProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
