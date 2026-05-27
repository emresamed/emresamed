import { Stack } from 'expo-router';

/**
 * Protected tab group placeholder.
 * Phase 4 will replace this Stack with a Tabs layout
 * (Home / Programs / Exercises / Profile).
 */
export default function TabsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
