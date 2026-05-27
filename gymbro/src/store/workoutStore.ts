import { create } from 'zustand';
import { ActiveSession, ActiveExercise, ActiveSet } from '@/types';

interface WorkoutState {
  activeSession: ActiveSession | null;
  isSessionActive: boolean;
  elapsedSeconds: number;

  // Session lifecycle
  startSession: (session: Omit<ActiveSession, 'exercises'>) => void;
  endSession: () => void;

  // Exercise management
  addExercise: (exercise: Omit<ActiveExercise, 'sets'>) => void;

  // Set management
  logSet: (exerciseId: string, set: ActiveSet) => void;
  updateSet: (exerciseId: string, setIndex: number, updates: Partial<ActiveSet>) => void;

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
    set({
      activeSession: {
        ...activeSession,
        exercises: [...activeSession.exercises, { ...exerciseData, sets: [] }],
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

  updateSet: (exerciseId, setIndex, updates) => {
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
                  i === setIndex ? { ...s, ...updates } : s
                ),
              }
            : ex
        ),
      },
    });
  },

  setElapsedSeconds: (seconds) => set({ elapsedSeconds: seconds }),
  incrementElapsed: () =>
    set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),
}));
