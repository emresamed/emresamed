import { useMemo } from "react";
import { useStore } from "../../hooks/useStore.js";
import type { WorkoutSessionStore } from "../../state/workoutSessionStore.js";
import { palette, spacing, typography } from "../../theme/tokens.js";
import { Button } from "../primitives/Button.js";
import { ProgressBar } from "../primitives/ProgressBar.js";
import { Stack } from "../primitives/Stack.js";
import { ExerciseCard } from "./ExerciseCard.js";
import { RestTimer } from "./RestTimer.js";

export interface ActiveWorkoutScreenProps {
  readonly store: WorkoutSessionStore;
  readonly onExit?: () => void;
  readonly onComplete?: () => void;
}

/**
 * Top-level Active Workout Screen.
 *
 * Composes the rest-timer card, the focused exercise card with prescribed
 * targets and interactive set checkboxes, and a list of upcoming exercises.
 * State is fully delegated to the bound `WorkoutSessionStore`.
 */
export function ActiveWorkoutScreen({
  store,
  onExit,
  onComplete,
}: ActiveWorkoutScreenProps): JSX.Element {
  const state = useStore(store);
  const session = state.session;
  const currentExerciseIndex = session.exercises.findIndex(
    (exercise) => exercise.exerciseId === state.currentExerciseId,
  );
  const currentExercise =
    session.exercises[currentExerciseIndex] ?? session.exercises[0];
  if (!currentExercise) {
    throw new Error("Active workout has no exercises.");
  }

  const totalSets = useMemo(
    () => session.exercises.reduce((acc, ex) => acc + ex.prescribedSets, 0),
    [session.exercises],
  );
  const completedSets = useMemo(
    () =>
      Object.values(state.logs).reduce(
        (acc, log) => acc + log.sets.filter((s) => s.completed).length,
        0,
      ),
    [state.logs],
  );
  const completionRatio = totalSets === 0 ? 0 : completedSets / totalSets;

  return (
    <Stack gap={spacing.xl} grow>
      <Stack as="header" gap={spacing.sm}>
        <Stack direction="row" justify="between" align="center">
          <Stack gap={2}>
            <span
              style={{
                fontSize: typography.label.fontSize,
                color: palette.accent,
                letterSpacing: typography.label.letterSpacing,
                textTransform: typography.label.textTransform,
                fontWeight: typography.label.fontWeight,
              }}
            >
              Day {session.dayIndex} · {session.focus.join(" + ")}
            </span>
            <h1
              style={{
                margin: 0,
                fontSize: typography.h1.fontSize,
                fontWeight: typography.h1.fontWeight,
                color: palette.textPrimary,
              }}
            >
              {session.name}
            </h1>
          </Stack>
          {onExit ? (
            <Button variant="ghost" size="sm" onClick={onExit} ariaLabel="Exit workout">
              Exit
            </Button>
          ) : null}
        </Stack>
        <ProgressBar progress={completionRatio} ariaLabel="Workout completion" />
        <span
          style={{
            fontSize: typography.caption.fontSize,
            color: palette.textSecondary,
          }}
        >
          {completedSets} of {totalSets} sets · exercise {currentExerciseIndex + 1} of{" "}
          {session.exercises.length}
        </span>
      </Stack>

      {state.restTimer.durationSeconds > 0 ? (
        <RestTimer
          timer={state.restTimer}
          onTick={(nowMs) => store.dispatch({ type: "tick-timer", nowMs })}
          onSkip={() => store.dispatch({ type: "skip-rest" })}
        />
      ) : null}

      <Stack gap={spacing.md}>
        {session.exercises.map((exercise) => {
          const log = state.logs[exercise.exerciseId];
          if (!log) {
            return null;
          }
          const active = exercise.exerciseId === state.currentExerciseId;
          return (
            <ExerciseCard
              key={exercise.exerciseId}
              exercise={exercise}
              log={log}
              active={active}
              onSelect={() =>
                store.dispatch({ type: "select-exercise", exerciseId: exercise.exerciseId })
              }
              onCompleteSet={(setIndex, reps) =>
                store.dispatch({
                  type: "complete-set",
                  exerciseId: exercise.exerciseId,
                  setIndex,
                  reps,
                })
              }
              onUncompleteSet={(setIndex) =>
                store.dispatch({
                  type: "uncomplete-set",
                  exerciseId: exercise.exerciseId,
                  setIndex,
                })
              }
              onLogReps={(setIndex, reps) =>
                store.dispatch({
                  type: "log-set",
                  exerciseId: exercise.exerciseId,
                  setIndex,
                  reps,
                })
              }
              onLogWeight={(setIndex, weightKg) =>
                store.dispatch({
                  type: "log-set",
                  exerciseId: exercise.exerciseId,
                  setIndex,
                  weightKg,
                })
              }
            />
          );
        })}
      </Stack>

      <Stack direction="row" gap={spacing.sm} justify="between">
        <Button
          variant="secondary"
          size="md"
          onClick={() => store.dispatch({ type: "advance-exercise" })}
          disabled={currentExerciseIndex >= session.exercises.length - 1}
        >
          Next exercise
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            store.dispatch({ type: "complete-session" });
            onComplete?.();
          }}
          disabled={completedSets === 0}
        >
          Finish workout
        </Button>
      </Stack>
    </Stack>
  );
}
