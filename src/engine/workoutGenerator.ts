import { seedData } from "../data/seedData";
import {
  BodyType,
  ExerciseSeedItem,
  Goal,
  MuscleGroup,
  SeedData,
  SplitAdaptation,
  SplitTemplate,
  TrainingAge,
  UserMetrics,
  WorkoutDayPlan,
  WorkoutExercise,
  WorkoutProgram,
  WorkoutSet
} from "../domain/types";
import { getEffectivePrescription, getWeeklySetTarget, goalBaselines } from "./rules";

export interface GenerateWorkoutInput extends UserMetrics {
  mesocycleWeek?: 1 | 2 | 3 | 4;
}

export type GenerateWorkoutResult =
  | { ok: true; program: WorkoutProgram }
  | { ok: false; error: Error };

const trainingAgeRank: Record<TrainingAge, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3
};

const difficultyRank: Record<ExerciseSeedItem["difficulty"], number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export function generateWorkoutProgram(
  input: GenerateWorkoutInput,
  data: SeedData = seedData
): WorkoutProgram {
  validateInput(input, data);

  const splitTemplate = resolveSplitTemplate(input.daysPerWeek, data.splitTemplates);
  const adaptation = splitTemplate.adaptations[input.bodyType];
  const trainingDays = adaptation.weekLayout
    .filter((day) => day.focusLabel !== "rest")
    .slice(0, input.daysPerWeek);
  const ownedEquipment = new Set(input.equipmentOwned.map((item) => item.toLowerCase().trim()));
  const equipmentFilteredPool = filterByEquipment(data.exerciseSeed, ownedEquipment);

  if (equipmentFilteredPool.length === 0) {
    throw new Error("No exercises available for the selected equipment");
  }

  const muscleFrequency = calculateMuscleFrequency(trainingDays);
  const usageCounter = new Map<string, number>();
  const weeklyPlan: WorkoutDayPlan[] = trainingDays.map((day) => {
    const candidateExercises = equipmentFilteredPool.filter(
      (exercise) =>
        day.targetMuscles.includes(exercise.primaryMuscle)
    );
    const fallbackCandidates =
      candidateExercises.length > 0 ? candidateExercises : equipmentFilteredPool;

    const selectedExercises = selectExercisesForDay({
      goal: input.goal,
      trainingAge: input.trainingAge,
      targetMuscles: day.targetMuscles,
      adaptation,
      candidates: fallbackCandidates,
      usageCounter
    });

    if (selectedExercises.length === 0) {
      throw new Error(`Unable to select exercises for day ${day.dayIndex}`);
    }

    const exercisesPerMuscle = countExercisesPerPrimaryMuscle(selectedExercises);
    const exercises = selectedExercises.map((exercise) =>
      mapExerciseToWorkout(
        exercise,
        input.goal,
        input.bodyType,
        muscleFrequency,
        exercisesPerMuscle
      )
    );

    return {
      dayIndex: day.dayIndex,
      focus: day.focusLabel,
      exercises
    };
  });

  return {
    programMeta: {
      goal: input.goal,
      bodyType: input.bodyType,
      mesocycleWeek: input.mesocycleWeek ?? 1
    },
    weeklyPlan
  };
}

export function safeGenerateWorkoutProgram(
  input: GenerateWorkoutInput,
  data: SeedData = seedData
): GenerateWorkoutResult {
  try {
    return { ok: true, program: generateWorkoutProgram(input, data) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error("Workout generation failed")
    };
  }
}

function validateInput(input: GenerateWorkoutInput, data: SeedData): void {
  if (!Number.isInteger(input.daysPerWeek) || input.daysPerWeek < 2 || input.daysPerWeek > 6) {
    throw new Error("daysPerWeek must be an integer between 2 and 6");
  }
  if (!input.equipmentOwned || input.equipmentOwned.length === 0) {
    throw new Error("equipmentOwned cannot be empty");
  }
  if (!input.goal || !input.bodyType || !input.trainingAge) {
    throw new Error("goal, bodyType and trainingAge are required");
  }
  if (dataHasNoExercises(data)) {
    throw new Error("Seed data does not include exercises");
  }
}

function resolveSplitTemplate(daysPerWeek: number, templates: SplitTemplate[]): SplitTemplate {
  if (templates.length === 0) {
    throw new Error("splitTemplates cannot be empty");
  }

  if (daysPerWeek >= 5) {
    return templates.find((template) => template.name === "push_pull_legs") ?? templates[0]!;
  }
  if (daysPerWeek === 4) {
    return templates.find((template) => template.name === "upper_lower") ?? templates[0]!;
  }
  return templates.find((template) => template.name === "full_body") ?? templates[0]!;
}

function calculateMuscleFrequency(days: SplitAdaptation["weekLayout"]): Record<MuscleGroup, number> {
  const frequency: Record<MuscleGroup, number> = {
    chest: 0,
    back: 0,
    legs: 0,
    shoulders: 0,
    arms: 0,
    core: 0
  };

  for (const day of days) {
    for (const muscle of day.targetMuscles) {
      frequency[muscle] += 1;
    }
  }

  for (const key of Object.keys(frequency) as MuscleGroup[]) {
    frequency[key] = Math.max(1, frequency[key]);
  }

  return frequency;
}

