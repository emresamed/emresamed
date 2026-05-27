import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { colors } from "@/constants/colors";
import { AppProviders } from "@/providers/AppProviders";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background.primary },
            headerShown: false
          }}
        />
        <StatusBar style="light" />
      </AppProviders>
    </GestureHandlerRootView>
  );
}
