import { Text } from "react-native";

import { Screen } from "../../src/components/ui/screen";
import { SectionCard } from "../../src/components/ui/section-card";

export default function ProgramsScreen() {
  return (
    <Screen>
      <Text className="text-2xl font-bold text-text">Workout Programs</Text>
      <SectionCard className="mt-4" title="Coming next" subtitle="Phase 4 will render real program cards">
        <Text className="text-sm text-muted">Service hooks are ready in src/features/programs/hooks.</Text>
      </SectionCard>
    </Screen>
  );
}
