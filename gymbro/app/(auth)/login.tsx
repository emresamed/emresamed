import { View, Text } from 'react-native';
import { Colors } from '@/constants';

// Placeholder — full implementation in Phase 2
export default function LoginScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: 'bold' }}>GymBro</Text>
      <Text style={{ color: Colors.textSecondary, marginTop: 8 }}>Login — Phase 2</Text>
    </View>
  );
}
