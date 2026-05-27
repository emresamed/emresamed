import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';

// Placeholder — full implementation in Phase 5
export default function WorkoutScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: Colors.textPrimary, fontSize: 20, fontWeight: 'bold' }}>Workout Tracker</Text>
      <Text style={{ color: Colors.textSecondary, marginTop: 8 }}>Phase 5</Text>
    </SafeAreaView>
  );
}
