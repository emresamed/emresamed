import { ExerciseSlot, ProgressionPlan, ProgressionModel, SetLog } from '../types';

// ─── Progression Engine ───────────────────────────────────────────────────────
// Implements the three Stage 1 progression models:
//   LINEAR             — Strength: increase load when RPE <= 8
//   DOUBLE_PROGRESSIVE — Hypertrophy: add reps then add load
//   VOLUME_PROGRESSIVE — Fat Loss: add reps → add sets → reduce rest → add load

export interface ProgressionInput {
  slot: ExerciseSlot;
  completedSetLogs: SetLog[];
  plan: ProgressionPlan;
  currentWeek: number;
  isLowerBody: boolean;
}

export interface ProgressionResult {
  updatedSlot: ExerciseSlot;
  action: string;
}

// ─── Public entry point ───────────────────────────────────────────────────────

export function applyProgression(input: ProgressionInput): ProgressionResult {
  const { plan, slot, completedSetLogs, currentWeek, isLowerBody } = input;

  // Deload every N weeks: reduce volume 40%, intensity 20%
  if (currentWeek % plan.deloadEveryNWeeks === 0) {
    return applyDeload(slot);
  }

  switch (plan.model) {
    case 'LINEAR':
      return applyLinear(slot, completedSetLogs, plan, isLowerBody);
    case 'DOUBLE_PROGRESSIVE':
      return applyDoubleProgressive(slot, completedSetLogs, plan, isLowerBody);
    case 'VOLUME_PROGRESSIVE':
      return applyVolumeProgressive(slot, completedSetLogs, plan, currentWeek);
    default: {
      const _exhaustive: never = plan.model;
      throw new Error(`Unknown progression model: ${_exhaustive}`);
    }
  }
}

// ─── Linear Progression ───────────────────────────────────────────────────────

function applyLinear(
  slot: ExerciseSlot,
  logs: SetLog[],
  plan: ProgressionPlan,
  isLowerBody: boolean,
): ProgressionResult {
  const avgRpe = averageRpe(logs);
  const loadIncrement = isLowerBody
    ? plan.loadIncrementLowerBodyKg
    : plan.loadIncrementUpperBodyKg;

  if (avgRpe === null || avgRpe <= 8) {
    return {
      updatedSlot: { ...slot, notes: `+${loadIncrement} kg next session` },
      action: `LINEAR: Increase load by ${loadIncrement} kg`,
    };
  }

  if (avgRpe === 9) {
    return {
      updatedSlot: { ...slot },
      action: 'LINEAR: Maintain load — high RPE',
    };
  }

  // avgRpe >= 10 or failed reps: deload
  return {
    updatedSlot: {
      ...slot,
      notes: 'DELOAD: Reduce load 10%',
    },
    action: 'LINEAR: Deload — RPE 10 / failed reps',
  };
}

// ─── Double-Progressive Progression ──────────────────────────────────────────

function applyDoubleProgressive(
  slot: ExerciseSlot,
  logs: SetLog[],
  plan: ProgressionPlan,
  isLowerBody: boolean,
): ProgressionResult {
  const allSetsAtTopOfRange = logs.every(
    (log) => log.isCompleted && (log.actualReps ?? 0) >= slot.repRangeHigh,
  );

  if (allSetsAtTopOfRange) {
    const loadIncrement = isLowerBody
      ? plan.loadIncrementLowerBodyKg
      : plan.loadIncrementUpperBodyKg;

    return {
      updatedSlot: {
        ...slot,
        repRangeLow: slot.repRangeLow,
        notes: `+${loadIncrement} kg — reps reset to ${slot.repRangeLow}`,
      },
      action: `DOUBLE_PROGRESSIVE: Add ${loadIncrement} kg, reset reps`,
    };
  }

  return {
    updatedSlot: { ...slot, notes: 'Add 1 rep per set' },
    action: 'DOUBLE_PROGRESSIVE: Add 1 rep per set',
  };
}

// ─── Volume-Progressive Progression ──────────────────────────────────────────

function applyVolumeProgressive(
  slot: ExerciseSlot,
  logs: SetLog[],
  plan: ProgressionPlan,
  currentWeek: number,
): ProgressionResult {
  const phase = ((currentWeek - 1) % 7) + 1;

  if (phase <= 3) {
    const allAtTop = logs.every(
      (log) => log.isCompleted && (log.actualReps ?? 0) >= slot.repRangeHigh,
    );
    if (allAtTop) {
      return {
        updatedSlot: { ...slot, notes: 'Add 1 rep per set next session' },
        action: 'VOLUME_PROGRESSIVE: Add 1 rep (phase 1–3)',
      };
    }
    return {
      updatedSlot: slot,
      action: 'VOLUME_PROGRESSIVE: Continue current reps',
    };
  }

  if (phase === 4) {
    return {
      updatedSlot: { ...slot, sets: slot.sets + 1, notes: '+1 set this week' },
      action: 'VOLUME_PROGRESSIVE: Add 1 set (phase 4)',
    };
  }

  if (phase <= 6) {
    const newRest = Math.max(30, slot.restSeconds - 5);
    return {
      updatedSlot: { ...slot, restSeconds: newRest, notes: 'Reduce rest by 5 s' },
      action: `VOLUME_PROGRESSIVE: Rest → ${newRest} s (phase 5–6)`,
    };
  }

  // Phase 7+: load increase, reps reset
  const loadIncrement = plan.loadIncrementUpperBodyKg;
  return {
    updatedSlot: {
      ...slot,
      repRangeLow: slot.repRangeLow,
      notes: `+${loadIncrement} kg — reps reset`,
    },
    action: `VOLUME_PROGRESSIVE: Add ${loadIncrement} kg, reset reps (phase 7+)`,
  };
}

// ─── Deload ───────────────────────────────────────────────────────────────────

function applyDeload(slot: ExerciseSlot): ProgressionResult {
  const deloadedSets = Math.max(1, Math.round(slot.sets * 0.6));
  return {
    updatedSlot: {
      ...slot,
      sets: deloadedSets,
      notes: 'DELOAD WEEK — 40% volume reduction',
    },
    action: 'DELOAD: -40% volume, -20% intensity week',
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function averageRpe(logs: SetLog[]): number | null {
  const rpeValues = logs.map((l) => l.rpe).filter((r): r is number => r !== undefined);
  if (rpeValues.length === 0) return null;
  return rpeValues.reduce((sum, r) => sum + r, 0) / rpeValues.length;
}

export function resolveProgressionModel(
  model: ProgressionModel,
): string {
  const labels: Record<ProgressionModel, string> = {
    LINEAR: 'Linear (+weight each session)',
    DOUBLE_PROGRESSIVE: 'Double Progressive (reps then weight)',
    VOLUME_PROGRESSIVE: 'Volume Progressive (reps → sets → load)',
  };
  return labels[model];
}
