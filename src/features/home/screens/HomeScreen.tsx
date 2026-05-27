import { AppButton, AppCard, AppText, Screen, SectionHeader } from "@shared/components";
import { appConfig } from "@shared/config/app";

const foundationHighlights = [
  "Expo Router navigation shell",
  "Dark premium theme tokens",
  "Reusable screen, text, card, and button primitives",
  "React Query, Supabase, and Zustand scaffolding",
];

export function HomeScreen() {
  return (
    <Screen scroll>
      <SectionHeader
        description={appConfig.description}
        eyebrow="Foundation"
        title={`Welcome to ${appConfig.name}`}
      />
      <AppCard className="gap-4" elevated>
        <AppText variant="heading">Build strong. Track smarter.</AppText>
        <AppText className="text-muted">
          GymBro is ready for feature-by-feature development without mixing UI, data access, and
          state management concerns.
        </AppText>
        <AppButton label="Phase 1 ready" />
      </AppCard>
      <AppCard className="gap-3">
        {foundationHighlights.map((highlight) => (
          <AppText className="text-muted" key={highlight}>
            • {highlight}
          </AppText>
        ))}
      </AppCard>
    </Screen>
  );
}
