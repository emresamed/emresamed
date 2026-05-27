import { Text, View } from "react-native";

import { Screen } from "../../src/components/ui/screen";
import { SectionCard } from "../../src/components/ui/section-card";

export default function HomeScreen() {
  return (
    <Screen scroll>
      <Text className="text-3xl font-bold text-text">GymBro</Text>
      <Text className="mt-2 text-sm text-muted">Build consistency. Track progress. Train smarter.</Text>

      <SectionCard
        className="mt-6"
        title="Today at a glance"
        subtitle="MVP placeholders for upcoming phases"
      >
        <View className="gap-2">
          <Text className="text-sm text-text">• Programs and exercises will be loaded from Supabase.</Text>
          <Text className="text-sm text-text">• Workout tracker starts in Phase 5.</Text>
          <Text className="text-sm text-text">• Progress dashboards land in Phase 6.</Text>
        </View>
      </SectionCard>
    </Screen>
  );
}
