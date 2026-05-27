import { Dumbbell } from "lucide-react-native";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";

type AuthFormContainerProps = {
  children: ReactNode;
  footer?: ReactNode;
  subtitle: string;
  title: string;
};

export function AuthFormContainer({ children, footer, subtitle, title }: AuthFormContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerClassName="grow justify-center gap-8 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-5">
            <View className="h-16 w-16 items-center justify-center rounded-3xl bg-primary">
              <Dumbbell color={colors.text.inverted} size={30} strokeWidth={2.6} />
            </View>

            <View className="gap-3">
              <AppText variant="caption" className="uppercase tracking-[3px] text-primary-soft">
                GymBro
              </AppText>
              <AppText variant="heading">{title}</AppText>
              <AppText className="text-slate-400">{subtitle}</AppText>
            </View>
          </View>

          <View className="gap-5">{children}</View>

          {footer ? <View className="items-center">{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
