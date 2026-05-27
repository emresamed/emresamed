import { View, type ViewProps } from "react-native";

import { cn } from "@/utils/cn";

type CardProps = ViewProps & {
  elevated?: boolean;
};

export function Card({ className, elevated = false, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-card border border-border bg-surface p-5",
        elevated && "bg-surface-soft",
        className
      )}
      {...props}
    />
  );
}
