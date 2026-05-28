import { MUSCLE_GROUPS, type MuscleGroup } from "../../../src/domain/types.js";
import { MINIMUM_WEEKLY_SETS } from "../../../src/generator/biomechanicalRules.js";
import { spacing } from "../../theme/tokens.js";
import { MuscleGroupCard } from "./MuscleGroupCard.js";

export interface MuscleGroupSelectionGridProps {
  readonly selected: ReadonlySet<MuscleGroup>;
  readonly onChange: (next: ReadonlySet<MuscleGroup>) => void;
  readonly maxSelected?: number;
}

const LABELS: Readonly<Record<MuscleGroup, string>> = {
  chest: "Chest",
  back: "Back",
  legs: "Legs",
  shoulders: "Shoulders",
  arms: "Arms",
  core: "Core",
};

const DESCRIPTIONS: Readonly<Record<MuscleGroup, string>> = {
  chest: "Horizontal push, mid- and upper-chest emphasis.",
  back: "Vertical and horizontal pulls plus mid-back density.",
  legs: "Knee- and hip-dominant balance with unilateral work.",
  shoulders: "Vertical push plus rear-delt and rotator cuff work.",
  arms: "Biceps and triceps bias for hypertrophy and definition.",
  core: "Anti-extension, anti-rotation, and carry patterns.",
};

/**
 * Responsive grid of muscle-group selection cards. Used both during
 * onboarding for setting priority focus areas and on the workout details
 * screen for ad-hoc filters.
 */
export function MuscleGroupSelectionGrid({
  selected,
  onChange,
  maxSelected,
}: MuscleGroupSelectionGridProps): JSX.Element {
  const handleToggle = (muscle: MuscleGroup): void => {
    const next = new Set(selected);
    if (next.has(muscle)) {
      next.delete(muscle);
    } else {
      if (typeof maxSelected === "number" && next.size >= maxSelected) {
        return;
      }
      next.add(muscle);
    }
    onChange(next);
  };

  return (
    <div
      role="group"
      aria-label="Muscle groups"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: spacing.md,
      }}
    >
      {MUSCLE_GROUPS.map((muscle) => (
        <MuscleGroupCard
          key={muscle}
          muscle={muscle}
          label={LABELS[muscle]}
          description={DESCRIPTIONS[muscle]}
          weeklySetsTarget={MINIMUM_WEEKLY_SETS[muscle]}
          selected={selected.has(muscle)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
