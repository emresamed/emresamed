import {
  BODY_TYPES,
  GOALS,
  type BodyType,
  type ExerciseSeed,
  type ExerciseSlot,
  type GeneratedWorkoutPlan,
  type Goal,
  type Mechanics,
  type MuscleGroup,
  type Range,
  type SeedData,
  type TrainingDayTemplate,
  type UserMetrics,
  type WeeklySplitTemplate,
  type WorkoutExercise,
  type WorkoutSession,
} from "../domain/types.js";
import { BODY_TYPE_MODIFIERS, GOAL_PRESCRIPTIONS, MINIMUM_WEEKLY_SETS, scoreExerciseForGoal } from "./biomechanicalRules.js";

interface GenerationInput {
  readonly seedData: SeedData | string;
  readonly metrics: UserMetrics;
}

interface SelectionContext {
  readonly selectedExerciseIds: Set<string>;
  readonly movementFamilies: Map<string, number>;
  readonly weeklySetsByMuscle: Map<MuscleGroup, number>;
  readonly corePatterns: Set<string>;
  kneeDominantCount: number;
  hipDominantCount: number;
}

interface ScoredExercise {
  readonly exercise: ExerciseSeed;
  readonly score: number;
}

interface ValidatedMetrics extends UserMetrics {
  readonly bodyType: BodyType;
  readonly daysPerWeek: number;
  readonly goals: readonly [Goal, ...Goal[]];
}

const CORE_PATTERNS = ["anti_extension", "anti_rotation", "flexion", "carry"] as const;

const DIFFICULTY_SCORE: Record<ExerciseSeed["difficulty"], number> = {
  beginner: 3,
  intermediate: 2,
  advanced: 1,
};

const USER_DIFFICULTY_THRESHOLD: Record<UserMetrics["difficulty"], number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

export function parseSeedData(seedData: SeedData | string): SeedData {
  if (typeof seedData === "string") {
    return JSON.parse(seedData) as SeedData;
  }
  return seedData;
}

export function generateWorkoutPlan(input: GenerationInput): GeneratedWorkoutPlan {
  const seed = parseSeedData(input.seedData);
  const metrics = validateMetrics(input.metrics);
  const goal = metrics.goals[0];

  const template = selectTemplate(seed.weeklySplitTemplates, metrics.bodyType, metrics.daysPerWeek);
  const trainingDays = adaptTrainingDays(template, metrics.daysPerWeek);
  const exerciseById = new Map(seed.exercises.map((exercise) => [exercise.id, exercise]));
  const availableEquipment = new Set(metrics.availableEquipment.concat("bodyweight"));
  const contraindications = new Set(metrics.contraindications);
  const modifier = BODY_TYPE_MODIFIERS[metrics.bodyType];
  const goalPrescription = GOAL_PRESCRIPTIONS[goal];

  const context: SelectionContext = {
    selectedExerciseIds: new Set<string>(),
    movementFamilies: new Map<string, number>(),
    weeklySetsByMuscle: new Map<MuscleGroup, number>(),
    corePatterns: new Set<string>(),
    kneeDominantCount: 0,
    hipDominantCount: 0,
  };

  let sessions: WorkoutSession[] = trainingDays.map((day) => {
    const usedTargetZones = new Set<string>();
    const prioritizedMuscles = new Set(day.focus.slice(0, 2));
    const exercises: WorkoutExercise[] = [];

    for (const slot of day.exerciseSlots) {
      const candidates = getCandidateExercises({
        slot,
        allExercises: seed.exercises,
        exerciseById,
        availableEquipment,
        contraindications,
        userDifficulty: metrics.difficulty,
      });
      const selected = pickExercise(candidates, slot, goal, context, usedTargetZones, prioritizedMuscles);
      if (!selected) {
        continue;
      }

      const prescription = buildPrescription({
        slot,
        mechanics: selected.mechanics,
        goal,
        volumeMultiplier: modifier.weeklyVolumeMultiplier,
        setCap: modifier.setCapPerSessionPerMuscle,
        restShift: modifier.restShiftSeconds,
      });

      exercises.push({
        dayIndex: day.dayIndex,
        sessionName: day.name,
        slotId: slot.slotId,
        exerciseId: selected.id,
        exerciseName: selected.name,
        primaryMuscle: selected.primaryMuscle,
        targetZone: selected.primaryTargetZone,
        movementType: selected.movementType,
        mechanics: selected.mechanics,
        prescribedSets: prescription.sets,
        repRange: prescription.reps,
        rpeRange: goalPrescription.rpe,
        restSeconds: prescription.rest,
      });

      usedTargetZones.add(selected.primaryTargetZone);
      context.selectedExerciseIds.add(selected.id);
      incrementCounter(context.movementFamilies, movementFamily(selected.movementType));
      incrementCounter(context.weeklySetsByMuscle, selected.primaryMuscle, prescription.sets);
      updateMovementPatternCounters(context, selected);
    }

    return {
      dayIndex: day.dayIndex,
      name: day.name,
      focus: day.focus,
      exercises,
    };
  });

  sessions = enforceCoreCoverage(sessions, seed.exercises, availableEquipment, contraindications, metrics, context);
  sessions = enforceMinimumSetFloor(sessions, seed.exercises, availableEquipment, contraindications, metrics, context);

  return {
    bodyType: metrics.bodyType,
    goal,
    daysPerWeek: metrics.daysPerWeek,
    templateId: template.id,
    sessions,
  };
}

