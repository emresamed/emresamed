import { Text, type TextProps } from "react-native";

import { cn } from "@shared/utils";

type TextVariant = "title" | "heading" | "body" | "caption";

type AppTextProps = TextProps & {
  variant?: TextVariant;
};

const variants: Record<TextVariant, string> = {
  title: "text-3xl font-extrabold leading-10 text-foreground",
  heading: "text-2xl font-bold leading-8 text-foreground",
  body: "text-base leading-6 text-foreground",
  caption: "text-sm font-medium leading-5 text-muted",
};

export function AppText({ className, variant = "body", ...props }: AppTextProps) {
  return <Text className={cn(variants[variant], className)} {...props} />;
}
