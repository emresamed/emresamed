import type { PropsWithChildren } from "react";

import { AppCard, AppText, Screen, SectionHeader } from "@shared/components";

type AuthScaffoldProps = PropsWithChildren<{
  description: string;
  errorMessage?: string | null;
  title: string;
}>;

export function AuthScaffold({ children, description, errorMessage, title }: AuthScaffoldProps) {
  return (
    <Screen contentClassName="justify-center" scroll>
      <SectionHeader description={description} eyebrow="GymBro" title={title} />
      <AppCard className="gap-5" elevated>
        {errorMessage ? (
          <AppText className="rounded-2xl bg-danger/10 p-3 text-danger" variant="caption">
            {errorMessage}
          </AppText>
        ) : null}
        {children}
      </AppCard>
    </Screen>
  );
}
