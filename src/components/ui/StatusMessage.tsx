import { View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { cn } from "@/utils/cn";

type StatusMessageVariant = "error" | "success";

type StatusMessageProps = {
  message: string;
  variant?: StatusMessageVariant;
};

const variantClasses: Record<StatusMessageVariant, string> = {
  error: "border-danger/40 bg-danger/10",
  success: "border-success/40 bg-success/10"
};

const textClasses: Record<StatusMessageVariant, string> = {
  error: "text-red-200",
  success: "text-green-200"
};

export function StatusMessage({ message, variant = "error" }: StatusMessageProps) {
  return (
    <View className={cn("rounded-2xl border px-4 py-3", variantClasses[variant])}>
      <AppText variant="caption" className={textClasses[variant]}>
        {message}
      </AppText>
    </View>
  );
}