function validateMetrics(metrics: UserMetrics): ValidatedMetrics {
  if (!metrics.bodyType || !BODY_TYPES.includes(metrics.bodyType)) {
    throw new Error("A valid bodyType is required.");
  }
  const primaryGoal = metrics.goals[0];
  if (!primaryGoal || !GOALS.includes(primaryGoal)) {
    throw new Error("At least one valid goal is required.");
  }
  if (!metrics.daysPerWeek || metrics.daysPerWeek < 2 || metrics.daysPerWeek > 6) {
    throw new Error("daysPerWeek must be between 2 and 6.");
  }
  if (metrics.availableEquipment.length === 0) {
    throw new Error("availableEquipment must contain at least one equipment id.");
  }
  return {
    ...metrics,
    bodyType: metrics.bodyType,
    daysPerWeek: metrics.daysPerWeek,
    goals: [primaryGoal, ...metrics.goals.slice(1)] as [Goal, ...Goal[]],
  };
}

function selectTemplate(templates: readonly WeeklySplitTemplate[], bodyType: BodyType, daysPerWeek: number): WeeklySplitTemplate {
  const bodyTypeTemplates = templates.filter((template) => template.bodyType === bodyType);
  if (bodyTypeTemplates.length === 0) {
    throw new Error(`No templates found for body type: ${bodyType}`);
  }

  const preferredSplitType = daysPerWeek <= 3 ? "full_body" : "upper_lower";
  const sorted = bodyTypeTemplates
    .slice()
    .sort((left, right) => {
      const dayDiff = Math.abs(left.daysPerWeek - daysPerWeek) - Math.abs(right.daysPerWeek - daysPerWeek);
      if (dayDiff !== 0) {
        return dayDiff;
      }
      if (left.splitType === preferredSplitType && right.splitType !== preferredSplitType) {
        return -1;
      }
      if (right.splitType === preferredSplitType && left.splitType !== preferredSplitType) {
        return 1;
      }
      return left.id.localeCompare(right.id);
    });

  const selectedTemplate = sorted[0];
  if (!selectedTemplate) {
    throw new Error("Unable to select a training template.");
  }

  return selectedTemplate;
}

function adaptTrainingDays(template: WeeklySplitTemplate, targetDaysPerWeek: number): readonly TrainingDayTemplate[] {
  const sortedDays = template.trainingDays.slice().sort((left, right) => left.dayIndex - right.dayIndex);
  if (sortedDays.length === 0) {
    throw new Error(`Template ${template.id} has no training days.`);
  }

  if (targetDaysPerWeek === sortedDays.length) {
    return sortedDays;
  }

  if (targetDaysPerWeek < sortedDays.length) {
    return sortedDays.slice(0, targetDaysPerWeek);
  }

  const expandedDays: TrainingDayTemplate[] = [];
  for (let index = 0; index < targetDaysPerWeek; index += 1) {
    const baseDay = sortedDays[index % sortedDays.length]!;
    const loop = Math.floor(index / sortedDays.length) + 1;
    expandedDays.push({
      ...baseDay,
      dayIndex: index + 1,
      name: loop === 1 ? baseDay.name : `${baseDay.name} (${loop})`,
    });
  }
  return expandedDays;
}

