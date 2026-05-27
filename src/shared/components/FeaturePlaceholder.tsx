import { AppCard } from "./AppCard";
import { AppText } from "./AppText";
import { Screen } from "./Screen";
import { SectionHeader } from "./SectionHeader";

type FeaturePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
};

export function FeaturePlaceholder({ description, eyebrow, items, title }: FeaturePlaceholderProps) {
  return (
    <Screen scroll>
      <SectionHeader description={description} eyebrow={eyebrow} title={title} />
      <AppCard className="gap-4">
        {items.map((item) => (
          <AppText className="text-muted" key={item} variant="body">
            • {item}
          </AppText>
        ))}
      </AppCard>
    </Screen>
  );
}
