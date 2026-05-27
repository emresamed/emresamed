import { View } from "react-native";

import { AppText } from "./AppText";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ description, eyebrow, title }: SectionHeaderProps) {
  return (
    <View className="gap-2">
      {eyebrow ? (
        <AppText className="uppercase tracking-[2px] text-primary" variant="caption">
          {eyebrow}
        </AppText>
      ) : null}
      <AppText variant="title">{title}</AppText>
      {description ? <AppText variant="caption">{description}</AppText> : null}
    </View>
  );
}
