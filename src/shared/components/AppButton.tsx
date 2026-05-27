import { ActivityIndicator, Pressable, type PressableProps } from "react-native";

import { colors } from "@shared/theme";
import { cn } from "@shared/utils";

import { AppText } from "./AppText";

type AppButtonVariant = "primary" | "secondary";

type AppButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  variant?: AppButtonVariant;
};

const variants: Record<AppButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "border border-border bg-surface-muted",
};

export function AppButton({
  className,
  disabled,
  label,
  loading = false,
  variant = "primary",
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      className={cn(
        "h-14 items-center justify-center rounded-2xl px-5",
        variants[variant],
        (disabled || loading) && "opacity-60",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.foreground} />
      ) : (
        <AppText className="font-bold" variant="body">
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
