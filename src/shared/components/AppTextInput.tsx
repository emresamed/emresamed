import { TextInput, View, type TextInputProps } from "react-native";

import { colors } from "@shared/theme";
import { cn } from "@shared/utils";

import { AppText } from "./AppText";

type AppTextInputProps = TextInputProps & {
  error?: string;
  label: string;
};

export function AppTextInput({ className, error, label, ...props }: AppTextInputProps) {
  return (
    <View className="gap-2">
      <AppText className="font-semibold text-foreground" variant="caption">
        {label}
      </AppText>
      <TextInput
        autoCapitalize="none"
        className={cn(
          "h-14 rounded-2xl border border-border bg-surface-muted px-4 text-base text-foreground",
          error && "border-danger",
          className,
        )}
        placeholderTextColor={colors.foregroundMuted}
        selectionColor={colors.primary}
        {...props}
      />
      {error ? (
        <AppText className="text-danger" variant="caption">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
