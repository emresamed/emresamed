import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "../../utils/cn";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
}>;

export const Screen = ({ children, scroll = false, className, contentClassName }: ScreenProps) => {
  if (scroll) {
    return (
      <SafeAreaView className={cn("flex-1 bg-background", className)}>
        <ScrollView
          contentContainerClassName={cn("px-5 py-4", contentClassName)}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={cn("flex-1 bg-background", className)}>
      <View className={cn("flex-1 px-5 py-4", contentClassName)}>{children}</View>
    </SafeAreaView>
  );
};
