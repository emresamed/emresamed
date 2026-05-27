import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Layout } from '@/constants';

// Placeholder — full implementation in Phase 4
export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: Layout.screenPaddingHorizontal }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: Colors.textPrimary, fontSize: 28, fontWeight: 'bold', marginTop: 8 }}>
          Good morning 💪
        </Text>
        <Text style={{ color: Colors.textSecondary, marginTop: 4 }}>
          Home — Phase 4
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
