import type {
  GeneratedWorkoutPlan,
  Range,
  WorkoutExercise,
  WorkoutSession,
} from "../../src/domain/types.js";

/**
 * Live state for an in-progress workout session.
 *
 * Sets are tracked with their logged repetitions and weight so the UI can
 * highlight whether the prescribed rep range was met and surface progression
 * cues. The rest timer is intrinsic to the active workout state machine so
 * that pausing/resuming the screen never loses the countdown context.
 */

export interface SetLog {
  readonly setIndex: number;
  readonly completed: boolean;
  readonly reps: number | undefined;
  readonly weightKg: number | undefined;
  readonly completedAt: string | undefined;
}

export interface ExerciseLog {
  readonly exerciseId: string;
  readonly slotId: string;
  readonly sets: readonly SetLog[];
}

export interface RestTimerState {
  readonly isActive: boolean;
  readonly startedAt: number | undefined;
  readonly durationSeconds: number;
  readonly elapsedSeconds: number;
  readonly sourceExerciseId: string | undefined;
  readonly sourceSetIndex: number | undefined;
}

export interface WorkoutSessionState {
  readonly session: WorkoutSession;
  readonly logs: Readonly<Record<string, ExerciseLog>>;
  readonly currentExerciseId: string;
  readonly restTimer: RestTimerState;
  readonly startedAt: string;
  readonly completedAt: string | undefined;
  readonly isCompleted: boolean;
}

export type WorkoutSessionAction =
  | { readonly type: "complete-set"; readonly exerciseId: string; readonly setIndex: number; readonly reps?: number; readonly weightKg?: number }
  | { readonly type: "uncomplete-set"; readonly exerciseId: string; readonly setIndex: number }
  | { readonly type: "log-set"; readonly exerciseId: string; readonly setIndex: number; readonly reps?: number; readonly weightKg?: number }
  | { readonly type: "select-exercise"; readonly exerciseId: string }
  | { readonly type: "advance-exercise" }
  | { readonly type: "tick-timer"; readonly nowMs: number }
  | { readonly type: "skip-rest" }
  | { readonly type: "complete-session" };

export type WorkoutSessionListener = (state: WorkoutSessionState) => void;

interface SetPatch {
  completed?: boolean;
  reps?: number | undefined;
  weightKg?: number | undefined;
  completedAt?: string | undefined;
}

const REST_TIMER_DEFAULT: RestTimerState = {
  isActive: false,
  startedAt: undefined,
  durationSeconds: 0,
  elapsedSeconds: 0,
  sourceExerciseId: undefined,
  sourceSetIndex: undefined,
};

function clampRange(range: Range<number>, value: number): number {
  return Math.max(range.min, Math.min(range.max, value));
}

function midpoint(range: Range<number>): number {
  return Math.round((range.min + range.max) / 2);
}

function makeInitialLogs(session: WorkoutSession): Record<string, ExerciseLog> {
  const logs: Record<string, ExerciseLog> = {};
  for (const exercise of session.exercises) {
    const sets: SetLog[] = [];
    for (let setIndex = 0; setIndex < exercise.prescribedSets; setIndex += 1) {
      sets.push({
        setIndex,
        completed: false,
        reps: undefined,
        weightKg: undefined,
        completedAt: undefined,
      });
    }
    logs[exercise.exerciseId] = {
      exerciseId: exercise.exerciseId,
      slotId: exercise.slotId,
      sets,
    };
  }
  return logs;
}

function findExercise(state: WorkoutSessionState, exerciseId: string): WorkoutExercise | undefined {
  return state.session.exercises.find((exercise) => exercise.exerciseId === exerciseId);
}

function nextExerciseId(state: WorkoutSessionState, fromExerciseId: string): string | undefined {
  const exercises = state.session.exercises;
  const index = exercises.findIndex((exercise) => exercise.exerciseId === fromExerciseId);
  if (index === -1) {
    return undefined;
  }
  for (let cursor = index + 1; cursor < exercises.length; cursor += 1) {
    const candidate = exercises[cursor];
    if (candidate) {
      return candidate.exerciseId;
    }
  }
  return undefined;
}

function isExerciseComplete(log: ExerciseLog | undefined): boolean {
  if (!log || log.sets.length === 0) {
    return false;
  }
  return log.sets.every((entry) => entry.completed);
}

function isSessionComplete(state: WorkoutSessionState): boolean {
  return state.session.exercises.every((exercise) =>
    isExerciseComplete(state.logs[exercise.exerciseId]),
  );
}

function updateSet(log: ExerciseLog, setIndex: number, patch: SetPatch): ExerciseLog {
  const sets = log.sets.map((entry) =>
    entry.setIndex === setIndex ? { ...entry, ...patch } : entry,
  );
  return { ...log, sets };
}

