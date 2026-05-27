import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "react-native";
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
        <StatusBar backgroundColor={colors.background.primary} barStyle="light-content" />
      </AppProviders>
    </GestureHandlerRootView>
  );
}
