import { useAuth } from "@features/auth";
import { AppButton, AppCard, AppText, Screen, SectionHeader } from "@shared/components";

export function ProfileScreen() {
  const { signOut, user } = useAuth();

  return (
    <Screen scroll>
      <SectionHeader
        description="Profile and account state are connected to the authenticated Supabase session."
        eyebrow="Profile"
        title="Athlete profile"
      />
      <AppCard className="gap-4">
        <AppText variant="heading">Account</AppText>
        <AppText className="text-muted">{user?.email ?? "Signed in athlete"}</AppText>
        <AppButton label="Sign out" onPress={signOut} variant="secondary" />
      </AppCard>
      <AppCard className="gap-3">
        {["User preferences", "Account settings", "Training identity"].map((item) => (
          <AppText className="text-muted" key={item}>
            • {item}
          </AppText>
        ))}
      </AppCard>
    </Screen>
  );
}
