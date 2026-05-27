import { View } from 'react-native';

import { Card, Screen, Text } from '@/components/ui';

export default function ProgramsScreen() {
  return (
    <Screen scrollable contentClassName="px-4 pt-4">
      <Text variant="title">Programs</Text>
      <Text variant="body" className="mt-2 mb-6">
        Browse structured workout programs tailored to your goals.
      </Text>

      <View className="gap-4">
        {['Push Pull Legs', 'Full Body Strength', 'Hypertrophy Split'].map((program) => (
          <Card key={program}>
            <Text variant="subtitle">{program}</Text>
            <Text variant="caption" className="mt-1">
              Coming in Phase 4
            </Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
