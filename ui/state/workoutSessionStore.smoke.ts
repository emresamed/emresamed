import type { WorkoutSession } from "../../src/domain/types.js";
import { WorkoutSessionStore } from "./workoutSessionStore.js";

/**
 * Pure-runtime smoke test for the WorkoutSessionStore reducer.
 *
 * Compiled into Node so we can verify state transitions without booting the
 * browser. Triggered manually from CLI: `tsc -p ui/tsconfig.smoke.json && node ...`.
 */
const session: WorkoutSession = {
  dayIndex: 1,
  name: "Day 1 — Push",
  focus: ["chest", "shoulders"],
  exercises: [
    {
      dayIndex: 1,
      sessionName: "Day 1 — Push",
      slotId: "push-1",
      exerciseId: "demo-bench",
      exerciseName: "Bench Press",
      primaryMuscle: "chest",
      targetZone: "mid_chest",
      movementType: "horizontal_push",
      mechanics: "compound",
      prescribedSets: 3,
      repRange: { min: 6, max: 10 },
      rpeRange: { min: 7, max: 9 },
      restSeconds: { min: 90, max: 150 },
    },
  ],
};

export function runWorkoutSessionSmoke(): boolean {
  const store = new WorkoutSessionStore(session);
  store.dispatch({ type: "complete-set", exerciseId: "demo-bench", setIndex: 0, reps: 8 });
  store.dispatch({ type: "complete-set", exerciseId: "demo-bench", setIndex: 1, reps: 8 });
  store.dispatch({ type: "complete-set", exerciseId: "demo-bench", setIndex: 2, reps: 8 });
  const state = store.getState();
  return state.isCompleted && state.logs["demo-bench"]?.sets.every((s) => s.completed) === true;
}
