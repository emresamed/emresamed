import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { AppProviders } from "../src/app/providers/app-providers";
import { useAuthSession } from "../src/features/auth/hooks/use-auth-session";
import { useAuthState } from "../src/features/auth/hooks/use-auth-state";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized } = useAuthState();

  useAuthSession();

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isInitialized, router, segments]);

  return (
    <AppProviders>
      <StatusBar style="light" />

      {!isInitialized ? (
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator color="#22D3EE" size="large" />
        </View>
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0B0F14" }
          }}
        />
      )}
    </AppProviders>
  );
}
