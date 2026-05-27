import { create } from 'zustand';
import { ActiveWorkoutSession, SetLog, RestTimerState, WorkoutDay, ExerciseSlot } from '../types';

// ─── Store shape ──────────────────────────────────────────────────────────────

interface WorkoutSessionState {
  session: ActiveWorkoutSession | null;
  activeDay: WorkoutDay | null;

  // Session lifecycle
  startSession: (userId: string, day: WorkoutDay) => void;
  abandonSession: () => void;
  completeSession: () => void;

  // Set logging
  logSet: (slotOrder: number, exerciseId: string, setNumber: number, data: Partial<SetLog>) => void;
  toggleSetCompletion: (slotOrder: number, setNumber: number) => void;

  // Rest timer
  startRestTimer: (durationSeconds: number, slotOrder: number, setNumber: number) => void;
  tickRestTimer: () => void;
  resetRestTimer: () => void;

  // Derived helpers
  getSlotLogs: (slotOrder: number) => SetLog[];
  isSetCompleted: (slotOrder: number, setNumber: number) => boolean;
  completedSetsCount: (slotOrder: number) => number;
  totalSetsForDay: () => number;
  completedSetsForDay: () => number;
}

// ─── Initial timer state ─────────────────────────────────────────────────────

const idleTimer: RestTimerState = {
  durationSeconds: 0,
  remainingSeconds: 0,
  isRunning: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWorkoutSessionStore = create<WorkoutSessionState>((set, get) => ({
  session: null,
  activeDay: null,

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  startSession: (userId, day) => {
    const initialLogs = buildInitialSetLogs(day.exerciseSlots);

    const session: ActiveWorkoutSession = {
      id: `session-${Date.now()}`,
      userId,
      workoutDayId: day.id,
      startedAt: new Date().toISOString(),
      status: 'IN_PROGRESS',
      setLogs: initialLogs,
      restTimerState: { ...idleTimer },
    };

    set({ session, activeDay: day });
  },

  abandonSession: () =>
    set((s) => {
      if (!s.session) return s;
      return {
        session: { ...s.session, status: 'ABANDONED', completedAt: new Date().toISOString() },
      };
    }),

  completeSession: () =>
    set((s) => {
      if (!s.session) return s;
      return {
        session: { ...s.session, status: 'COMPLETED', completedAt: new Date().toISOString() },
      };
    }),

  // ── Set logging ────────────────────────────────────────────────────────────

  logSet: (slotOrder, exerciseId, setNumber, data) =>
    set((s) => {
      if (!s.session) return s;
      const logs = s.session.setLogs.map((log) =>
        log.slotOrder === slotOrder && log.setNumber === setNumber
          ? { ...log, ...data }
          : log,
      );
      return { session: { ...s.session, setLogs: logs } };
    }),

  toggleSetCompletion: (slotOrder, setNumber) =>
    set((s) => {
      if (!s.session) return s;
      const logs = s.session.setLogs.map((log) => {
        if (log.slotOrder === slotOrder && log.setNumber === setNumber) {
          const isCompleted = !log.isCompleted;
          return {
            ...log,
            isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : undefined,
          };
        }
        return log;
      });
      return { session: { ...s.session, setLogs: logs } };
    }),

  // ── Rest timer ─────────────────────────────────────────────────────────────

  startRestTimer: (durationSeconds, slotOrder, setNumber) =>
    set((s) => {
      if (!s.session) return s;
      return {
        session: {
          ...s.session,
          restTimerState: {
            durationSeconds,
            remainingSeconds: durationSeconds,
            isRunning: true,
            triggeredBySlotOrder: slotOrder,
            triggeredBySetNumber: setNumber,
          },
        },
      };
    }),

  tickRestTimer: () =>
    set((s) => {
      if (!s.session) return s;
      const timer = s.session.restTimerState;
      if (!timer.isRunning) return s;

      const remaining = Math.max(0, timer.remainingSeconds - 1);
      return {
        session: {
          ...s.session,
          restTimerState: {
            ...timer,
            remainingSeconds: remaining,
            isRunning: remaining > 0,
          },
        },
      };
    }),

  resetRestTimer: () =>
    set((s) => {
      if (!s.session) return s;
      return { session: { ...s.session, restTimerState: { ...idleTimer } } };
    }),

  // ── Derived helpers ────────────────────────────────────────────────────────

  getSlotLogs: (slotOrder) => {
    const logs = get().session?.setLogs ?? [];
    return logs.filter((l) => l.slotOrder === slotOrder);
  },

  isSetCompleted: (slotOrder, setNumber) => {
    const logs = get().session?.setLogs ?? [];
    return logs.some((l) => l.slotOrder === slotOrder && l.setNumber === setNumber && l.isCompleted);
  },

  completedSetsCount: (slotOrder) => {
    const logs = get().session?.setLogs ?? [];
    return logs.filter((l) => l.slotOrder === slotOrder && l.isCompleted).length;
  },

  totalSetsForDay: () => {
    const day = get().activeDay;
    if (!day) return 0;
    return day.exerciseSlots.reduce((sum, slot) => sum + slot.sets, 0);
  },

  completedSetsForDay: () => {
    const session = get().session;
    if (!session) return 0;
    return session.setLogs.filter((l) => l.isCompleted).length;
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildInitialSetLogs(slots: ExerciseSlot[]): SetLog[] {
  const logs: SetLog[] = [];
  for (const slot of slots) {
    for (let setNum = 1; setNum <= slot.sets; setNum++) {
      logs.push({
        slotOrder: slot.slotOrder,
        exerciseId: slot.exerciseId,
        setNumber: setNum,
        targetReps: slot.repRangeHigh,
        isCompleted: false,
      });
    }
  }
  return logs;
}
