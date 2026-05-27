import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";

import { cn } from "../../utils/cn";

type SectionCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  className?: string;
}>;

export const SectionCard = ({ title, subtitle, className, children }: SectionCardProps) => {
  return (
    <View className={cn("rounded-card border border-border bg-surface p-4", className)}>
      <Text className="text-base font-semibold text-text">{title}</Text>
      {subtitle ? <Text className="mt-1 text-sm text-muted">{subtitle}</Text> : null}
      <View className="mt-4">{children}</View>
    </View>
  );
};
