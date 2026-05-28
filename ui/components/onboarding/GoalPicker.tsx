import { GOALS, type Goal } from "../../../src/domain/types.js";
import { spacing } from "../../theme/tokens.js";
import { Stack } from "../primitives/Stack.js";
import { ChoiceCard } from "./ChoiceCard.js";

export interface GoalPickerProps {
  readonly value: Goal | undefined;
  readonly onChange: (value: Goal) => void;
}

const GOAL_META: Readonly<Record<Goal, { title: string; description: string; accent: string }>> = {
  strength: {
    title: "Strength",
    description: "1-6 reps, 7.5-9.5 RPE, longer rest. Built around heavy compound lifts.",
    accent: "#FF7A8A",
  },
  hypertrophy: {
    title: "Hypertrophy",
    description: "6-15 reps, 7-9 RPE, moderate rest. Balanced compound and isolation work.",
    accent: "#7CFFB7",
  },
  fat_loss: {
    title: "Fat loss",
    description: "8-20 reps, density-focused with shorter rest and unilateral loading.",
    accent: "#FFB347",
  },
  endurance: {
    title: "Endurance",
    description: "12-30 reps, repeatable circuits and machine/cable accessories.",
    accent: "#7AB6FF",
  },
};

export function GoalPicker({ value, onChange }: GoalPickerProps): JSX.Element {
  return (
    <Stack gap={spacing.sm} role="radiogroup" ariaLabel="Primary goal">
      {GOALS.map((goal) => {
        const meta = GOAL_META[goal];
        return (
          <ChoiceCard
            key={goal}
            title={meta.title}
            description={meta.description}
            accent={meta.accent}
            selected={value === goal}
            onSelect={() => onChange(goal)}
          />
        );
      })}
    </Stack>
  );
}
