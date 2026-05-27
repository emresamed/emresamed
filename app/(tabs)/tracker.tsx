import { Text } from "react-native";

import { Screen } from "../../src/components/ui/screen";
import { SectionCard } from "../../src/components/ui/section-card";

export default function TrackerScreen() {
  return (
    <Screen>
      <Text className="text-2xl font-bold text-text">Workout Tracker</Text>
      <SectionCard className="mt-4" title="Store scaffold complete" subtitle="Zustand workout session store exists">
        <Text className="text-sm text-muted">Timers, sets/reps, and save flow are planned for Phase 5.</Text>
      </SectionCard>
    </Screen>
  );
}