function getCandidateExercises(input: {
  readonly slot: ExerciseSlot;
  readonly allExercises: readonly ExerciseSeed[];
  readonly exerciseById: ReadonlyMap<string, ExerciseSeed>;
  readonly availableEquipment: ReadonlySet<string>;
  readonly contraindications: ReadonlySet<string>;
  readonly userDifficulty: UserMetrics["difficulty"];
}): readonly ExerciseSeed[] {
  const slotCandidates = (input.slot.candidateExerciseIds ?? [])
    .map((id) => input.exerciseById.get(id))
    .filter((exercise): exercise is ExerciseSeed => Boolean(exercise));

  const filteredSlotCandidates = filterByUserReadiness(slotCandidates, input);
  if (filteredSlotCandidates.length > 0) {
    return filteredSlotCandidates;
  }

  const fallback = input.allExercises.filter((exercise) => {
    if (exercise.primaryMuscle !== input.slot.primaryMuscle) {
      return false;
    }
    if (exercise.mechanics !== input.slot.mechanics) {
      return false;
    }
    if (exercise.movementType !== input.slot.movementType) {
      return false;
    }
    return true;
  });

  return filterByUserReadiness(fallback, input);
}

function filterByUserReadiness(
  exercises: readonly ExerciseSeed[],
  input: {
    readonly availableEquipment: ReadonlySet<string>;
    readonly contraindications: ReadonlySet<string>;
    readonly userDifficulty: UserMetrics["difficulty"];
  },
): readonly ExerciseSeed[] {
  return exercises.filter((exercise) => {
    const allEquipmentAvailable = exercise.equipment.every((equipmentId) => input.availableEquipment.has(equipmentId));
    if (!allEquipmentAvailable) {
      return false;
    }

    const contraindicated = (exercise.contraindicationTags ?? []).some((tag) => input.contraindications.has(tag));
    if (contraindicated) {
      return false;
    }

    const difficultyIndex = difficultyRank(exercise.difficulty);
    return difficultyIndex <= USER_DIFFICULTY_THRESHOLD[input.userDifficulty];
  });
}

function pickExercise(
  candidates: readonly ExerciseSeed[],
  slot: ExerciseSlot,
  goal: Goal,
  context: SelectionContext,
  usedTargetZones: ReadonlySet<string>,
  prioritizedMuscles: ReadonlySet<MuscleGroup>,
): ExerciseSeed | undefined {
  if (candidates.length === 0) {
    return undefined;
  }

  const scored: ScoredExercise[] = candidates.map((exercise) => ({
    exercise,
    score: scoreCandidateExercise(exercise, slot, goal, context, usedTargetZones, prioritizedMuscles),
  }));

  scored.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    return left.exercise.name.localeCompare(right.exercise.name);
  });

  return scored[0]?.exercise;
}

function scoreCandidateExercise(
  exercise: ExerciseSeed,
  slot: ExerciseSlot,
  goal: Goal,
  context: SelectionContext,
  usedTargetZones: ReadonlySet<string>,
  prioritizedMuscles: ReadonlySet<MuscleGroup>,
): number {
  let score = 0;
  score += scoreExerciseForGoal(goal, exercise.mechanics, exercise.movementType, DIFFICULTY_SCORE[exercise.difficulty]);

  if (slot.targetZones.includes(exercise.primaryTargetZone)) {
    score += 6;
  }

  if (slot.movementType === exercise.movementType) {
    score += 4;
  }

  if (usedTargetZones.has(exercise.primaryTargetZone) && !prioritizedMuscles.has(exercise.primaryMuscle)) {
    score -= 5;
  }

  if (context.selectedExerciseIds.has(exercise.id)) {
    score -= 2;
  }

  score += movementBalanceBonus(exercise.movementType, context);
  score += lowerBodyPatternBonus(exercise.movementType, context);
  score += coreCoverageBonus(exercise, context);

  return score;
}

function movementBalanceBonus(movementType: string, context: SelectionContext): number {
  const horizontalPush = context.movementFamilies.get("horizontal_push") ?? 0;
  const horizontalPull = context.movementFamilies.get("horizontal_pull") ?? 0;
  const verticalPush = context.movementFamilies.get("vertical_push") ?? 0;
  const verticalPull = context.movementFamilies.get("vertical_pull") ?? 0;

  if (movementType === "horizontal_pull" && horizontalPush > horizontalPull) {
    return 4;
  }
  if (movementType === "horizontal_push" && horizontalPull > horizontalPush) {
    return 4;
  }
  if (movementType === "vertical_pull" && verticalPush > verticalPull) {
    return 3;
  }
  if (movementType === "vertical_push" && verticalPull > verticalPush) {
    return 3;
  }
  return 0;
}

