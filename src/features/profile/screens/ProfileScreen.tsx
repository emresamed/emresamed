import { FeaturePlaceholder } from "@shared/components";

export function ProfileScreen() {
  return (
    <FeaturePlaceholder
      description="Profile and account state will connect to the authentication feature in Phase 2."
      eyebrow="Profile"
      items={["Session-aware profile area", "User preferences store", "Account settings routes"]}
      title="Athlete profile"
    />
  );
}