function filterByEquipment(
  exercises: ExerciseSeedItem[],
  ownedEquipment: ReadonlySet<string>
): ExerciseSeedItem[] {
  return exercises.filter((exercise) =>
    exercise.equipmentRequired.some(
      (required) =>
        required.toLowerCase() === "bodyweight" || ownedEquipment.has(required.toLowerCase())
    )
  );
}

interface SelectExercisesParams {
  goal: Goal;
  trainingAge: TrainingAge;
  targetMuscles: MuscleGroup[];
  adaptation: SplitAdaptation;
  candidates: ExerciseSeedItem[];
  usageCounter: Map<string, number>;
}

function selectExercisesForDay(params: SelectExercisesParams): ExerciseSeedItem[] {
  const { goal, trainingAge, targetMuscles, adaptation, candidates, usageCounter } = params;
  const baselineRatio = goalBaselines[goal].compoundIsolationRatio[0];
  const splitRatio = adaptation.compoundIsolationRatio[0];
  const compoundRatio = (baselineRatio + splitRatio) / 2;
  const totalExercises = clamp(targetMuscles.length + 2, 4, 7);
  const targetCompoundCount = clamp(Math.round(totalExercises * compoundRatio), 2, totalExercises);

  const sortedCandidates = [...candidates].sort((a, b) => {
    const scoreA = scoreExercise(a, targetMuscles, trainingAge, usageCounter);
    const scoreB = scoreExercise(b, targetMuscles, trainingAge, usageCounter);
    return scoreB - scoreA;
  });

  const compounds = sortedCandidates.filter((exercise) => exercise.movementType === "compound");
  const isolations = sortedCandidates.filter((exercise) => exercise.movementType === "isolation");
  const selected: ExerciseSeedItem[] = [];

  for (const exercise of compounds) {
    if (selected.length >= targetCompoundCount) {
      break;
    }
    selected.push(exercise);
  }

  for (const exercise of isolations) {
    if (selected.length >= totalExercises) {
      break;
    }
    selected.push(exercise);
  }

  for (const exercise of sortedCandidates) {
    if (selected.length >= totalExercises) {
      break;
    }
    if (!selected.some((selectedExercise) => selectedExercise.id === exercise.id)) {
      selected.push(exercise);
    }
  }

  for (const exercise of selected) {
    usageCounter.set(exercise.id, (usageCounter.get(exercise.id) ?? 0) + 1);
  }

  return selected;
}

function scoreExercise(
  exercise: ExerciseSeedItem,
  targetMuscles: MuscleGroup[],
  trainingAge: TrainingAge,
  usageCounter: Map<string, number>
): number {
  const primaryMatch = targetMuscles.includes(exercise.primaryMuscle) ? 4 : 0;
  const secondaryMatch = targetMuscles.some((muscle) =>
    exercise.secondaryMuscle.toLowerCase().includes(muscle)
  )
    ? 1
    : 0;
  const difficultyDistance = Math.abs(
    difficultyRank[exercise.difficulty] - trainingAgeRank[trainingAge]
  );
  const difficultyScore = 2 - difficultyDistance;
  const usagePenalty = (usageCounter.get(exercise.id) ?? 0) * 0.75;
  return primaryMatch + secondaryMatch + difficultyScore - usagePenalty;
}

function mapExerciseToWorkout(
  exercise: ExerciseSeedItem,
  goal: Goal,
  bodyType: BodyType,
  muscleFrequency: Record<MuscleGroup, number>,
  exercisesPerMuscle: Record<MuscleGroup, number>
): WorkoutExercise {
  const prescription = getEffectivePrescription(goal, bodyType, exercise.movementType);
  const weeklyTarget = getWeeklySetTarget(goal, bodyType, exercise.primaryMuscle);
  const sessionsForMuscle = muscleFrequency[exercise.primaryMuscle];
  const exercisesForMuscleToday = exercisesPerMuscle[exercise.primaryMuscle];

  const baseSets = weeklyTarget / sessionsForMuscle / Math.max(1, exercisesForMuscleToday);
  const setCount = clamp(
    Math.round(baseSets),
    exercise.movementType === "compound" ? 3 : 2,
    exercise.movementType === "compound" ? 5 : 4
  );

  const sets: WorkoutSet[] = Array.from({ length: setCount }, () => ({
    repsMin: prescription.reps.min,
    repsMax: prescription.reps.max,
    targetRPE: Number(prescription.targetRPE.toFixed(1)),
    restSec: prescription.restSec
  }));

  return {
    exerciseId: exercise.id,
    sets
  };
}

function countExercisesPerPrimaryMuscle(
  exercises: ExerciseSeedItem[]
): Record<MuscleGroup, number> {
  const counters: Record<MuscleGroup, number> = {
    chest: 0,
    back: 0,
    legs: 0,
    shoulders: 0,
    arms: 0,
    core: 0
  };

  for (const exercise of exercises) {
    counters[exercise.primaryMuscle] += 1;
  }

  for (const key of Object.keys(counters) as MuscleGroup[]) {
    counters[key] = Math.max(1, counters[key]);
  }

  return counters;
}

function dataHasNoExercises(data: SeedData): boolean {
  return !Array.isArray(data.exerciseSeed) || data.exerciseSeed.length === 0;
}
