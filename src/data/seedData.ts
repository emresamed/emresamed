import { SeedData } from "../domain/types";

export const seedData: SeedData = {
  seedVersion: "v1.0.0",
  exerciseSeed: [
    { id: "ex001", name: "Barbell Bench Press", primaryMuscle: "chest", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "mid_chest" },
    { id: "ex002", name: "Incline Barbell Bench Press", primaryMuscle: "chest", secondaryMuscle: "shoulders", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "upper_chest" },
    { id: "ex003", name: "Decline Barbell Bench Press", primaryMuscle: "chest", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "lower_chest" },
    { id: "ex004", name: "Flat Dumbbell Press", primaryMuscle: "chest", secondaryMuscle: "shoulders", movementType: "compound", equipmentRequired: ["dumbbell"], difficulty: "beginner", targetZone: "mid_chest" },
    { id: "ex005", name: "Incline Dumbbell Press", primaryMuscle: "chest", secondaryMuscle: "shoulders", movementType: "compound", equipmentRequired: ["dumbbell"], difficulty: "beginner", targetZone: "upper_chest" },
    { id: "ex006", name: "Chest Dips", primaryMuscle: "chest", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["bodyweight"], difficulty: "advanced", targetZone: "lower_chest" },
    { id: "ex007", name: "Cable Chest Fly", primaryMuscle: "chest", secondaryMuscle: "shoulders", movementType: "isolation", equipmentRequired: ["cable"], difficulty: "beginner", targetZone: "mid_chest" },
    { id: "ex008", name: "Pec Deck Fly", primaryMuscle: "chest", secondaryMuscle: "shoulders", movementType: "isolation", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "mid_chest" },
    { id: "ex009", name: "Push-Up", primaryMuscle: "chest", secondaryMuscle: "core", movementType: "compound", equipmentRequired: ["bodyweight"], difficulty: "beginner", targetZone: "mid_chest" },
    { id: "ex010", name: "Incline Cable Fly", primaryMuscle: "chest", secondaryMuscle: "shoulders", movementType: "isolation", equipmentRequired: ["cable"], difficulty: "intermediate", targetZone: "upper_chest" },
    { id: "ex011", name: "Conventional Deadlift", primaryMuscle: "back", secondaryMuscle: "legs", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "advanced", targetZone: "spinal_erectors" },
    { id: "ex012", name: "Barbell Bent-Over Row", primaryMuscle: "back", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "mid_back" },
    { id: "ex013", name: "Pull-Up", primaryMuscle: "back", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["bodyweight"], difficulty: "intermediate", targetZone: "lats" },
    { id: "ex014", name: "Lat Pulldown", primaryMuscle: "back", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["cable"], difficulty: "beginner", targetZone: "lats" },
    { id: "ex015", name: "Seated Cable Row", primaryMuscle: "back", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["cable"], difficulty: "beginner", targetZone: "mid_back" },
    { id: "ex016", name: "Chest-Supported Row Machine", primaryMuscle: "back", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "upper_back" },
    { id: "ex017", name: "Single-Arm Dumbbell Row", primaryMuscle: "back", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["dumbbell"], difficulty: "beginner", targetZone: "lats" },
    { id: "ex018", name: "Straight-Arm Pulldown", primaryMuscle: "back", secondaryMuscle: "core", movementType: "isolation", equipmentRequired: ["cable"], difficulty: "intermediate", targetZone: "lats" },
    { id: "ex019", name: "Face Pull", primaryMuscle: "back", secondaryMuscle: "shoulders", movementType: "isolation", equipmentRequired: ["cable"], difficulty: "beginner", targetZone: "upper_back" },
    { id: "ex020", name: "T-Bar Row", primaryMuscle: "back", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "mid_back" },
    { id: "ex021", name: "Back Squat", primaryMuscle: "legs", secondaryMuscle: "core", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "quads" },
    { id: "ex022", name: "Front Squat", primaryMuscle: "legs", secondaryMuscle: "core", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "advanced", targetZone: "quads" },
    { id: "ex023", name: "Leg Press", primaryMuscle: "legs", secondaryMuscle: "glutes", movementType: "compound", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "quads" },
    { id: "ex024", name: "Romanian Deadlift", primaryMuscle: "legs", secondaryMuscle: "back", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "hamstrings" },
    { id: "ex025", name: "Walking Lunge", primaryMuscle: "legs", secondaryMuscle: "glutes", movementType: "compound", equipmentRequired: ["dumbbell"], difficulty: "intermediate", targetZone: "quads" },
    { id: "ex026", name: "Bulgarian Split Squat", primaryMuscle: "legs", secondaryMuscle: "glutes", movementType: "compound", equipmentRequired: ["dumbbell"], difficulty: "intermediate", targetZone: "quads" },
    { id: "ex027", name: "Leg Extension", primaryMuscle: "legs", secondaryMuscle: "core", movementType: "isolation", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "quads" },
    { id: "ex028", name: "Lying Leg Curl", primaryMuscle: "legs", secondaryMuscle: "glutes", movementType: "isolation", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "hamstrings" },
    { id: "ex029", name: "Seated Leg Curl", primaryMuscle: "legs", secondaryMuscle: "glutes", movementType: "isolation", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "hamstrings" },
    { id: "ex030", name: "Standing Calf Raise", primaryMuscle: "legs", secondaryMuscle: "core", movementType: "isolation", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "calves" },
    { id: "ex031", name: "Seated Calf Raise", primaryMuscle: "legs", secondaryMuscle: "core", movementType: "isolation", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "calves" },
    { id: "ex032", name: "Barbell Hip Thrust", primaryMuscle: "legs", secondaryMuscle: "core", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "glutes" },
    { id: "ex033", name: "Goblet Squat", primaryMuscle: "legs", secondaryMuscle: "core", movementType: "compound", equipmentRequired: ["dumbbell"], difficulty: "beginner", targetZone: "quads" },
    { id: "ex034", name: "Glute Bridge", primaryMuscle: "legs", secondaryMuscle: "core", movementType: "isolation", equipmentRequired: ["bodyweight"], difficulty: "beginner", targetZone: "glutes" },
    { id: "ex035", name: "Barbell Overhead Press", primaryMuscle: "shoulders", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "anterior_delts" },
    { id: "ex036", name: "Seated Dumbbell Shoulder Press", primaryMuscle: "shoulders", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["dumbbell"], difficulty: "beginner", targetZone: "anterior_delts" },
    { id: "ex037", name: "Arnold Press", primaryMuscle: "shoulders", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["dumbbell"], difficulty: "intermediate", targetZone: "anterior_delts" },
    { id: "ex038", name: "Dumbbell Lateral Raise", primaryMuscle: "shoulders", secondaryMuscle: "arms", movementType: "isolation", equipmentRequired: ["dumbbell"], difficulty: "beginner", targetZone: "lateral_delts" },
    { id: "ex039", name: "Cable Lateral Raise", primaryMuscle: "shoulders", secondaryMuscle: "core", movementType: "isolation", equipmentRequired: ["cable"], difficulty: "intermediate", targetZone: "lateral_delts" },
    { id: "ex040", name: "Rear Delt Fly", primaryMuscle: "shoulders", secondaryMuscle: "back", movementType: "isolation", equipmentRequired: ["dumbbell"], difficulty: "beginner", targetZone: "rear_delts" },
    { id: "ex041", name: "Upright Row", primaryMuscle: "shoulders", secondaryMuscle: "back", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "lateral_delts" },
    { id: "ex042", name: "Machine Shoulder Press", primaryMuscle: "shoulders", secondaryMuscle: "arms", movementType: "compound", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "anterior_delts" },
    { id: "ex043", name: "Barbell Curl", primaryMuscle: "arms", secondaryMuscle: "forearms", movementType: "isolation", equipmentRequired: ["barbell"], difficulty: "beginner", targetZone: "biceps" },
    { id: "ex044", name: "Hammer Curl", primaryMuscle: "arms", secondaryMuscle: "forearms", movementType: "isolation", equipmentRequired: ["dumbbell"], difficulty: "beginner", targetZone: "biceps" },
    { id: "ex045", name: "Preacher Curl", primaryMuscle: "arms", secondaryMuscle: "forearms", movementType: "isolation", equipmentRequired: ["machine"], difficulty: "beginner", targetZone: "biceps" },
    { id: "ex046", name: "Cable Curl", primaryMuscle: "arms", secondaryMuscle: "forearms", movementType: "isolation", equipmentRequired: ["cable"], difficulty: "beginner", targetZone: "biceps" },
    { id: "ex047", name: "Close-Grip Bench Press", primaryMuscle: "arms", secondaryMuscle: "chest", movementType: "compound", equipmentRequired: ["barbell"], difficulty: "intermediate", targetZone: "triceps" },
    { id: "ex048", name: "Bench Dips", primaryMuscle: "arms", secondaryMuscle: "shoulders", movementType: "compound", equipmentRequired: ["bodyweight"], difficulty: "beginner", targetZone: "triceps" },
    { id: "ex049", name: "Rope Triceps Pushdown", primaryMuscle: "arms", secondaryMuscle: "shoulders", movementType: "isolation", equipmentRequired: ["cable"], difficulty: "beginner", targetZone: "triceps" },
    { id: "ex050", name: "Overhead Dumbbell Triceps Extension", primaryMuscle: "arms", secondaryMuscle: "core", movementType: "isolation", equipmentRequired: ["dumbbell"], difficulty: "beginner", targetZone: "triceps" },
    { id: "ex051", name: "Plank", primaryMuscle: "core", secondaryMuscle: "shoulders", movementType: "isolation", equipmentRequired: ["bodyweight"], difficulty: "beginner", targetZone: "anterior_core" },
    { id: "ex052", name: "Hanging Leg Raise", primaryMuscle: "core", secondaryMuscle: "arms", movementType: "isolation", equipmentRequired: ["bodyweight"], difficulty: "intermediate", targetZone: "lower_abs" },
    { id: "ex053", name: "Cable Crunch", primaryMuscle: "core", secondaryMuscle: "hips", movementType: "isolation", equipmentRequired: ["cable"], difficulty: "beginner", targetZone: "upper_abs" },
    { id: "ex054", name: "Ab Wheel Rollout", primaryMuscle: "core", secondaryMuscle: "shoulders", movementType: "compound", equipmentRequired: ["bodyweight"], difficulty: "intermediate", targetZone: "anterior_core" },
    { id: "ex055", name: "Russian Twist", primaryMuscle: "core", secondaryMuscle: "arms", movementType: "isolation", equipmentRequired: ["bodyweight"], difficulty: "beginner", targetZone: "obliques" },
    { id: "ex056", name: "Pallof Press", primaryMuscle: "core", secondaryMuscle: "shoulders", movementType: "isolation", equipmentRequired: ["cable", "band"], difficulty: "beginner", targetZone: "obliques" }
  ],
  splitTemplates: [
    {
      id: "split_push_pull_legs",
      name: "push_pull_legs",
      daysPerWeekMin: 5,
      daysPerWeekMax: 6,
      adaptations: {
        ectomorph: {
          daysPerWeek: 5,
          volumeMultiplier: 1.1,
          intensityPct1RMRange: [65, 82],
          restMultiplier: 1.1,
          compoundIsolationRatio: [0.7, 0.3],
          weekLayout: [
            { dayIndex: 1, focusLabel: "push_a", targetMuscles: ["chest", "shoulders", "arms"] },
            { dayIndex: 2, focusLabel: "pull_a", targetMuscles: ["back", "arms", "core"] },
            { dayIndex: 3, focusLabel: "legs_a", targetMuscles: ["legs", "core"] },
            { dayIndex: 4, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 5, focusLabel: "push_b", targetMuscles: ["chest", "shoulders", "arms"] },
            { dayIndex: 6, focusLabel: "pull_b", targetMuscles: ["back", "arms", "core"] },
            { dayIndex: 7, focusLabel: "rest", targetMuscles: [] }
          ]
        },
        mesomorph: {
          daysPerWeek: 6,
          volumeMultiplier: 1,
          intensityPct1RMRange: [68, 88],
          restMultiplier: 1,
          compoundIsolationRatio: [0.65, 0.35],
          weekLayout: [
            { dayIndex: 1, focusLabel: "push_a", targetMuscles: ["chest", "shoulders", "arms"] },
            { dayIndex: 2, focusLabel: "pull_a", targetMuscles: ["back", "arms", "core"] },
            { dayIndex: 3, focusLabel: "legs_a", targetMuscles: ["legs", "core"] },
            { dayIndex: 4, focusLabel: "push_b", targetMuscles: ["chest", "shoulders", "arms"] },
            { dayIndex: 5, focusLabel: "pull_b", targetMuscles: ["back", "arms", "core"] },
            { dayIndex: 6, focusLabel: "legs_b", targetMuscles: ["legs", "core"] },
            { dayIndex: 7, focusLabel: "rest", targetMuscles: [] }
          ]
        },
        endomorph: {
          daysPerWeek: 6,
          volumeMultiplier: 0.95,
          intensityPct1RMRange: [62, 82],
          restMultiplier: 0.9,
          compoundIsolationRatio: [0.55, 0.45],
          weekLayout: [
            { dayIndex: 1, focusLabel: "push_a", targetMuscles: ["chest", "shoulders", "arms"] },
            { dayIndex: 2, focusLabel: "pull_a", targetMuscles: ["back", "arms", "core"] },
            { dayIndex: 3, focusLabel: "legs_a", targetMuscles: ["legs", "core"] },
            { dayIndex: 4, focusLabel: "push_b", targetMuscles: ["chest", "shoulders", "arms"] },
            { dayIndex: 5, focusLabel: "pull_b", targetMuscles: ["back", "arms", "core"] },
            { dayIndex: 6, focusLabel: "legs_b_metabolic", targetMuscles: ["legs", "core"] },
            { dayIndex: 7, focusLabel: "rest", targetMuscles: [] }
          ]
        }
      }
    },
    {
      id: "split_upper_lower",
      name: "upper_lower",
      daysPerWeekMin: 4,
      daysPerWeekMax: 5,
      adaptations: {
        ectomorph: {
          daysPerWeek: 4,
          volumeMultiplier: 1.1,
          intensityPct1RMRange: [67, 85],
          restMultiplier: 1.1,
          compoundIsolationRatio: [0.7, 0.3],
          weekLayout: [
            { dayIndex: 1, focusLabel: "upper_a", targetMuscles: ["chest", "back", "shoulders", "arms"] },
            { dayIndex: 2, focusLabel: "lower_a", targetMuscles: ["legs", "core"] },
            { dayIndex: 3, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 4, focusLabel: "upper_b", targetMuscles: ["chest", "back", "shoulders", "arms"] },
            { dayIndex: 5, focusLabel: "lower_b", targetMuscles: ["legs", "core"] },
            { dayIndex: 6, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 7, focusLabel: "rest", targetMuscles: [] }
          ]
        },
        mesomorph: {
          daysPerWeek: 5,
          volumeMultiplier: 1,
          intensityPct1RMRange: [70, 90],
          restMultiplier: 1,
          compoundIsolationRatio: [0.65, 0.35],
          weekLayout: [
            { dayIndex: 1, focusLabel: "upper_a", targetMuscles: ["chest", "back", "shoulders", "arms"] },
            { dayIndex: 2, focusLabel: "lower_a", targetMuscles: ["legs", "core"] },
            { dayIndex: 3, focusLabel: "upper_b", targetMuscles: ["chest", "back", "shoulders", "arms"] },
            { dayIndex: 4, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 5, focusLabel: "lower_b", targetMuscles: ["legs", "core"] },
            { dayIndex: 6, focusLabel: "upper_c", targetMuscles: ["back", "shoulders", "arms"] },
            { dayIndex: 7, focusLabel: "rest", targetMuscles: [] }
          ]
        },
        endomorph: {
          daysPerWeek: 5,
          volumeMultiplier: 0.95,
          intensityPct1RMRange: [62, 82],
          restMultiplier: 0.9,
          compoundIsolationRatio: [0.55, 0.45],
          weekLayout: [
            { dayIndex: 1, focusLabel: "upper_a_metabolic", targetMuscles: ["chest", "back", "shoulders", "arms"] },
            { dayIndex: 2, focusLabel: "lower_a_metabolic", targetMuscles: ["legs", "core"] },
            { dayIndex: 3, focusLabel: "upper_b", targetMuscles: ["chest", "back", "shoulders", "arms"] },
            { dayIndex: 4, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 5, focusLabel: "lower_b", targetMuscles: ["legs", "core"] },
            { dayIndex: 6, focusLabel: "conditioning_core", targetMuscles: ["core", "legs"] },
            { dayIndex: 7, focusLabel: "rest", targetMuscles: [] }
          ]
        }
      }
    },
    {
      id: "split_full_body",
      name: "full_body",
      daysPerWeekMin: 3,
      daysPerWeekMax: 4,
      adaptations: {
        ectomorph: {
          daysPerWeek: 3,
          volumeMultiplier: 1.1,
          intensityPct1RMRange: [68, 85],
          restMultiplier: 1.1,
          compoundIsolationRatio: [0.75, 0.25],
          weekLayout: [
            { dayIndex: 1, focusLabel: "full_body_a", targetMuscles: ["chest", "back", "legs", "core"] },
            { dayIndex: 2, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 3, focusLabel: "full_body_b", targetMuscles: ["shoulders", "back", "legs", "arms"] },
            { dayIndex: 4, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 5, focusLabel: "full_body_c", targetMuscles: ["chest", "legs", "arms", "core"] },
            { dayIndex: 6, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 7, focusLabel: "rest", targetMuscles: [] }
          ]
        },
        mesomorph: {
          daysPerWeek: 4,
          volumeMultiplier: 1,
          intensityPct1RMRange: [70, 88],
          restMultiplier: 1,
          compoundIsolationRatio: [0.65, 0.35],
          weekLayout: [
            { dayIndex: 1, focusLabel: "full_body_a", targetMuscles: ["chest", "back", "legs", "core"] },
            { dayIndex: 2, focusLabel: "full_body_b", targetMuscles: ["shoulders", "back", "legs", "arms"] },
            { dayIndex: 3, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 4, focusLabel: "full_body_c", targetMuscles: ["chest", "legs", "arms", "core"] },
            { dayIndex: 5, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 6, focusLabel: "full_body_d", targetMuscles: ["back", "shoulders", "legs", "core"] },
            { dayIndex: 7, focusLabel: "rest", targetMuscles: [] }
          ]
        },
        endomorph: {
          daysPerWeek: 4,
          volumeMultiplier: 0.95,
          intensityPct1RMRange: [60, 80],
          restMultiplier: 0.9,
          compoundIsolationRatio: [0.55, 0.45],
          weekLayout: [
            { dayIndex: 1, focusLabel: "full_body_a_metabolic", targetMuscles: ["chest", "back", "legs", "core"] },
            { dayIndex: 2, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 3, focusLabel: "full_body_b_metabolic", targetMuscles: ["shoulders", "back", "legs", "arms"] },
            { dayIndex: 4, focusLabel: "rest", targetMuscles: [] },
            { dayIndex: 5, focusLabel: "full_body_c", targetMuscles: ["chest", "legs", "arms", "core"] },
            { dayIndex: 6, focusLabel: "conditioning_core", targetMuscles: ["core", "legs"] },
            { dayIndex: 7, focusLabel: "rest", targetMuscles: [] }
          ]
        }
      }
    }
  ]
};
