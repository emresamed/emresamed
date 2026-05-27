import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth, useAuthBootstrap } from '@/features/auth';
import { SplashGate } from '@/features/auth/components/SplashGate';
import { queryClient } from '@/lib/queryClient';
import { colors } from '@/theme';

/**
 * Root layout — wraps every route with providers and gates rendering
 * on the initial auth check. NEVER add business logic here.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg.DEFAULT }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <SessionGate>
            <RootStack />
          </SessionGate>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function SessionGate({ children }: { children: ReactNode }) {
  useAuthBootstrap();
  const { isLoading } = useAuth();
  if (isLoading) return <SplashGate />;
  return <>{children}</>;
}

function RootStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.DEFAULT },
        animation: 'fade',
      }}
    />
  );
}
