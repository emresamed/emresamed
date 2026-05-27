import { create } from "zustand";

type WorkoutSessionState = {
  activeProgramId: string | null;
  startedAt: string | null;
  startSession: (programId: string) => void;
  endSession: () => void;
};

export const useWorkoutSessionStore = create<WorkoutSessionState>((set) => ({
  activeProgramId: null,
  startedAt: null,
  startSession: (programId) => {
    set({
      activeProgramId: programId,
      startedAt: new Date().toISOString()
    });
  },
  endSession: () => {
    set({ activeProgramId: null, startedAt: null });
  }
}));
