import { View } from 'react-native';

import { Card, Screen, Text } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';

export default function HomeScreen() {
  return (
    <Screen scrollable contentClassName="px-4 pt-4">
      <View className="mb-6">
        <Text variant="caption" className="uppercase tracking-widest text-primary">
          Welcome back
        </Text>
        <Text variant="title" className="mt-1">
          {APP_CONFIG.name}
        </Text>
        <Text variant="body" className="mt-2">
          Your premium gym companion. Track workouts, explore programs, and crush your goals.
        </Text>
      </View>

      <Card className="mb-4">
        <Text variant="subtitle">Today&apos;s Focus</Text>
        <Text variant="body" className="mt-2">
          Foundation ready. Workout tracking arrives in Phase 5.
        </Text>
      </Card>

      <Card>
        <Text variant="subtitle">Quick Stats</Text>
        <Text variant="body" className="mt-2">
          Progress dashboards will appear here after data integration.
        </Text>
      </Card>
    </Screen>
  );
}
