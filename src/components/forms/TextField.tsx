import { useState } from "react";
import { TextInput, type TextInputProps, View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";
import { cn } from "@/utils/cn";

type TextFieldProps = TextInputProps & {
  error?: string;
  label: string;
};

export function TextField({ className, error, label, onBlur, onFocus, ...props }: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="gap-2">
      <AppText variant="caption" className="text-slate-300">
        {label}
      </AppText>
      <TextInput
        className={cn(
          "min-h-14 rounded-2xl border bg-surface px-4 text-base text-white",
          isFocused ? "border-primary" : "border-border",
          error && "border-danger",
          className
        )}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        placeholderTextColor={colors.text.muted}
        {...props}
      />
      {error ? (
        <AppText variant="caption" className="text-danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
