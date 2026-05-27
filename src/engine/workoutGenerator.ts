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
  validateInput(input);

  const splitTemplate = resolveSplitTemplate(input.daysPerWeek, data.splitTemplates);
  const adaptation = splitTemplate.adaptations[input.bodyType];
  const trainingDays = adaptation.weekLayout
    .filter((day) => day.focusLabel !== "rest")
    .slice(0, input.daysPerWeek);

  const muscleFrequency = calculateMuscleFrequency(trainingDays);
  const usageCounter = new Map<string, number>();
  const weeklyPlan: WorkoutDayPlan[] = trainingDays.map((day) => {
    const candidateExercises = data.exerciseSeed.filter(
      (exercise) =>
        day.targetMuscles.includes(exercise.primaryMuscle) &&
        hasEquipmentMatch(exercise.equipmentRequired, input.equipmentOwned)
    );

    const selectedExercises = selectExercisesForDay({
      goal: input.goal,
      bodyType: input.bodyType,
      trainingAge: input.trainingAge,
      targetMuscles: day.targetMuscles,
      adaptation,
      candidates:
        candidateExercises.length > 0
          ? candidateExercises
          : data.exerciseSeed.filter((exercise) =>
              hasEquipmentMatch(exercise.equipmentRequired, input.equipmentOwned)
            ),
      usageCounter
    });

    const exercises = selectedExercises.map((exercise) =>
      mapExerciseToWorkout(exercise, input.goal, input.bodyType, muscleFrequency, selectedExercises)
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

function validateInput(input: GenerateWorkoutInput): void {
  if (!Number.isInteger(input.daysPerWeek) || input.daysPerWeek < 2 || input.daysPerWeek > 6) {
    throw new Error("daysPerWeek must be an integer between 2 and 6");
  }
  if (!input.equipmentOwned || input.equipmentOwned.length === 0) {
    throw new Error("equipmentOwned cannot be empty");
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

function hasEquipmentMatch(exerciseEquipment: string[], ownedEquipment: string[]): boolean {
  const normalizedOwned = new Set(ownedEquipment.map((item) => item.toLowerCase()));
  return exerciseEquipment.some(
    (required) => required === "bodyweight" || normalizedOwned.has(required.toLowerCase())
  );
}

interface SelectExercisesParams {
  goal: Goal;
  bodyType: BodyType;
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
  dayExercises: ExerciseSeedItem[]
): WorkoutExercise {
  const prescription = getEffectivePrescription(goal, bodyType, exercise.movementType);
  const weeklyTarget = getWeeklySetTarget(goal, bodyType, exercise.primaryMuscle);
  const sessionsForMuscle = muscleFrequency[exercise.primaryMuscle];
  const exercisesForMuscleToday = dayExercises.filter(
    (dayExercise) => dayExercise.primaryMuscle === exercise.primaryMuscle
  ).length;

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