function lowerBodyPatternBonus(movementType: string, context: SelectionContext): number {
  if (isKneeDominant(movementType) && context.kneeDominantCount < context.hipDominantCount) {
    return 3;
  }
  if (isHipDominant(movementType) && context.hipDominantCount < context.kneeDominantCount) {
    return 3;
  }
  return 0;
}

function coreCoverageBonus(exercise: ExerciseSeed, context: SelectionContext): number {
  if (exercise.primaryMuscle !== "core") {
    return 0;
  }
  const pattern = normalizeCorePattern(exercise.movementType);
  if (!pattern) {
    return 0;
  }
  return context.corePatterns.has(pattern) ? 0 : 5;
}

function buildPrescription(input: {
  readonly slot: ExerciseSlot;
  readonly mechanics: Mechanics;
  readonly goal: Goal;
  readonly volumeMultiplier: number;
  readonly setCap: number;
  readonly restShift: Range<number>;
}): {
  readonly sets: number;
  readonly reps: Range<number>;
  readonly rest: Range<number>;
} {
  const goalProfile = GOAL_PRESCRIPTIONS[input.goal];
  const goalSetRange = input.mechanics === "compound" ? goalProfile.compoundSets : goalProfile.isolationSets;
  const goalRepRange = input.mechanics === "compound" ? goalProfile.compoundReps : goalProfile.isolationReps;
  const goalRest = input.mechanics === "compound" ? goalProfile.restCompoundSeconds : goalProfile.restIsolationSeconds;

  const setRange = intersectRange(input.slot.sets, goalSetRange);
  const repRange = intersectRange(input.slot.reps, goalRepRange);
  const restRange = intersectRange(shiftRange(goalRest, input.restShift), input.slot.restSeconds);

  const volumeScaledSets = Math.round(average(setRange) * input.volumeMultiplier);
  const sets = clamp(volumeScaledSets, setRange.min, Math.min(setRange.max, input.setCap));

  return {
    sets,
    reps: repRange,
    rest: {
      min: Math.max(30, restRange.min),
      max: Math.max(30, restRange.max),
    },
  };
}

function enforceCoreCoverage(
  sessions: WorkoutSession[],
  allExercises: readonly ExerciseSeed[],
  availableEquipment: ReadonlySet<string>,
  contraindications: ReadonlySet<string>,
  metrics: UserMetrics,
  context: SelectionContext,
): WorkoutSession[] {
  let updatedSessions = sessions.slice();
  const missingPatterns = CORE_PATTERNS.filter((pattern) => !context.corePatterns.has(pattern));
  if (missingPatterns.length === 0) {
    return updatedSessions;
  }

  for (const pattern of missingPatterns) {
    const candidate = filterByUserReadiness(
      allExercises.filter((exercise) => exercise.primaryMuscle === "core" && normalizeCorePattern(exercise.movementType) === pattern),
      {
        availableEquipment,
        contraindications,
        userDifficulty: metrics.difficulty,
      },
    )[0];
    if (!candidate) {
      continue;
    }

    const targetSession = updatedSessions.find((session) => session.focus.includes("core")) ?? updatedSessions[0];
    if (!targetSession) {
      continue;
    }
    const targetSessionIndex = updatedSessions.findIndex((session) => session.dayIndex === targetSession.dayIndex);
    if (targetSessionIndex < 0) {
      continue;
    }

    const appended: WorkoutExercise = {
      dayIndex: targetSession.dayIndex,
      sessionName: targetSession.name,
      slotId: `core-balance-${pattern}`,
      exerciseId: candidate.id,
      exerciseName: candidate.name,
      primaryMuscle: candidate.primaryMuscle,
      targetZone: candidate.primaryTargetZone,
      movementType: candidate.movementType,
      mechanics: candidate.mechanics,
      prescribedSets: 2,
      repRange: { min: 10, max: 15 },
      rpeRange: { min: 6, max: 8 },
      restSeconds: { min: 45, max: 75 },
    };
    updatedSessions = updatedSessions.map((session, index) =>
      index === targetSessionIndex
        ? {
            ...session,
            exercises: [...session.exercises, appended],
          }
        : session,
    );
    incrementCounter(context.weeklySetsByMuscle, "core", appended.prescribedSets);
    context.corePatterns.add(pattern);
  }
  return updatedSessions;
}

