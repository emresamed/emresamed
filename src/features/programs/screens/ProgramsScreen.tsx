import { FeaturePlaceholder } from "@shared/components";

export function ProgramsScreen() {
  return (
    <FeaturePlaceholder
      description="Workout programs will be loaded from Supabase and cached through React Query in a later phase."
      eyebrow="Programs"
      items={["Program catalog", "Training plan detail routes", "Followed plan state"]}
      title="Training programs"
    />
  );
}
