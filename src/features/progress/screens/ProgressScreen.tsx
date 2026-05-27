import { FeaturePlaceholder } from "@shared/components";

export function ProgressScreen() {
  return (
    <FeaturePlaceholder
      description="Progress tracking will use focused queries and chart-ready domain models when that phase begins."
      eyebrow="Progress"
      items={["Workout history", "Personal records", "Weekly training statistics"]}
      title="Measure progress"
    />
  );
}