function enforceMinimumSetFloor(
  sessions: WorkoutSession[],
  allExercises: readonly ExerciseSeed[],
  availableEquipment: ReadonlySet<string>,
  contraindications: ReadonlySet<string>,
  metrics: UserMetrics,
  context: SelectionContext,
): WorkoutSession[] {
  let updatedSessions = sessions.slice();
  for (const [muscle, minimum] of Object.entries(MINIMUM_WEEKLY_SETS) as Array<[MuscleGroup, number]>) {
    let current = context.weeklySetsByMuscle.get(muscle) ?? 0;
    if (current >= minimum) {
      continue;
    }

    const candidate = filterByUserReadiness(
      allExercises.filter((exercise) => exercise.primaryMuscle === muscle),
      {
        availableEquipment,
        contraindications,
        userDifficulty: metrics.difficulty,
      },
    )[0];
    if (!candidate) {
      continue;
    }

    const targetSession = updatedSessions.find((session) => session.focus.includes(muscle)) ?? updatedSessions[0];
    if (!targetSession) {
      continue;
    }
    const targetSessionIndex = updatedSessions.findIndex((session) => session.dayIndex === targetSession.dayIndex);
    if (targetSessionIndex < 0) {
      continue;
    }

    while (current < minimum) {
      const filler: WorkoutExercise = {
        dayIndex: targetSession.dayIndex,
        sessionName: targetSession.name,
        slotId: `${muscle}-minimum-volume`,
        exerciseId: candidate.id,
        exerciseName: candidate.name,
        primaryMuscle: candidate.primaryMuscle,
        targetZone: candidate.primaryTargetZone,
        movementType: candidate.movementType,
        mechanics: candidate.mechanics,
        prescribedSets: 2,
        repRange: { min: 10, max: 15 },
        rpeRange: { min: 6.5, max: 8.5 },
        restSeconds: { min: 60, max: 90 },
      };
      updatedSessions = updatedSessions.map((session, index) =>
        index === targetSessionIndex
          ? {
              ...session,
              exercises: [...session.exercises, filler],
            }
          : session,
      );

      incrementCounter(context.weeklySetsByMuscle, muscle, filler.prescribedSets);
      current += filler.prescribedSets;
    }
  }
  return updatedSessions;
}

function updateMovementPatternCounters(context: SelectionContext, exercise: ExerciseSeed): void {
  if (isKneeDominant(exercise.movementType)) {
    context.kneeDominantCount += 1;
  }
  if (isHipDominant(exercise.movementType)) {
    context.hipDominantCount += 1;
  }

  const pattern = normalizeCorePattern(exercise.movementType);
  if (pattern) {
    context.corePatterns.add(pattern);
  }
}

function movementFamily(movementType: string): string {
  if (movementType === "horizontal_push" || movementType === "horizontal_pull") {
    return movementType;
  }
  if (movementType === "vertical_push" || movementType === "vertical_pull") {
    return movementType;
  }
  return "other";
}

function normalizeCorePattern(movementType: string): (typeof CORE_PATTERNS)[number] | undefined {
  if (movementType === "anti_extension") {
    return "anti_extension";
  }
  if (movementType === "anti_rotation" || movementType === "rotation") {
    return "anti_rotation";
  }
  if (movementType === "flexion") {
    return "flexion";
  }
  if (movementType === "carry") {
    return "carry";
  }
  return undefined;
}

function isKneeDominant(movementType: string): boolean {
  return movementType === "squat" || movementType === "lunge" || movementType === "leg_extension";
}

function isHipDominant(movementType: string): boolean {
  return movementType === "hip_hinge" || movementType === "leg_curl";
}

function difficultyRank(difficulty: ExerciseSeed["difficulty"]): number {
  if (difficulty === "beginner") {
    return 0;
  }
  if (difficulty === "intermediate") {
    return 1;
  }
  return 2;
}

function incrementCounter<K>(counter: Map<K, number>, key: K, amount = 1): void {
  counter.set(key, (counter.get(key) ?? 0) + amount);
}

function intersectRange(primary: Range<number>, secondary: Range<number>): Range<number> {
  const min = Math.max(primary.min, secondary.min);
  const max = Math.min(primary.max, secondary.max);
  if (min <= max) {
    return { min, max };
  }
  return { min: primary.min, max: primary.max };
}

function shiftRange(base: Range<number>, shift: Range<number>): Range<number> {
  return {
    min: base.min + shift.min,
    max: base.max + shift.max,
  };
}

function average(range: Range<number>): number {
  return (range.min + range.max) / 2;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
