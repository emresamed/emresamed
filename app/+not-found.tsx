import { Link } from "expo-router";

import { AppCard, AppText, Screen, SectionHeader } from "@shared/components";

export default function NotFoundScreen() {
  return (
    <Screen contentClassName="justify-center">
      <SectionHeader
        description="The screen you are looking for does not exist."
        eyebrow="404"
        title="Route not found"
      />
      <AppCard>
        <Link href="/">
          <AppText className="font-bold text-primary">Return home</AppText>
        </Link>
      </AppCard>
    </Screen>
  );
}
