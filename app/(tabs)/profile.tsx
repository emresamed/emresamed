import { Text, View } from "react-native";

import { PrimaryButton } from "../../src/components/forms/primary-button";
import { Screen } from "../../src/components/ui/screen";
import { SectionCard } from "../../src/components/ui/section-card";
import { useSignOutMutation } from "../../src/features/auth/hooks/use-auth-mutations";
import { useAuthState } from "../../src/features/auth/hooks/use-auth-state";

export default function ProfileScreen() {
  const { user } = useAuthState();
  const signOutMutation = useSignOutMutation();

  const handleSignOut = async () => {
    await signOutMutation.mutateAsync();
  };

  return (
    <Screen>
      <Text className="text-2xl font-bold text-text">Profile</Text>

      <SectionCard className="mt-4" title="Account" subtitle={user?.email ?? "No email available"}>
        <View className="gap-3">
          <Text className="text-sm text-muted">Manage your account and sign-out safely on shared devices.</Text>
          <PrimaryButton label="Sign out" loading={signOutMutation.isPending} onPress={handleSignOut} />
        </View>
      </SectionCard>
    </Screen>
  );
}
