import { ScrollView, View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "@/utils/cn";

type AppScreenProps = ViewProps & {
  scrollable?: boolean;
};

export function AppScreen({ children, className, scrollable = false, ...props }: AppScreenProps) {
  const contentClassName = cn("flex-1 bg-canvas px-5", className);

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top", "left", "right"]}>
      {scrollable ? (
        <ScrollView
          className={contentClassName}
          contentContainerClassName="grow py-6"
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={contentClassName} {...props}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
