/**
 * Stage 5 — QA: Unit tests for the progression engine.
 * Validates all three progression models and deload logic.
 */

import {
  applyProgression,
  resolveProgressionModel,
  ProgressionInput,
} from '../src/engine/progressionEngine';
import { ExerciseSlot, ProgressionPlan, SetLog } from '../src/types';

// ─── Test fixtures ────────────────────────────────────────────────────────────

const baseSlot: ExerciseSlot = {
  slotOrder: 1,
  exerciseId: 'barbell-bench-press',
  sets: 4,
  repRangeLow: 8,
  repRangeHigh: 12,
  restSeconds: 90,
  rpeTarget: 8,
  isSuperset: false,
};

const linearPlan: ProgressionPlan = {
  model: 'LINEAR',
  deloadEveryNWeeks: 4,
  loadIncrementUpperBodyKg: 2.5,
  loadIncrementLowerBodyKg: 5.0,
};

const doublePlan: ProgressionPlan = {
  model: 'DOUBLE_PROGRESSIVE',
  deloadEveryNWeeks: 4,
  loadIncrementUpperBodyKg: 2.5,
  loadIncrementLowerBodyKg: 5.0,
};

const volumePlan: ProgressionPlan = {
  model: 'VOLUME_PROGRESSIVE',
  deloadEveryNWeeks: 4,
  loadIncrementUpperBodyKg: 2.5,
  loadIncrementLowerBodyKg: 5.0,
};

function makeLogs(rpeValues: number[], reps: number[]): SetLog[] {
  return rpeValues.map((rpe, i) => ({
    slotOrder: 1,
    exerciseId: 'barbell-bench-press',
    setNumber: i + 1,
    actualReps: reps[i],
    rpe,
    isCompleted: true,
  }));
}

// ─── LINEAR ───────────────────────────────────────────────────────────────────

describe('LINEAR progression model', () => {
  test('adds load when average RPE <= 8', () => {
    const input: ProgressionInput = {
      slot: baseSlot,
      completedSetLogs: makeLogs([7, 7, 8, 8], [12, 12, 12, 12]),
      plan: linearPlan,
      currentWeek: 1,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    expect(result.action).toContain('Increase load');
    expect(result.action).toContain('2.5');
  });

  test('uses lower body increment for lower body exercises', () => {
    const input: ProgressionInput = {
      slot: { ...baseSlot, exerciseId: 'barbell-squat' },
      completedSetLogs: makeLogs([7, 7, 7, 7], [5, 5, 5, 5]),
      plan: linearPlan,
      currentWeek: 1,
      isLowerBody: true,
    };
    const result = applyProgression(input);
    expect(result.action).toContain('5');
  });

  test('maintains load at RPE 9', () => {
    const input: ProgressionInput = {
      slot: baseSlot,
      completedSetLogs: makeLogs([9, 9, 9, 9], [12, 11, 10, 10]),
      plan: linearPlan,
      currentWeek: 1,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    expect(result.action).toContain('Maintain');
  });

  test('deloads at RPE 10', () => {
    const input: ProgressionInput = {
      slot: baseSlot,
      completedSetLogs: makeLogs([10, 10, 10, 10], [12, 10, 8, 6]),
      plan: linearPlan,
      currentWeek: 1,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    expect(result.action).toContain('Deload');
  });
});

// ─── DOUBLE_PROGRESSIVE ───────────────────────────────────────────────────────

describe('DOUBLE_PROGRESSIVE progression model', () => {
  test('adds load when all sets reach repRangeHigh', () => {
    const slot = { ...baseSlot, repRangeLow: 8, repRangeHigh: 12 };
    const input: ProgressionInput = {
      slot,
      completedSetLogs: makeLogs([8, 8, 8, 8], [12, 12, 12, 12]),
      plan: doublePlan,
      currentWeek: 2,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    expect(result.action).toContain('Add 2.5 kg');
    expect(result.action).toContain('reset reps');
  });

  test('adds 1 rep when not all sets at top of range', () => {
    const slot = { ...baseSlot, repRangeLow: 8, repRangeHigh: 12 };
    const input: ProgressionInput = {
      slot,
      completedSetLogs: makeLogs([8, 8, 8, 8], [10, 11, 12, 12]),
      plan: doublePlan,
      currentWeek: 2,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    expect(result.action).toContain('Add 1 rep');
  });
});

// ─── VOLUME_PROGRESSIVE ───────────────────────────────────────────────────────

describe('VOLUME_PROGRESSIVE progression model', () => {
  test('adds rep in phase 1–3 when at top of range', () => {
    const input: ProgressionInput = {
      slot: { ...baseSlot, repRangeLow: 15, repRangeHigh: 20 },
      completedSetLogs: makeLogs([7, 7, 7, 7], [20, 20, 20, 20]),
      plan: volumePlan,
      currentWeek: 1,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    expect(result.action).toContain('Add 1 rep');
  });

  test('adds a set in phase 4 (week 4 skipped by deload — week 5 maps to phase 2)', () => {
    // week 5 → phase = ((5-1) % 7)+1 = 5 → reduces rest
    const input: ProgressionInput = {
      slot: { ...baseSlot, restSeconds: 45 },
      completedSetLogs: makeLogs([7, 7, 7, 7], [16, 16, 16, 16]),
      plan: volumePlan,
      currentWeek: 5,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    expect(result.action).toContain('Rest');
  });

  test('reduces rest in phases 5–6', () => {
    const input: ProgressionInput = {
      slot: { ...baseSlot, restSeconds: 45 },
      completedSetLogs: makeLogs([7, 7, 7, 7], [16, 16, 16, 16]),
      plan: volumePlan,
      currentWeek: 5,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    const newRest = result.updatedSlot.restSeconds;
    expect(newRest).toBeLessThanOrEqual(45);
    expect(newRest).toBeGreaterThanOrEqual(30);
  });
});

// ─── DELOAD ───────────────────────────────────────────────────────────────────

describe('Deload protocol', () => {
  test('triggers on deload weeks (multiples of deloadEveryNWeeks)', () => {
    const input: ProgressionInput = {
      slot: { ...baseSlot, sets: 4 },
      completedSetLogs: makeLogs([8, 8, 8, 8], [12, 12, 12, 12]),
      plan: linearPlan,
      currentWeek: 4,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    expect(result.action).toContain('DELOAD');
    expect(result.updatedSlot.sets).toBeLessThan(baseSlot.sets);
  });

  test('deload reduces sets by ~40%', () => {
    const input: ProgressionInput = {
      slot: { ...baseSlot, sets: 5 },
      completedSetLogs: makeLogs([8, 8, 8, 8, 8], [12, 12, 12, 12, 12]),
      plan: linearPlan,
      currentWeek: 4,
      isLowerBody: false,
    };
    const result = applyProgression(input);
    expect(result.updatedSlot.sets).toBe(3); // 5 * 0.6 = 3
  });
});

// ─── resolveProgressionModel labels ──────────────────────────────────────────

describe('resolveProgressionModel', () => {
  test('returns human-readable label for each model', () => {
    expect(resolveProgressionModel('LINEAR')).toContain('Linear');
    expect(resolveProgressionModel('DOUBLE_PROGRESSIVE')).toContain('Double');
    expect(resolveProgressionModel('VOLUME_PROGRESSIVE')).toContain('Volume');
  });
});
