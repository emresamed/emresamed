import { Redirect } from 'expo-router';

/**
 * Entry route.
 *
 * Phase 1: temporarily redirects to the auth group placeholder.
 * Phase 2 will replace this with a real auth-state check.
 */
export default function Index() {
  return <Redirect href="/(auth)" />;
}