function reduce(
  state: WorkoutSessionState,
  action: WorkoutSessionAction,
): WorkoutSessionState {
  switch (action.type) {
    case "complete-set": {
      const log = state.logs[action.exerciseId];
      const exercise = findExercise(state, action.exerciseId);
      if (!log || !exercise) {
        return state;
      }
      const reps =
        typeof action.reps === "number"
          ? clampRange(exercise.repRange, Math.round(action.reps))
          : log.sets[action.setIndex]?.reps ?? midpoint(exercise.repRange);
      const updatedLog = updateSet(log, action.setIndex, {
        completed: true,
        reps,
        weightKg: action.weightKg ?? log.sets[action.setIndex]?.weightKg,
        completedAt: new Date().toISOString(),
      });
      const restSeconds = midpoint(exercise.restSeconds);
      const nextState: WorkoutSessionState = {
        ...state,
        logs: { ...state.logs, [action.exerciseId]: updatedLog },
        restTimer: {
          isActive: true,
          startedAt: Date.now(),
          durationSeconds: restSeconds,
          elapsedSeconds: 0,
          sourceExerciseId: action.exerciseId,
          sourceSetIndex: action.setIndex,
        },
      };
      const completed = isSessionComplete(nextState);
      return completed
        ? { ...nextState, isCompleted: true, completedAt: new Date().toISOString() }
        : nextState;
    }
    case "uncomplete-set": {
      const log = state.logs[action.exerciseId];
      if (!log) {
        return state;
      }
      const updatedLog = updateSet(log, action.setIndex, {
        completed: false,
        completedAt: undefined,
      });
      return {
        ...state,
        logs: { ...state.logs, [action.exerciseId]: updatedLog },
        isCompleted: false,
        completedAt: undefined,
      };
    }
    case "log-set": {
      const log = state.logs[action.exerciseId];
      const exercise = findExercise(state, action.exerciseId);
      if (!log || !exercise) {
        return state;
      }
      const patch: SetPatch = {};
      if (typeof action.reps === "number") {
        patch.reps = clampRange(exercise.repRange, Math.round(action.reps));
      }
      if (typeof action.weightKg === "number") {
        patch.weightKg = Math.max(0, action.weightKg);
      }
      const updatedLog = updateSet(log, action.setIndex, patch);
      return {
        ...state,
        logs: { ...state.logs, [action.exerciseId]: updatedLog },
      };
    }
    case "select-exercise": {
      if (!findExercise(state, action.exerciseId)) {
        return state;
      }
      return { ...state, currentExerciseId: action.exerciseId };
    }
    case "advance-exercise": {
      const next = nextExerciseId(state, state.currentExerciseId);
      if (!next) {
        return state;
      }
      return { ...state, currentExerciseId: next };
    }
    case "tick-timer": {
      if (!state.restTimer.isActive || state.restTimer.startedAt === undefined) {
        return state;
      }
      const elapsedSeconds = Math.floor((action.nowMs - state.restTimer.startedAt) / 1000);
      if (elapsedSeconds >= state.restTimer.durationSeconds) {
        return {
          ...state,
          restTimer: { ...state.restTimer, elapsedSeconds: state.restTimer.durationSeconds, isActive: false },
        };
      }
      if (elapsedSeconds === state.restTimer.elapsedSeconds) {
        return state;
      }
      return {
        ...state,
        restTimer: { ...state.restTimer, elapsedSeconds },
      };
    }
    case "skip-rest": {
      return { ...state, restTimer: REST_TIMER_DEFAULT };
    }
    case "complete-session": {
      return {
        ...state,
        isCompleted: true,
        completedAt: state.completedAt ?? new Date().toISOString(),
        restTimer: REST_TIMER_DEFAULT,
      };
    }
    default: {
      const exhaustive: never = action;
      throw new Error(`Unsupported workout session action: ${JSON.stringify(exhaustive)}`);
    }
  }
}

export class WorkoutSessionStore {
  private state: WorkoutSessionState;

  private readonly listeners = new Set<WorkoutSessionListener>();

  public constructor(session: WorkoutSession) {
    if (session.exercises.length === 0) {
      throw new Error("Cannot start a workout session with no exercises.");
    }
    const firstExercise = session.exercises[0];
    if (!firstExercise) {
      throw new Error("Cannot start a workout session with no exercises.");
    }
    this.state = {
      session,
      logs: makeInitialLogs(session),
      currentExerciseId: firstExercise.exerciseId,
      restTimer: REST_TIMER_DEFAULT,
      startedAt: new Date().toISOString(),
      completedAt: undefined,
      isCompleted: false,
    };
  }

  public static fromPlan(plan: GeneratedWorkoutPlan, dayIndex: number): WorkoutSessionStore {
    const session = plan.sessions.find((entry) => entry.dayIndex === dayIndex);
    if (!session) {
      throw new Error(`No session found for dayIndex=${dayIndex}.`);
    }
    return new WorkoutSessionStore(session);
  }

  public getState(): WorkoutSessionState {
    return this.state;
  }

  public subscribe(listener: WorkoutSessionListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    let active = true;
    return () => {
      if (!active) {
        return;
      }
      active = false;
      this.listeners.delete(listener);
    };
  }

  public dispatch(action: WorkoutSessionAction): WorkoutSessionState {
    const next = reduce(this.state, action);
    if (next === this.state) {
      return this.state;
    }
    this.state = next;
    for (const listener of this.listeners) {
      listener(this.state);
    }
    return this.state;
  }
}
