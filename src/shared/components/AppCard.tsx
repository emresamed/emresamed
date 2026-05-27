import { View, type ViewProps } from "react-native";

import { cn } from "@shared/utils";

type AppCardProps = ViewProps & {
  elevated?: boolean;
};

export function AppCard({ className, elevated = false, ...props }: AppCardProps) {
  return (
    <View
      className={cn(
        "rounded-card border border-border bg-surface p-5",
        elevated && "shadow-lg shadow-black/30",
        className,
      )}
      {...props}
    />
  );
}
