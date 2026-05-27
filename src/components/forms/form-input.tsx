import type { ComponentProps } from "react";
import { Text, TextInput, View } from "react-native";

type FormInputProps = {
  label: string;
  error?: string;
} & ComponentProps<typeof TextInput>;

export const FormInput = ({ label, error, ...inputProps }: FormInputProps) => {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-text">{label}</Text>
      <TextInput
        {...inputProps}
        className="rounded-2xl border border-border bg-surface px-4 py-3 text-base text-text"
        placeholderTextColor="#64748B"
      />
      {error ? <Text className="mt-2 text-xs text-danger">{error}</Text> : null}
    </View>
  );
};
