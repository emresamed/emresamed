import { useEffect, useMemo, useState } from "react";
import type { GeneratedWorkoutPlan, MuscleGroup, SeedData, UserMetrics } from "../src/domain/types.js";
import { generateWorkoutPlan } from "../src/generator/programGenerator.js";
import { OnboardingStore } from "../src/onboarding/onboardingStore.js";
import { AppShell } from "./AppShell.js";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow.js";
import { MuscleGroupSelectionGrid } from "./components/onboarding/MuscleGroupSelectionGrid.js";
import { ActiveWorkoutScreen } from "./components/workout/ActiveWorkoutScreen.js";
import { Button } from "./components/primitives/Button.js";
import { Card } from "./components/primitives/Card.js";
import { Stack } from "./components/primitives/Stack.js";
import { WorkoutSessionStore } from "./state/workoutSessionStore.js";
import { ThemeProvider } from "./theme/ThemeProvider.js";
import { palette, spacing, typography } from "./theme/tokens.js";

export interface AppProps {
  readonly seedData: SeedData;
}

type Screen =
  | { readonly kind: "onboarding" }
  | { readonly kind: "muscle-priorities"; readonly metrics: UserMetrics }
  | { readonly kind: "plan-overview"; readonly plan: GeneratedWorkoutPlan; readonly priorities: ReadonlySet<MuscleGroup> }
  | { readonly kind: "active-workout"; readonly plan: GeneratedWorkoutPlan; readonly store: WorkoutSessionStore };

/**
 * Top-level application entry that wires the core onboarding store and the
 * deterministic program generator into the UI's screen state machine.
 */
export function App({ seedData }: AppProps): JSX.Element {
  const onboardingStore = useMemo(() => new OnboardingStore(), []);
  const [screen, setScreen] = useState<Screen>({ kind: "onboarding" });
  const [priorities, setPriorities] = useState<ReadonlySet<MuscleGroup>>(new Set());

  useEffect(() => {
    return () => {
      onboardingStore.destroy();
    };
  }, [onboardingStore]);

  return (
    <ThemeProvider>
      <AppShell>
        {screen.kind === "onboarding" ? (
          <OnboardingFlow
            store={onboardingStore}
            onComplete={(metrics) => setScreen({ kind: "muscle-priorities", metrics })}
          />
        ) : null}

        {screen.kind === "muscle-priorities" ? (
          <Stack gap={spacing.xl} grow>
            <Stack gap={spacing.sm}>
              <span
                style={{
                  fontSize: typography.label.fontSize,
                  color: palette.accent,
                  letterSpacing: typography.label.letterSpacing,
                  textTransform: typography.label.textTransform,
                  fontWeight: typography.label.fontWeight,
                }}
              >
                Final touch
              </span>
              <h1
                style={{
                  margin: 0,
                  fontSize: typography.display.fontSize,
                  lineHeight: typography.display.lineHeight,
                  letterSpacing: typography.display.letterSpacing,
                  fontWeight: typography.display.fontWeight,
                }}
              >
                Pick your priorities
              </h1>
              <p
                style={{
                  margin: 0,
                  color: palette.textSecondary,
                  fontSize: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                }}
              >
                Optionally weight specific muscle groups higher. We use this to bias exercise
                selection while preserving balanced movement coverage.
              </p>
            </Stack>
            <MuscleGroupSelectionGrid
              selected={priorities}
              onChange={setPriorities}
              maxSelected={3}
            />
            <Stack direction="row" gap={spacing.md} justify="between">
              <Button variant="ghost" onClick={() => setScreen({ kind: "onboarding" })}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const plan = generateWorkoutPlan({
                    seedData,
                    metrics: screen.metrics,
                  });
                  setScreen({ kind: "plan-overview", plan, priorities });
                }}
              >
                Generate program
              </Button>
            </Stack>
          </Stack>
        ) : null}

        {screen.kind === "plan-overview" ? (
          <Stack gap={spacing.xl} grow>
            <Stack gap={spacing.sm}>
              <span
                style={{
                  fontSize: typography.label.fontSize,
                  color: palette.accent,
                  letterSpacing: typography.label.letterSpacing,
                  textTransform: typography.label.textTransform,
                  fontWeight: typography.label.fontWeight,
                }}
              >
                Your weekly plan
              </span>
              <h1
                style={{
                  margin: 0,
                  fontSize: typography.display.fontSize,
                  lineHeight: typography.display.lineHeight,
                  letterSpacing: typography.display.letterSpacing,
                  fontWeight: typography.display.fontWeight,
                }}
              >
                {screen.plan.daysPerWeek}-day {screen.plan.goal.replace(/_/g, " ")} program
              </h1>
              <p
                style={{
                  margin: 0,
                  color: palette.textSecondary,
                  fontSize: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                }}
              >
                Tailored to a {screen.plan.bodyType} build. Tap a session to begin.
              </p>
            </Stack>
            <Stack gap={spacing.md}>
              {screen.plan.sessions.map((session) => (
                <Card
                  key={session.dayIndex}
                  interactive
                  onClick={() => {
                    const sessionStore = WorkoutSessionStore.fromPlan(
                      screen.plan,
                      session.dayIndex,
                    );
                    setScreen({
                      kind: "active-workout",
                      plan: screen.plan,
                      store: sessionStore,
                    });
                  }}
                  ariaLabel={`Start ${session.name}`}
                >
                  <Stack gap={spacing.sm}>
                    <span
                      style={{
                        fontSize: typography.label.fontSize,
                        color: palette.textMuted,
                        letterSpacing: typography.label.letterSpacing,
                        textTransform: typography.label.textTransform,
                        fontWeight: typography.label.fontWeight,
                      }}
                    >
                      Day {session.dayIndex} · {session.focus.join(" + ")}
                    </span>
                    <span
                      style={{
                        fontSize: typography.h1.fontSize,
                        fontWeight: typography.h1.fontWeight,
                      }}
                    >
                      {session.name}
                    </span>
                    <span
                      style={{
                        fontSize: typography.caption.fontSize,
                        color: palette.textSecondary,
                      }}
                    >
                      {session.exercises.length} exercises ·{" "}
                      {session.exercises.reduce((acc, ex) => acc + ex.prescribedSets, 0)} working sets
                    </span>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        ) : null}

        {screen.kind === "active-workout" ? (
          <ActiveWorkoutScreen
            store={screen.store}
            onExit={() =>
              setScreen({
                kind: "plan-overview",
                plan: screen.plan,
                priorities,
              })
            }
            onComplete={() =>
              setScreen({
                kind: "plan-overview",
                plan: screen.plan,
                priorities,
              })
            }
          />
        ) : null}
      </AppShell>
    </ThemeProvider>
  );
}
