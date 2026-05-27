import { Text } from "react-native";

import { Screen } from "../../src/components/ui/screen";
import { SectionCard } from "../../src/components/ui/section-card";

export default function ProfileScreen() {
  return (
    <Screen>
      <Text className="text-2xl font-bold text-text">Profile</Text>
      <SectionCard className="mt-4" title="Auth-ready architecture" subtitle="Persistent auth store is wired">
        <Text className="text-sm text-muted">Authentication screens and guards arrive in Phase 2.</Text>
      </SectionCard>
    </Screen>
  );
}
