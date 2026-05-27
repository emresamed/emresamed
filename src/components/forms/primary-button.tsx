import { ActivityIndicator, Pressable, Text } from "react-native";

type PrimaryButtonProps = {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export const PrimaryButton = ({ label, loading = false, disabled = false, onPress }: PrimaryButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      className={`h-12 items-center justify-center rounded-2xl ${isDisabled ? "bg-surfaceElevated" : "bg-primary"}`}
      disabled={isDisabled}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color="#0B0F14" />
      ) : (
        <Text className={`text-sm font-semibold ${isDisabled ? "text-muted" : "text-background"}`}>{label}</Text>
      )}
    </Pressable>
  );
};
