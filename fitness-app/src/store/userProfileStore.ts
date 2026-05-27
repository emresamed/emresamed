import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  BodyType,
  Goal,
  Equipment,
  ExperienceLevel,
  UserBodyMetrics,
  WorkoutProgram,
} from '../types';
import { generateWorkoutProgram } from '../engine/workoutGenerator';

// ─── Onboarding partial state (built up screen by screen) ────────────────────

interface OnboardingDraft {
  bodyType: BodyType | null;
  goal: Goal | null;
  availableEquipment: Equipment[];
  trainingDaysPerWeek: number;
  experienceLevel: ExperienceLevel;
  bodyMetrics: UserBodyMetrics;
}

// ─── Store shape ──────────────────────────────────────────────────────────────

interface UserProfileState {
  profile: UserProfile | null;
  program: WorkoutProgram | null;
  onboardingDraft: OnboardingDraft;
  isOnboarded: boolean;

  // Onboarding setters
  setBodyType: (bodyType: BodyType) => void;
  setGoal: (goal: Goal) => void;
  setEquipment: (equipment: Equipment[]) => void;
  toggleEquipment: (item: Equipment) => void;
  setTrainingDays: (days: number) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setBodyMetrics: (metrics: UserBodyMetrics) => void;

  // Finalise onboarding → generate program
  completeOnboarding: () => void;

  // Program updates
  setProgram: (program: WorkoutProgram) => void;
  advanceWeek: () => void;

  // Reset
  reset: () => void;
}

// ─── Default draft ────────────────────────────────────────────────────────────

const defaultDraft: OnboardingDraft = {
  bodyType: null,
  goal: null,
  availableEquipment: ['BODYWEIGHT'],
  trainingDaysPerWeek: 3,
  experienceLevel: 'BEGINNER',
  bodyMetrics: {},
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      program: null,
      isOnboarded: false,
      onboardingDraft: { ...defaultDraft },

      setBodyType: (bodyType) =>
        set((s) => ({
          onboardingDraft: { ...s.onboardingDraft, bodyType },
        })),

      setGoal: (goal) =>
        set((s) => ({
          onboardingDraft: { ...s.onboardingDraft, goal },
        })),

      setEquipment: (availableEquipment) =>
        set((s) => ({
          onboardingDraft: { ...s.onboardingDraft, availableEquipment },
        })),

      toggleEquipment: (item) =>
        set((s) => {
          const current = s.onboardingDraft.availableEquipment;
          const next = current.includes(item)
            ? current.filter((e) => e !== item)
            : [...current, item];
          return {
            onboardingDraft: { ...s.onboardingDraft, availableEquipment: next },
          };
        }),

      setTrainingDays: (trainingDaysPerWeek) =>
        set((s) => ({
          onboardingDraft: { ...s.onboardingDraft, trainingDaysPerWeek },
        })),

      setExperienceLevel: (experienceLevel) =>
        set((s) => ({
          onboardingDraft: { ...s.onboardingDraft, experienceLevel },
        })),

      setBodyMetrics: (bodyMetrics) =>
        set((s) => ({
          onboardingDraft: { ...s.onboardingDraft, bodyMetrics },
        })),

      completeOnboarding: () => {
        const draft = get().onboardingDraft;

        if (!draft.bodyType || !draft.goal) {
          throw new Error('Cannot complete onboarding: bodyType and goal are required');
        }

        const profile: UserProfile = {
          id: `user-${Date.now()}`,
          bodyType: draft.bodyType,
          primaryGoal: draft.goal,
          availableEquipment: draft.availableEquipment,
          trainingDaysPerWeek: draft.trainingDaysPerWeek,
          experienceLevel: draft.experienceLevel,
          bodyMetrics: draft.bodyMetrics,
          createdAt: new Date().toISOString(),
        };

        const program = generateWorkoutProgram(profile);

        set({ profile, program, isOnboarded: true });
      },

      setProgram: (program) => set({ program }),

      advanceWeek: () =>
        set((s) => {
          if (!s.program) return s;
          return {
            program: {
              ...s.program,
              currentWeek: s.program.currentWeek + 1,
            },
          };
        }),

      reset: () =>
        set({
          profile: null,
          program: null,
          isOnboarded: false,
          onboardingDraft: { ...defaultDraft },
        }),
    }),
    {
      name: 'fitforge-user-profile',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        program: state.program,
        isOnboarded: state.isOnboarded,
      }),
    },
  ),
);
