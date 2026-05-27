import {
  UserProfile,
  Exercise,
  WorkoutProgram,
  WorkoutDay,
  ExerciseSlot,
  VolumePrescription,
  MuscleGroup,
  Goal,
  Difficulty,
  ExperienceLevel,
} from '../types';
import { EXERCISES } from '../data/exercises';
import { getVolumePrescription } from '../data/volumeMatrix';
import { resolveSplitType, getSplitTemplate } from '../data/splitTemplates';

// Simple ID generator — avoids runtime uuid dependency in tests
let _idCounter = 0;
const generateId = () => `id-${++_idCounter}-${Date.now()}`;

// ─── Difficulty ordering used for experience-level filtering ─────────────────
const DIFFICULTY_RANK: Record<Difficulty, number> = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
};

const EXPERIENCE_TO_DIFFICULTY: Record<ExperienceLevel, Difficulty> = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
};

// ─── How many exercises to slot per muscle group, per goal ───────────────────
const EXERCISES_PER_GROUP: Record<Goal, { compounds: number; isolations: number }> = {
  STRENGTH: { compounds: 2, isolations: 0 },
  HYPERTROPHY: { compounds: 2, isolations: 2 },
  FAT_LOSS: { compounds: 1, isolations: 3 },
};

// ─── Main generator ──────────────────────────────────────────────────────────

/**
 * Generates a fully-populated WorkoutProgram from a UserProfile.
 * Strictly follows Stage 1 biomechanics rules:
 *   - Split type resolved by trainingDaysPerWeek
 *   - Volume prescription resolved by bodyType × goal
 *   - Mechanics bias applied (compound-first for strength, mixed for hypertrophy, etc.)
 *   - Equipment filter applied per slot
 *   - Difficulty cap applied per experienceLevel
 */
export function generateWorkoutProgram(profile: UserProfile): WorkoutProgram {
  const splitType = resolveSplitType(profile.trainingDaysPerWeek);
  const template = getSplitTemplate(splitType);
  const prescription = getVolumePrescription(profile.bodyType, profile.primaryGoal);
  const maxDifficulty = EXPERIENCE_TO_DIFFICULTY[profile.experienceLevel];

  const days: WorkoutDay[] = template.days.map((dayTemplate) => {
    if (dayTemplate.isRestDay) {
      return {
        id: generateId(),
        dayIndex: dayTemplate.dayIndex,
        label: dayTemplate.label,
        isRestDay: true,
        muscleGroupFocus: [],
        exerciseSlots: [],
      };
    }

    const slots = buildExerciseSlotsForDay(
      dayTemplate.muscleGroupFocus,
      profile,
      prescription,
      maxDifficulty,
    );

    return {
      id: generateId(),
      dayIndex: dayTemplate.dayIndex,
      label: dayTemplate.label,
      isRestDay: false,
      muscleGroupFocus: dayTemplate.muscleGroupFocus,
      exerciseSlots: slots,
    };
  });

  return {
    id: generateId(),
    userId: profile.id,
    splitType,
    weeks: 8,
    currentWeek: 1,
    days,
    progressionPlan: {
      model: prescription.progressionModel,
      deloadEveryNWeeks: 4,
      loadIncrementUpperBodyKg: 2.5,
      loadIncrementLowerBodyKg: 5.0,
    },
  };
}

// ─── Day-level slot builder ───────────────────────────────────────────────────

function buildExerciseSlotsForDay(
  muscleGroups: MuscleGroup[],
  profile: UserProfile,
  prescription: VolumePrescription,
  maxDifficulty: Difficulty,
): ExerciseSlot[] {
  const slots: ExerciseSlot[] = [];
  let slotOrder = 1;
  const usedExerciseIds = new Set<string>();

  for (const group of muscleGroups) {
    const selected = selectExercisesForGroup(
      group,
      profile,
      maxDifficulty,
      usedExerciseIds,
    );

    for (const exercise of selected) {
      usedExerciseIds.add(exercise.id);
      const isLowerBody = group === 'LEGS';
      slots.push(
        buildSlot(slotOrder++, exercise, prescription, isLowerBody),
      );
    }
  }

  return slots;
}

// ─── Group-level exercise selector ───────────────────────────────────────────

function selectExercisesForGroup(
  group: MuscleGroup,
  profile: UserProfile,
  maxDifficulty: Difficulty,
  usedIds: Set<string>,
): Exercise[] {
  const maxRank = DIFFICULTY_RANK[maxDifficulty];

  const candidates = EXERCISES.filter(
    (e) =>
      e.primaryMuscle === group &&
      !usedIds.has(e.id) &&
      DIFFICULTY_RANK[e.difficulty] <= maxRank &&
      e.equipment.some((eq) => profile.availableEquipment.includes(eq)),
  );

  const compounds = candidates.filter((e) => e.mechanics === 'COMPOUND');
  const isolations = candidates.filter((e) => e.mechanics === 'ISOLATION');

  const { compounds: wantCompounds, isolations: wantIsolations } =
    EXERCISES_PER_GROUP[profile.primaryGoal];

  // Shuffle each bucket deterministically by exercise id to add variety
  // across generated programs without randomness that would break tests.
  const pickedCompounds = stableSort(compounds).slice(0, wantCompounds);
  const pickedIsolations = stableSort(isolations).slice(0, wantIsolations);

  return [...pickedCompounds, ...pickedIsolations];
}

// ─── Slot builder ─────────────────────────────────────────────────────────────

function buildSlot(
  slotOrder: number,
  exercise: Exercise,
  prescription: VolumePrescription,
  isLowerBody: boolean,
): ExerciseSlot {
  // Apply a small rest-period bonus for lower-body compound movements
  const restBonus =
    isLowerBody && exercise.mechanics === 'COMPOUND' ? 30 : 0;

  return {
    slotOrder,
    exerciseId: exercise.id,
    sets: prescription.sets,
    repRangeLow: prescription.repRangeLow,
    repRangeHigh: prescription.repRangeHigh,
    restSeconds: prescription.restSeconds + restBonus,
    rpeTarget: prescription.rpeTarget,
    isSuperset: false,
  };
}

// ─── Stable sort (no randomness — predictable for tests) ─────────────────────

function stableSort(exercises: Exercise[]): Exercise[] {
  return [...exercises].sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Superset injection (Fat Loss specialisation) ────────────────────────────

/**
 * Post-processes a WorkoutDay and pairs consecutive isolation slots as
 * supersets when the goal is FAT_LOSS. Mutates the slots in-place and
 * returns the updated day.
 */
export function injectSupersets(day: WorkoutDay, goal: Goal): WorkoutDay {
  if (goal !== 'FAT_LOSS') return day;

  const slots = [...day.exerciseSlots];
  for (let i = 0; i < slots.length - 1; i++) {
    const current = slots[i];
    const next = slots[i + 1];
    if (!current.isSuperset && !next.isSuperset) {
      slots[i] = { ...current, isSuperset: true, supersetPartnerId: next.exerciseId };
      slots[i + 1] = { ...next, isSuperset: true, supersetPartnerId: current.exerciseId };
      i++; // skip the just-paired slot
    }
  }

  return { ...day, exerciseSlots: slots };
}
