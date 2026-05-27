import { Text } from "react-native";

type FormMessageProps = {
  message: string;
  variant?: "error" | "success";
};

export const FormMessage = ({ message, variant = "error" }: FormMessageProps) => {
  const colorClass = variant === "error" ? "text-danger" : "text-accent";

  return <Text className={`mb-3 text-sm ${colorClass}`}>{message}</Text>;
};
