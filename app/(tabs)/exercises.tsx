import { Text } from "react-native";

import { Screen } from "../../src/components/ui/screen";
import { SectionCard } from "../../src/components/ui/section-card";

export default function ExercisesScreen() {
  return (
    <Screen>
      <Text className="text-2xl font-bold text-text">Exercise Explorer</Text>
      <SectionCard className="mt-4" title="Foundation ready" subtitle="Exercise service and hook are already structured">
        <Text className="text-sm text-muted">Muscle group filtering will be built in Phase 4.</Text>
      </SectionCard>
    </Screen>
  );
}
