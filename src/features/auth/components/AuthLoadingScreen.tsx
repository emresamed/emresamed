import { ActivityIndicator, View } from "react-native";

import { AppScreen } from "@/components/ui/AppScreen";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";

export function AuthLoadingScreen() {
  return (
    <AppScreen>
      <View className="flex-1 items-center justify-center gap-4">
        <ActivityIndicator color={colors.brand.primary} size="large" />
        <AppText variant="caption">Checking your session...</AppText>
      </View>
    </AppScreen>
  );
}
