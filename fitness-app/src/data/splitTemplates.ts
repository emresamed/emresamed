import { SplitTemplate, SplitType } from '../types';

// Weekly day templates for each split type.
// Exercise selection within each day is resolved dynamically by the
// workout generator engine using the muscleGroupFocus array.

export const SPLIT_TEMPLATES: SplitTemplate[] = [
  // ─── FULL BODY — 2 or 3 days/week ─────────────────────────────────────
  {
    splitType: 'FULL_BODY',
    daysPerWeekMin: 2,
    daysPerWeekMax: 3,
    days: [
      {
        dayIndex: 1,
        label: 'Full Body A',
        isRestDay: false,
        muscleGroupFocus: ['CHEST', 'BACK', 'LEGS', 'CORE'],
      },
      {
        dayIndex: 2,
        label: 'Rest',
        isRestDay: true,
        muscleGroupFocus: [],
      },
      {
        dayIndex: 3,
        label: 'Full Body B',
        isRestDay: false,
        muscleGroupFocus: ['SHOULDERS', 'BACK', 'LEGS', 'ARMS'],
      },
      {
        dayIndex: 4,
        label: 'Rest',
        isRestDay: true,
        muscleGroupFocus: [],
      },
      {
        dayIndex: 5,
        label: 'Full Body C',
        isRestDay: false,
        muscleGroupFocus: ['CHEST', 'LEGS', 'SHOULDERS', 'CORE'],
      },
      {
        dayIndex: 6,
        label: 'Rest',
        isRestDay: true,
        muscleGroupFocus: [],
      },
      {
        dayIndex: 7,
        label: 'Rest',
        isRestDay: true,
        muscleGroupFocus: [],
      },
    ],
  },

  // ─── UPPER / LOWER — 4 days/week ──────────────────────────────────────
  {
    splitType: 'UPPER_LOWER',
    daysPerWeekMin: 4,
    daysPerWeekMax: 4,
    days: [
      {
        dayIndex: 1,
        label: 'Upper A',
        isRestDay: false,
        muscleGroupFocus: ['CHEST', 'BACK', 'SHOULDERS', 'ARMS'],
      },
      {
        dayIndex: 2,
        label: 'Lower A',
        isRestDay: false,
        muscleGroupFocus: ['LEGS', 'CORE'],
      },
      {
        dayIndex: 3,
        label: 'Rest',
        isRestDay: true,
        muscleGroupFocus: [],
      },
      {
        dayIndex: 4,
        label: 'Upper B',
        isRestDay: false,
        muscleGroupFocus: ['CHEST', 'BACK', 'SHOULDERS', 'ARMS'],
      },
      {
        dayIndex: 5,
        label: 'Lower B',
        isRestDay: false,
        muscleGroupFocus: ['LEGS', 'CORE'],
      },
      {
        dayIndex: 6,
        label: 'Rest',
        isRestDay: true,
        muscleGroupFocus: [],
      },
      {
        dayIndex: 7,
        label: 'Rest',
        isRestDay: true,
        muscleGroupFocus: [],
      },
    ],
  },

  // ─── PUSH / PULL / LEGS — 5 or 6 days/week ───────────────────────────
  {
    splitType: 'PUSH_PULL_LEGS',
    daysPerWeekMin: 5,
    daysPerWeekMax: 6,
    days: [
      {
        dayIndex: 1,
        label: 'Push A',
        isRestDay: false,
        muscleGroupFocus: ['CHEST', 'SHOULDERS', 'ARMS'],
      },
      {
        dayIndex: 2,
        label: 'Pull A',
        isRestDay: false,
        muscleGroupFocus: ['BACK', 'ARMS'],
      },
      {
        dayIndex: 3,
        label: 'Legs A',
        isRestDay: false,
        muscleGroupFocus: ['LEGS', 'CORE'],
      },
      {
        dayIndex: 4,
        label: 'Push B',
        isRestDay: false,
        muscleGroupFocus: ['CHEST', 'SHOULDERS', 'ARMS'],
      },
      {
        dayIndex: 5,
        label: 'Pull B',
        isRestDay: false,
        muscleGroupFocus: ['BACK', 'ARMS'],
      },
      {
        dayIndex: 6,
        label: 'Legs B',
        isRestDay: false,
        muscleGroupFocus: ['LEGS', 'CORE'],
      },
      {
        dayIndex: 7,
        label: 'Rest',
        isRestDay: true,
        muscleGroupFocus: [],
      },
    ],
  },
];

export const resolveSplitType = (daysPerWeek: number): SplitType => {
  if (daysPerWeek <= 3) return 'FULL_BODY';
  if (daysPerWeek === 4) return 'UPPER_LOWER';
  return 'PUSH_PULL_LEGS';
};

export const getSplitTemplate = (splitType: SplitType): SplitTemplate => {
  const template = SPLIT_TEMPLATES.find((t) => t.splitType === splitType);
  if (!template) {
    throw new Error(`No split template found for ${splitType}`);
  }
  return template;
};
