/**
 * Stage 5 — QA: Unit tests for the workout generation algorithm.
 * Proves valid output for ALL 9 body type × goal combinations.
 */

import { generateWorkoutProgram, injectSupersets } from '../src/engine/workoutGenerator';
import { UserProfile, BodyType, Goal, WorkoutProgram, ExerciseSlot } from '../src/types';
import { EXERCISES } from '../src/data/exercises';
import { getExerciseById } from '../src/data/exercises';

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeProfile(
  bodyType: BodyType,
  goal: Goal,
  daysPerWeek = 3,
): UserProfile {
  return {
    id: `test-user-${bodyType}-${goal}`,
    bodyType,
    primaryGoal: goal,
    availableEquipment: ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BODYWEIGHT', 'PULL_UP_BAR'],
    trainingDaysPerWeek: daysPerWeek,
    experienceLevel: 'INTERMEDIATE',
    createdAt: new Date().toISOString(),
  };
}

const ALL_BODY_TYPES: BodyType[] = ['ECTOMORPH', 'MESOMORPH', 'ENDOMORPH'];
const ALL_GOALS: Goal[] = ['STRENGTH', 'HYPERTROPHY', 'FAT_LOSS'];
const ALL_DAYS_PER_WEEK = [2, 3, 4, 5, 6];

// ─── Exercise data integrity ───────────────────────────────────────────────────

