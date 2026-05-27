import { Redirect } from 'expo-router';

import { useAuth } from '@/features/auth';

/**
 * Entry route. SessionGate guarantees we never render here while loading,
 * so we can decide synchronously.
 */
export default function Index() {
  const { isAuthenticated } = useAuth();
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
