import { Text, type TextProps } from "react-native";

import { cn } from "@/utils/cn";

type AppTextVariant = "heading" | "title" | "body" | "caption";

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
};

const variantClasses: Record<AppTextVariant, string> = {
  heading: "text-4xl font-extrabold leading-tight text-white",
  title: "text-2xl font-bold leading-8 text-white",
  body: "text-base leading-6 text-slate-200",
  caption: "text-sm font-medium leading-5 text-slate-400"
};

export function AppText({ className, variant = "body", ...props }: AppTextProps) {
  return <Text className={cn(variantClasses[variant], className)} {...props} />;
}
