import { useMemo, useState } from "react";
import type { BodyType, Difficulty, Goal, OnboardingState, UserMetrics } from "../../../src/domain/types.js";
import type { OnboardingStore } from "../../../src/onboarding/onboardingStore.js";
import { useStore } from "../../hooks/useStore.js";
import { palette, spacing } from "../../theme/tokens.js";
import { Button } from "../primitives/Button.js";
import { ProgressBar } from "../primitives/ProgressBar.js";
import { Stack } from "../primitives/Stack.js";
import { BodyTypePicker } from "./BodyTypePicker.js";
import { DaysPerWeekPicker } from "./DaysPerWeekPicker.js";
import { DifficultyPicker } from "./DifficultyPicker.js";
import { EquipmentPicker } from "./EquipmentPicker.js";
import { GoalPicker } from "./GoalPicker.js";
import { OnboardingQuestionCard } from "./OnboardingQuestionCard.js";

export interface OnboardingFlowProps {
  readonly store: OnboardingStore;
  readonly onComplete: (metrics: UserMetrics) => void;
}

type StepId = "bodyType" | "goal" | "equipment" | "days" | "difficulty";
const STEP_ORDER: readonly StepId[] = ["bodyType", "goal", "equipment", "days", "difficulty"];

interface StepCopy {
  readonly title: string;
  readonly description: string;
}

const STEP_COPY: Readonly<Record<StepId, StepCopy>> = {
  bodyType: {
    title: "What's your body type?",
    description: "We use this to calibrate volume, intensity, and rest windows.",
  },
  goal: {
    title: "What are you training for?",
    description: "Your primary goal sets the rep ranges, RPE targets, and rest periods.",
  },
  equipment: {
    title: "What equipment do you have?",
    description: "Pick everything you can use. We'll prioritize the best matches automatically.",
  },
  days: {
    title: "How many days per week?",
    description: "We'll pick a split that fits this frequency and your goal.",
  },
  difficulty: {
    title: "What's your experience level?",
    description: "Beginner picks safer movements first; advanced unlocks complex variations.",
  },
};

/**
 * Multi-step onboarding flow that drives the core `OnboardingStore`.
 *
 * Each step dispatches the appropriate typed action and advances only after
 * the answer satisfies the store's validation requirements.
 */
export function OnboardingFlow({ store, onComplete }: OnboardingFlowProps): JSX.Element {
  const state = useStore<OnboardingState>(store);
  const [stepIndex, setStepIndex] = useState(0);
  const stepId = STEP_ORDER[stepIndex];
  if (!stepId) {
    throw new Error("Invalid onboarding step.");
  }
  const stepCopy = STEP_COPY[stepId];

  const equipmentSet = useMemo(
    () => new Set(state.metrics.availableEquipment),
    [state.metrics.availableEquipment],
  );

  const isStepValid = ((): boolean => {
    switch (stepId) {
      case "bodyType":
        return state.metrics.bodyType !== undefined;
      case "goal":
        return state.metrics.goals.length > 0;
      case "equipment":
        return state.metrics.availableEquipment.length > 0;
      case "days":
        return typeof state.metrics.daysPerWeek === "number";
      case "difficulty":
        return true;
    }
  })();

  const isLastStep = stepIndex === STEP_ORDER.length - 1;
  const progress = (stepIndex + (isStepValid ? 1 : 0)) / STEP_ORDER.length;

  const handleBack = (): void => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleNext = (): void => {
    if (!isStepValid) {
      return;
    }
    if (!isLastStep) {
      setStepIndex(stepIndex + 1);
      return;
    }
    store.dispatch({ type: "complete" });
    onComplete(store.getState().metrics);
  };

  const renderStep = (): JSX.Element => {
    switch (stepId) {
      case "bodyType":
        return (
          <BodyTypePicker
            value={state.metrics.bodyType}
            onChange={(value: BodyType) => store.dispatch({ type: "set-body-type", bodyType: value })}
          />
        );
      case "goal":
        return (
          <GoalPicker
            value={state.metrics.goals[0]}
            onChange={(value: Goal) => store.dispatch({ type: "set-goals", goals: [value] })}
          />
        );
      case "equipment":
        return (
          <EquipmentPicker
            value={equipmentSet}
            onChange={(next) =>
              store.dispatch({
                type: "set-available-equipment",
                equipment: Array.from(next),
              })
            }
          />
        );
      case "days":
        return (
          <DaysPerWeekPicker
            value={state.metrics.daysPerWeek}
            onChange={(value: number) => store.dispatch({ type: "set-days-per-week", daysPerWeek: value })}
          />
        );
      case "difficulty":
        return (
          <DifficultyPicker
            value={state.metrics.difficulty}
            onChange={(value: Difficulty) => store.dispatch({ type: "set-difficulty", difficulty: value })}
          />
        );
    }
  };

  return (
    <Stack gap={spacing.xl} grow>
      <Stack gap={spacing.sm}>
        <ProgressBar progress={progress} ariaLabel="Onboarding progress" />
        <span
          style={{
            fontSize: 12,
            color: palette.textMuted,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Step {stepIndex + 1} of {STEP_ORDER.length}
        </span>
      </Stack>

      <OnboardingQuestionCard
        stepLabel={stepId}
        title={stepCopy.title}
        description={stepCopy.description}
        footer={
          <Stack direction="row" gap={spacing.md} justify="between">
            <Button
              variant="ghost"
              size="md"
              disabled={stepIndex === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!isStepValid}
              onClick={handleNext}
            >
              {isLastStep ? "Generate plan" : "Continue"}
            </Button>
          </Stack>
        }
      >
        {renderStep()}
      </OnboardingQuestionCard>
    </Stack>
  );
}
