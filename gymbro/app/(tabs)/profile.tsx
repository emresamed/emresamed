import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';

// Placeholder — full implementation in Phase 4
export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: Colors.textPrimary, fontSize: 20, fontWeight: 'bold' }}>Profile</Text>
      <Text style={{ color: Colors.textSecondary, marginTop: 8 }}>Phase 4</Text>
    </SafeAreaView>
  );
}
