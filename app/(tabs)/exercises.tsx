import { View } from 'react-native';

import { Card, Screen, Text } from '@/components/ui';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export default function ExercisesScreen() {
  return (
    <Screen scrollable contentClassName="px-4 pt-4">
      <Text variant="title">Exercises</Text>
      <Text variant="body" className="mt-2 mb-6">
        Explore exercises organized by muscle group.
      </Text>

      <View className="flex-row flex-wrap gap-3">
        {MUSCLE_GROUPS.map((group) => (
          <Card key={group} className="w-[47%]">
            <Text variant="label">{group}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
