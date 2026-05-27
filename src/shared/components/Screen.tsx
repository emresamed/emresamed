import type { PropsWithChildren } from "react";
import { ScrollView, View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "@shared/utils";

type ScreenProps = PropsWithChildren<
  ViewProps & {
    scroll?: boolean;
    contentClassName?: string;
  }
>;

export function Screen({ children, className, contentClassName, scroll = false, ...props }: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      className={cn("flex-1", contentClassName)}
      contentContainerClassName="gap-5 px-5 pb-8"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={cn("flex-1 gap-5 px-5 pb-8", contentClassName)}>{children}</View>
  );

  return (
    <SafeAreaView className={cn("flex-1 bg-background", className)} edges={["top"]} {...props}>
      {content}
    </SafeAreaView>
  );
}
