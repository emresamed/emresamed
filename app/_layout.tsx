import "../global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";

import { AppProviders } from "@app/providers/AppProviders";
import { colors } from "@shared/theme";

export default function RootLayout() {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, []);

  return (
    <AppProviders>
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerShown: false }} />
    </AppProviders>
  );
}
