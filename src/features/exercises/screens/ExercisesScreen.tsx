import { FeaturePlaceholder } from "@shared/components";

export function ExercisesScreen() {
  return (
    <FeaturePlaceholder
      description="Exercise browsing will stay isolated in this feature slice with dedicated hooks and services."
      eyebrow="Exercises"
      items={["Muscle group filters", "Exercise detail routes", "Favorite exercise actions"]}
      title="Exercise explorer"
    />
  );
}
