import type { WorkoutExercise } from "../../../src/domain/types.js";
import type { ExerciseLog } from "../../state/workoutSessionStore.js";
import { muscleAccents, palette, radii, spacing, typography } from "../../theme/tokens.js";
import { Card } from "../primitives/Card.js";
import { Stack } from "../primitives/Stack.js";
import { RepRangeBadge } from "./RepRangeBadge.js";
import { SetCheckbox } from "./SetCheckbox.js";

export interface ExerciseCardProps {
  readonly exercise: WorkoutExercise;
  readonly log: ExerciseLog;
  readonly active: boolean;
  readonly onCompleteSet: (setIndex: number, reps: number) => void;
  readonly onUncompleteSet: (setIndex: number) => void;
  readonly onLogReps: (setIndex: number, reps: number) => void;
  readonly onLogWeight: (setIndex: number, weightKg: number) => void;
  readonly onSelect?: () => void;
}

/**
 * Card encapsulating an exercise within the active workout: its target
 * prescription, all set rows, and a header summarizing primary muscle and
 * mechanics. When `active` is false, the card collapses into a summary view.
 */
export function ExerciseCard({
  exercise,
  log,
  active,
  onCompleteSet,
  onUncompleteSet,
  onLogReps,
  onLogWeight,
  onSelect,
}: ExerciseCardProps): JSX.Element {
  const accent = muscleAccents[exercise.primaryMuscle] ?? palette.accent;
  const completedSets = log.sets.filter((entry) => entry.completed).length;

  return (
    <Card
      variant={active ? "elevated" : "surface"}
      padding={spacing.lg}
      style={{
        outline: active ? `1px solid ${accent}66` : undefined,
        boxShadow: active ? `0 16px 40px -24px ${accent}80` : undefined,
      }}
    >
      <Stack gap={spacing.lg}>
        <button
          type="button"
          onClick={onSelect}
          aria-label={`${exercise.exerciseName}, ${active ? "active" : "tap to focus"}`}
          aria-expanded={active}
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.md,
            cursor: onSelect ? "pointer" : "default",
            textAlign: "left",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 8,
              height: 56,
              borderRadius: 999,
              background: `linear-gradient(180deg, ${accent} 0%, ${accent}66 100%)`,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: typography.label.fontSize,
                color: accent,
                fontWeight: typography.label.fontWeight,
                letterSpacing: typography.label.letterSpacing,
                textTransform: typography.label.textTransform,
                marginBottom: 2,
              }}
            >
              {exercise.primaryMuscle} · {exercise.targetZone.replace(/_/g, " ")}
            </div>
            <div
              style={{
                fontSize: typography.h1.fontSize,
                lineHeight: typography.h1.lineHeight,
                fontWeight: typography.h1.fontWeight,
                color: palette.textPrimary,
              }}
            >
              {exercise.exerciseName}
            </div>
            <div
              style={{
                fontSize: typography.caption.fontSize,
                color: palette.textSecondary,
                marginTop: 4,
              }}
            >
              {exercise.mechanics === "compound" ? "Compound" : "Isolation"} ·{" "}
              {exercise.movementType.replace(/_/g, " ")} · {exercise.prescribedSets} sets
            </div>
          </div>
          <div
            style={{
              padding: `${spacing.xs}px ${spacing.sm}px`,
              borderRadius: radii.pill,
              background: completedSets === exercise.prescribedSets ? `${accent}1F` : palette.surfaceMuted,
              color: completedSets === exercise.prescribedSets ? accent : palette.textSecondary,
              fontSize: typography.label.fontSize,
              fontWeight: typography.label.fontWeight,
              letterSpacing: typography.label.letterSpacing,
              textTransform: typography.label.textTransform,
              flexShrink: 0,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {completedSets} / {exercise.prescribedSets}
          </div>
        </button>

        {active ? (
          <Stack gap={spacing.lg}>
            <Stack direction="row" gap={spacing.sm} wrap>
              <RepRangeBadge label="Reps" range={exercise.repRange} accent={accent} highlight />
              <RepRangeBadge
                label="RPE"
                range={exercise.rpeRange}
                accent={accent}
              />
              <RepRangeBadge
                label="Rest"
                range={exercise.restSeconds}
                suffix="sec"
                accent={accent}
              />
              <RepRangeBadge
                label="Sets"
                range={{ min: exercise.prescribedSets, max: exercise.prescribedSets }}
                accent={accent}
              />
            </Stack>

            <Stack gap={spacing.sm}>
              {log.sets.map((setLog) => (
                <SetCheckbox
                  key={setLog.setIndex}
                  setIndex={setLog.setIndex}
                  log={setLog}
                  repRange={exercise.repRange}
                  accent={accent}
                  onComplete={onCompleteSet}
                  onUncomplete={onUncompleteSet}
                  onLogReps={onLogReps}
                  onLogWeight={onLogWeight}
                />
              ))}
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );
}
