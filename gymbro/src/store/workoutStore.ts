import { create } from 'zustand';
import { WorkoutSession, WorkoutExerciseLog, WorkoutSetLog } from '@/types';

interface WorkoutState {
  activeSession: WorkoutSession | null;
  isSessionActive: boolean;
  elapsedSeconds: number;

  // Session lifecycle
  startSession: (session: Omit<WorkoutSession, 'exercises'>) => void;
  endSession: () => void;

  // Exercise management
  addExercise: (exercise: Omit<WorkoutExerciseLog, 'sets'>) => void;

  // Set management
  logSet: (exerciseId: string, set: WorkoutSetLog) => void;
  updateSet: (exerciseId: string, setIndex: number, set: Partial<WorkoutSetLog>) => void;

  // Timer
  setElapsedSeconds: (seconds: number) => void;
  incrementElapsed: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeSession: null,
  isSessionActive: false,
  elapsedSeconds: 0,

  startSession: (sessionData) =>
    set({
      activeSession: { ...sessionData, exercises: [] },
      isSessionActive: true,
      elapsedSeconds: 0,
    }),

  endSession: () =>
    set({
      activeSession: null,
      isSessionActive: false,
      elapsedSeconds: 0,
    }),

  addExercise: (exerciseData) => {
    const { activeSession } = get();
    if (!activeSession) return;

    const newExercise: WorkoutExerciseLog = {
      ...exerciseData,
      sets: [],
    };

    set({
      activeSession: {
        ...activeSession,
        exercises: [...activeSession.exercises, newExercise],
      },
    });
  },

  logSet: (exerciseId, newSet) => {
    const { activeSession } = get();
    if (!activeSession) return;

    set({
      activeSession: {
        ...activeSession,
        exercises: activeSession.exercises.map((ex) =>
          ex.exercise_id === exerciseId
            ? { ...ex, sets: [...ex.sets, newSet] }
            : ex
        ),
      },
    });
  },

  updateSet: (exerciseId, setIndex, updatedFields) => {
    const { activeSession } = get();
    if (!activeSession) return;

    set({
      activeSession: {
        ...activeSession,
        exercises: activeSession.exercises.map((ex) =>
          ex.exercise_id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s, i) =>
                  i === setIndex ? { ...s, ...updatedFields } : s
                ),
              }
            : ex
        ),
      },
    });
  },

  setElapsedSeconds: (seconds) => set({ elapsedSeconds: seconds }),
  incrementElapsed: () => set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),
}));
