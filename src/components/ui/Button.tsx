import { ActivityIndicator, Pressable, type PressableProps } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "ghost";

type ButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  ghost: "border border-border bg-transparent"
};

const labelClasses: Record<ButtonVariant, string> = {
  primary: "text-slate-950",
  ghost: "text-slate-200"
};

export function Button({
  className,
  disabled,
  label,
  loading = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "min-h-14 items-center justify-center rounded-button px-5",
        variantClasses[variant],
        isDisabled && "opacity-60",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.text.inverted : colors.text.primary} />
      ) : (
        <AppText variant="body" className={cn("font-bold", labelClasses[variant])}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