describe('Exercise seed data', () => {
  test('contains at least 50 exercises', () => {
    expect(EXERCISES.length).toBeGreaterThanOrEqual(50);
  });

  test('every exercise has required fields', () => {
    for (const ex of EXERCISES) {
      expect(ex.id).toBeTruthy();
      expect(ex.name).toBeTruthy();
      expect(ex.primaryMuscle).toBeTruthy();
      expect(ex.mechanics).toMatch(/^(COMPOUND|ISOLATION)$/);
      expect(ex.equipment.length).toBeGreaterThan(0);
      expect(ex.difficulty).toMatch(/^(BEGINNER|INTERMEDIATE|ADVANCED)$/);
      expect(ex.targetZone).toBeTruthy();
      expect(ex.movementPattern).toBeTruthy();
      expect(typeof ex.unilateral).toBe('boolean');
    }
  });

  test('exercise ids are unique', () => {
    const ids = EXERCISES.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('getExerciseById returns correct exercise', () => {
    const ex = getExerciseById('barbell-bench-press');
    expect(ex).toBeDefined();
    expect(ex?.primaryMuscle).toBe('CHEST');
    expect(ex?.mechanics).toBe('COMPOUND');
  });

  test('getExerciseById returns undefined for unknown id', () => {
    const ex = getExerciseById('nonexistent-exercise');
    expect(ex).toBeUndefined();
  });
});

// ─── Workout generation — all 9 combinations ─────────────────────────────────

describe('generateWorkoutProgram', () => {
  for (const bodyType of ALL_BODY_TYPES) {
    for (const goal of ALL_GOALS) {
      describe(`${bodyType} × ${goal}`, () => {
        let program: WorkoutProgram;

        beforeEach(() => {
          program = generateWorkoutProgram(makeProfile(bodyType, goal));
        });

        test('returns a program with an id', () => {
          expect(program.id).toBeTruthy();
        });

        test('has at least one active (non-rest) day', () => {
          const activeDays = program.days.filter((d) => !d.isRestDay);
          expect(activeDays.length).toBeGreaterThan(0);
        });

        test('each active day has at least one exercise slot', () => {
          for (const day of program.days.filter((d) => !d.isRestDay)) {
            expect(day.exerciseSlots.length).toBeGreaterThan(0);
          }
        });

        test('all exercise ids reference valid exercises', () => {
          for (const day of program.days.filter((d) => !d.isRestDay)) {
            for (const slot of day.exerciseSlots) {
              const ex = getExerciseById(slot.exerciseId);
              expect(ex).toBeDefined();
            }
          }
        });

        test('slot order is sequential within each day', () => {
          for (const day of program.days.filter((d) => !d.isRestDay)) {
            const orders = day.exerciseSlots.map((s) => s.slotOrder);
            for (let i = 0; i < orders.length; i++) {
              expect(orders[i]).toBe(i + 1);
            }
          }
        });

        test('all slots have positive sets and rep ranges', () => {
          for (const day of program.days.filter((d) => !d.isRestDay)) {
            for (const slot of day.exerciseSlots) {
              expect(slot.sets).toBeGreaterThan(0);
              expect(slot.repRangeLow).toBeGreaterThan(0);
              expect(slot.repRangeHigh).toBeGreaterThanOrEqual(slot.repRangeLow);
              expect(slot.restSeconds).toBeGreaterThan(0);
            }
          }
        });

        test('equipment constraint is respected for all selected exercises', () => {
          const profile = makeProfile(bodyType, goal);
          for (const day of program.days.filter((d) => !d.isRestDay)) {
            for (const slot of day.exerciseSlots) {
              const ex = getExerciseById(slot.exerciseId)!;
              const hasEquipment = ex.equipment.some((eq) =>
                profile.availableEquipment.includes(eq),
              );
              expect(hasEquipment).toBe(true);
            }
          }
        });

        test('progression plan has a valid model', () => {
          expect(['LINEAR', 'DOUBLE_PROGRESSIVE', 'VOLUME_PROGRESSIVE']).toContain(
            program.progressionPlan.model,
          );
        });

        test('progression plan maps to correct model for goal', () => {
          const expectedModel: Record<Goal, string> = {
            STRENGTH: 'LINEAR',
            HYPERTROPHY: 'DOUBLE_PROGRESSIVE',
            FAT_LOSS: 'VOLUME_PROGRESSIVE',
          };
          expect(program.progressionPlan.model).toBe(expectedModel[goal]);
        });

        test('rep ranges match Stage 1 volume matrix', () => {
          const volumeMatrixRanges: Record<
            BodyType,
            Record<Goal, { low: number; high: number }>
          > = {
            ECTOMORPH: {
              STRENGTH: { low: 1, high: 5 },
              HYPERTROPHY: { low: 6, high: 10 },
              FAT_LOSS: { low: 10, high: 15 },
            },
            MESOMORPH: {
              STRENGTH: { low: 1, high: 5 },
              HYPERTROPHY: { low: 8, high: 12 },
              FAT_LOSS: { low: 12, high: 16 },
            },
            ENDOMORPH: {
              STRENGTH: { low: 3, high: 5 },
              HYPERTROPHY: { low: 10, high: 15 },
              FAT_LOSS: { low: 15, high: 20 },
            },
          };
          const expected = volumeMatrixRanges[bodyType][goal];
          for (const day of program.days.filter((d) => !d.isRestDay)) {
            for (const slot of day.exerciseSlots) {
              expect(slot.repRangeLow).toBe(expected.low);
              expect(slot.repRangeHigh).toBe(expected.high);
            }
          }
        });
      });
    }
  }

  // ─── Split type resolution ───────────────────────────────────────────────

  describe('split type resolution', () => {
    test.each([
      [2, 'FULL_BODY'],
      [3, 'FULL_BODY'],
      [4, 'UPPER_LOWER'],
      [5, 'PUSH_PULL_LEGS'],
      [6, 'PUSH_PULL_LEGS'],
    ])('%d days/week → %s', (days, expectedSplit) => {
      const program = generateWorkoutProgram(
        makeProfile('MESOMORPH', 'HYPERTROPHY', days),
      );
      expect(program.splitType).toBe(expectedSplit);
    });

    test('every program has exactly 7 days', () => {
      for (const days of ALL_DAYS_PER_WEEK) {
        const program = generateWorkoutProgram(
          makeProfile('MESOMORPH', 'HYPERTROPHY', days),
        );
        expect(program.days.length).toBe(7);
      }
    });
  });

  // ─── Equipment filtering edge cases ──────────────────────────────────────

  describe('equipment filtering', () => {
    test('bodyweight-only profile still generates a valid program', () => {
      const profile: UserProfile = {
        ...makeProfile('MESOMORPH', 'FAT_LOSS'),
        availableEquipment: ['BODYWEIGHT'],
      };
      const program = generateWorkoutProgram(profile);
      const activeDays = program.days.filter((d) => !d.isRestDay);
      expect(activeDays.length).toBeGreaterThan(0);

      for (const day of activeDays) {
        for (const slot of day.exerciseSlots) {
          const ex = getExerciseById(slot.exerciseId)!;
          const usesBodyweight = ex.equipment.includes('BODYWEIGHT');
          expect(usesBodyweight).toBe(true);
        }
      }
    });

    test('beginner profile excludes ADVANCED exercises', () => {
      const profile: UserProfile = {
        ...makeProfile('ECTOMORPH', 'HYPERTROPHY'),
        experienceLevel: 'BEGINNER',
      };
      const program = generateWorkoutProgram(profile);
      for (const day of program.days.filter((d) => !d.isRestDay)) {
        for (const slot of day.exerciseSlots) {
          const ex = getExerciseById(slot.exerciseId)!;
          expect(ex.difficulty).not.toBe('ADVANCED');
        }
      }
    });
  });

  // ─── Strength goal — compounds only ──────────────────────────────────────

  describe('Strength goal mechanics bias', () => {
    test('STRENGTH programs only include COMPOUND exercises', () => {
      const program = generateWorkoutProgram(
        makeProfile('MESOMORPH', 'STRENGTH'),
      );
      for (const day of program.days.filter((d) => !d.isRestDay)) {
        for (const slot of day.exerciseSlots) {
          const ex = getExerciseById(slot.exerciseId)!;
          expect(ex.mechanics).toBe('COMPOUND');
        }
      }
    });
  });

  // ─── Superset injection ───────────────────────────────────────────────────

  describe('injectSupersets', () => {
    test('pairs consecutive non-superset slots for FAT_LOSS', () => {
      const program = generateWorkoutProgram(makeProfile('ENDOMORPH', 'FAT_LOSS'));
      const activeDay = program.days.find((d) => !d.isRestDay)!;
      const injected = injectSupersets(activeDay, 'FAT_LOSS');
      const supersetSlots = injected.exerciseSlots.filter((s) => s.isSuperset);
      // At least some slots should be supersetted if there are ≥2 slots
      if (activeDay.exerciseSlots.length >= 2) {
        expect(supersetSlots.length).toBeGreaterThan(0);
      }
    });

    test('does not inject supersets for STRENGTH', () => {
      const program = generateWorkoutProgram(makeProfile('MESOMORPH', 'STRENGTH'));
      const activeDay = program.days.find((d) => !d.isRestDay)!;
      const injected = injectSupersets(activeDay, 'STRENGTH');
      const supersetSlots = injected.exerciseSlots.filter((s) => s.isSuperset);
      expect(supersetSlots.length).toBe(0);
    });

    test('superset partner IDs reference valid exercise ids', () => {
      const program = generateWorkoutProgram(makeProfile('ENDOMORPH', 'FAT_LOSS'));
      const activeDay = program.days.find((d) => !d.isRestDay)!;
      const injected = injectSupersets(activeDay, 'FAT_LOSS');
      for (const slot of injected.exerciseSlots.filter((s) => s.isSuperset)) {
        if (slot.supersetPartnerId) {
          const partner = getExerciseById(slot.supersetPartnerId);
          expect(partner).toBeDefined();
        }
      }
    });
  });
});
