import type { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@features/auth/providers/AuthProvider";
import { queryClient } from "@services/api";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SafeAreaProvider>
            <StatusBar style="light" />
            {children}
          </SafeAreaProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
