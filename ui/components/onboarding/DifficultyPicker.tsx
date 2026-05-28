import { DIFFICULTIES, type Difficulty } from "../../../src/domain/types.js";
import { spacing } from "../../theme/tokens.js";
import { Stack } from "../primitives/Stack.js";
import { ChoiceCard } from "./ChoiceCard.js";

export interface DifficultyPickerProps {
  readonly value: Difficulty;
  readonly onChange: (value: Difficulty) => void;
}

const META: Readonly<Record<Difficulty, { title: string; description: string; accent: string }>> = {
  beginner: {
    title: "Beginner",
    description: "0-12 months training. Bias toward stable machines and bilateral lifts.",
    accent: "#7CFFB7",
  },
  intermediate: {
    title: "Intermediate",
    description: "1-3 years training. Comfortable with barbells and standard programs.",
    accent: "#7AB6FF",
  },
  advanced: {
    title: "Advanced",
    description: "3+ years training. Free to use complex variations and unilateral work.",
    accent: "#C58CFF",
  },
};

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps): JSX.Element {
  return (
    <Stack gap={spacing.sm} role="radiogroup" ariaLabel="Experience level">
      {DIFFICULTIES.map((difficulty) => {
        const meta = META[difficulty];
        return (
          <ChoiceCard
            key={difficulty}
            title={meta.title}
            description={meta.description}
            accent={meta.accent}
            selected={value === difficulty}
            onSelect={() => onChange(difficulty)}
          />
        );
      })}
    </Stack>
  );
}
