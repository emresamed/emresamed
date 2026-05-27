# Mobile Fitness Application Architecture Blueprint

## Scope

This document is the Agent 1 architectural output for the mobile gym application. It defines domain rules, training algorithms, relational data relationships, and JSON schemas only. It intentionally contains no application source code.

## Domain Objectives

- Generate personalized weekly workout programs from:
  - Body type: `ectomorph`, `mesomorph`, `endomorph`
  - Goal: `strength`, `hypertrophy`, `fat_loss`, `endurance`
  - Available equipment
  - Muscle group priority and recovery state
- Map each exercise to:
  - Muscle group
  - Target zone
  - Movement pattern
  - Mechanics type
  - Required equipment
  - Difficulty
- Progress training through measurable overload while controlling fatigue.

## Core Enumerations

### Body Types

| Body Type | Primary Programming Bias | Recovery Bias | Volume Bias | Conditioning Bias |
| --- | --- | --- | --- | --- |
| `ectomorph` | Preserve calories, emphasize strength and hypertrophy quality | Moderate systemic recovery, lower tolerance for junk volume | Slightly lower total volume, higher rest | Low to moderate |
| `mesomorph` | Balanced strength, hypertrophy, and work capacity | Baseline recovery | Baseline volume | Moderate |
| `endomorph` | Higher training density, higher energy expenditure, joint-aware loading | Good local muscular tolerance, monitor systemic fatigue | Slightly higher volume or density | Moderate to high |

### Goals

| Goal | Primary Adaptation | Default Rep Zone | Default Intensity | Default Rest |
| --- | --- | --- | --- | --- |
| `strength` | Maximal force production | 1-6 reps | 80-95% 1RM or RPE 7.5-9.5 | 180-300 sec |
| `hypertrophy` | Muscle cross-sectional area | 6-15 reps | 60-85% 1RM or RPE 7-9 | 60-150 sec |
| `fat_loss` | Muscle retention plus energy expenditure | 8-20 reps | 55-80% 1RM or RPE 6.5-8.5 | 30-120 sec |
| `endurance` | Local muscular endurance and work capacity | 12-30 reps | 40-70% 1RM or RPE 6-8 | 30-90 sec |

## Training Prescription Rules

### Base Goal Prescriptions

The generator starts from the goal prescription, then applies body type and equipment modifiers.

| Goal | Compound Sets | Isolation Sets | Compound Reps | Isolation Reps | RPE Target | Percent 1RM | Rest Compound | Rest Isolation |
| --- | ---: | ---: | --- | --- | --- | --- | ---: | ---: |
| `strength` | 3-6 | 2-4 | 1-6 | 4-8 | 7.5-9.5 | 80-95 | 180-300 sec | 90-180 sec |
| `hypertrophy` | 3-5 | 2-4 | 6-10 | 10-15 | 7-9 | 60-85 | 90-150 sec | 60-120 sec |
| `fat_loss` | 2-4 | 2-4 | 8-12 | 12-20 | 6.5-8.5 | 55-80 | 45-120 sec | 30-90 sec |
| `endurance` | 2-4 | 2-3 | 12-20 | 15-30 | 6-8 | 40-70 | 45-90 sec | 30-75 sec |

### Weekly Hard Set Targets by Muscle Group

Hard sets are working sets performed at or above RPE 6 and within the programmed rep target.

| Goal | Chest | Back | Legs | Shoulders | Arms | Core |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `strength` | 8-12 | 10-14 | 10-16 | 6-10 | 4-8 | 4-8 |
| `hypertrophy` | 12-18 | 14-20 | 14-22 | 10-16 | 8-14 | 6-12 |
| `fat_loss` | 10-16 | 12-18 | 14-22 | 8-14 | 6-12 | 8-14 |
| `endurance` | 8-14 | 10-16 | 12-20 | 8-14 | 6-12 | 10-16 |

### Body Type Modifiers

Apply these after selecting the base goal prescription.

| Body Type | Weekly Volume Multiplier | Set Cap Per Session Per Muscle | Intensity Shift | Rest Shift | Density Rule |
| --- | ---: | ---: | --- | --- | --- |
| `ectomorph` | 0.90 | 8 hard sets | +0 to +2.5% 1RM when reps are met | +15-30 sec | Avoid excessive supersets; no more than 1 finisher per week |
| `mesomorph` | 1.00 | 10 hard sets | No shift | No shift | Standard straight sets and optional accessories |
| `endomorph` | 1.10 | 10 hard sets | -0 to -2.5% 1RM on high-volume days | -15-30 sec | Prefer paired accessories, short rests, and 1-3 finishers per week |

Volume should be rounded to the nearest whole set and constrained by minimum effective volume:

| Muscle Group | Minimum Weekly Hard Sets |
| --- | ---: |
| Chest | 8 |
| Back | 10 |
| Legs | 10 |
| Shoulders | 6 |
| Arms | 4 |
| Core | 4 |

### Goal and Body Type Combination Rules

| Body Type | Strength | Hypertrophy | Fat Loss | Endurance |
| --- | --- | --- | --- | --- |
| `ectomorph` | Keep accessory volume low; prioritize compound lifts, full recovery, and 2-4 minute rests | Use moderate volume, stable exercise selection, and avoid high cardio density | Preserve muscle with lower density circuits and controlled caloric expenditure | Use low-impact endurance blocks, avoid excessive weekly volume |
| `mesomorph` | Use standard periodized top sets plus back-off work | Use balanced compound/isolation distribution | Blend hypertrophy work with density finishers | Use mixed straight sets and circuits |
| `endomorph` | Use strength compounds first, then density accessories | Use moderate-high volume with shorter rests | Use high-density sessions, supersets, and extra lower-body/core work | Use circuits, carries, sleds, and high-rep accessories |

## Exercise Selection Logic

1. Filter exercises by available equipment.
2. Filter by movement safety and user difficulty level.
3. Select primary exercises for target muscle groups:
   - Strength: prioritize compound barbell, dumbbell, cable, or machine movements.
   - Hypertrophy: combine compounds with stable isolation work.
   - Fat loss: prioritize large muscle groups, unilateral work, loaded carries, and short-rest accessories.
   - Endurance: prioritize repeatable low-skill movements and machine/cable options when fatigue is high.
4. Enforce movement balance:
   - Horizontal push should be balanced with horizontal pull.
   - Vertical push should be balanced with vertical pull when shoulders are healthy.
   - Knee-dominant and hip-dominant leg work should both appear weekly.
   - Core should include anti-extension, anti-rotation, flexion, and carry/bracing patterns across the week.
5. Avoid redundant target zones in the same session unless a muscle is prioritized.

## Progression Algorithm

### Double Progression

Each exercise receives a rep range, target sets, and target RPE.

Progression rules:

1. If all sets reach the top of the rep range at or below target RPE, increase load next exposure.
2. If some sets are below the rep range but RPE is within target, keep load and add reps next exposure.
3. If RPE exceeds target by 1 or more and reps fall below range, reduce load by 2.5-7.5% next exposure.
4. If an exercise stalls for 3 consecutive exposures, rotate to a biomechanically similar alternative.

Default load increments:

| Exercise Class | Load Increment |
| --- | ---: |
| Upper-body compound | 2.5-5.0% |
| Lower-body compound | 2.5-7.5% |
| Isolation | 1.0-2.5% |
| Bodyweight | Add 1-3 reps before external load |

### Strength Top Set Plus Back-Off

For `strength` goals:

- Main lift:
  - 1 top set at RPE 8-9 within 1-5 reps.
  - 2-5 back-off sets at 85-92% of top-set load.
- Accessories:
  - RPE 7-8.
  - Higher rep range than the main lift.

### Hypertrophy Volume Progression

For `hypertrophy` goals:

- Start at the lower bound of weekly set targets.
- Add 1-2 hard sets per prioritized muscle group when:
  - Average session RPE is at or below 8.
  - Reps are stable or increasing.
  - Soreness does not impair the next same-muscle session.
- Deload when performance drops for 2 consecutive exposures or soreness persists beyond 72 hours.

### Fat Loss Density Progression

For `fat_loss` goals:

- Keep load stable while reducing rest by 5-10 seconds per week until the lower rest bound is reached.
- Then add reps or a set to accessories, not to heavy compounds.
- Preserve at least one moderate-heavy compound pattern per session to protect lean mass.

### Endurance Progression

For `endurance` goals:

- Increase total reps before load.
- Increase circuit rounds only when movement quality remains consistent.
- Cap most sets at RPE 8 to preserve repeatability.

## Deload Rules

Trigger a deload if any two conditions are true:

- Performance decreases by 5% or more across two exposures for the same lift.
- Session RPE exceeds target by 1.5 or more for two consecutive sessions.
- Resting soreness for a muscle group persists longer than 72 hours.
- User-reported readiness is 2 or lower on a 1-5 scale.
- Sleep is below 6 hours for 3 consecutive nights.

Deload prescription:

| Goal | Volume Reduction | Intensity Reduction | Duration |
| --- | ---: | ---: | --- |
| `strength` | 30-50% | 5-10% load | 1 week |
| `hypertrophy` | 35-50% | 0-5% load | 1 week |
| `fat_loss` | 25-40% | 0-5% load | 3-7 days |
| `endurance` | 25-40% | 0-10% load or rounds | 3-7 days |

## Relational Data Model

### Tables

#### `muscle_groups`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug, e.g. `chest` |
| `name` | string | Display name |
| `sort_order` | integer | UI ordering |

#### `target_zones`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug |
| `muscle_group_id` | string | FK to `muscle_groups.id` |
| `name` | string | Display name |
| `description` | string | Biomechanical region or emphasis |

#### `equipment`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug |
| `name` | string | Display name |
| `category` | string | `free_weight`, `machine`, `cable`, `bodyweight`, `cardio`, `accessory` |

#### `movement_types`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug |
| `name` | string | Display name |
| `plane` | string | `horizontal`, `vertical`, `sagittal`, `frontal`, `transverse`, `mixed` |
| `pattern` | string | `push`, `pull`, `squat`, `hinge`, `lunge`, `carry`, `rotation`, `anti_rotation`, `anti_extension`, `flexion` |

#### `exercises`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug |
| `name` | string | Display name |
| `primary_muscle_group_id` | string | FK to `muscle_groups.id` |
| `primary_target_zone_id` | string | FK to `target_zones.id` |
| `secondary_muscle_group_ids` | string[] | Secondary muscles |
| `mechanics` | string | `compound` or `isolation` |
| `movement_type_id` | string | FK to `movement_types.id` |
| `equipment_ids` | string[] | Required equipment |
| `difficulty` | string | `beginner`, `intermediate`, `advanced` |
| `unilateral` | boolean | True for single-limb movements |
| `contraindication_tags` | string[] | Optional filtering tags |

#### `program_templates`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug |
| `name` | string | Display name |
| `split_type` | string | `push_pull_legs`, `upper_lower`, `full_body` |
| `body_type` | string | Body type target |
| `days_per_week` | integer | Number of training days |
| `session_ids` | string[] | FK list to template sessions |

#### `program_template_sessions`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug |
| `template_id` | string | FK to `program_templates.id` |
| `day_index` | integer | 1-based order |
| `name` | string | Session name |
| `focus_muscle_group_ids` | string[] | Main session muscles |
| `exercise_slots` | object[] | Exercise selection rules and prescriptions |

## JSON Schema Contracts

The following schemas define the data shape expected from Agent 2 seed data.

### Exercise Seed Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.app/schemas/exercise-seed.schema.json",
  "title": "ExerciseSeed",
  "type": "object",
  "required": [
    "id",
    "name",
    "primaryMuscle",
    "primaryTargetZone",
    "secondaryMuscles",
    "mechanics",
    "movementType",
    "equipment",
    "difficulty"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "name": {
      "type": "string",
      "minLength": 1
    },
    "primaryMuscle": {
      "enum": ["chest", "back", "legs", "shoulders", "arms", "core"]
    },
    "primaryTargetZone": {
      "type": "string"
    },
    "secondaryMuscles": {
      "type": "array",
      "items": {
        "enum": ["chest", "back", "legs", "shoulders", "arms", "core"]
      },
      "uniqueItems": true
    },
    "mechanics": {
      "enum": ["compound", "isolation"]
    },
    "movementType": {
      "type": "string"
    },
    "equipment": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    },
    "difficulty": {
      "enum": ["beginner", "intermediate", "advanced"]
    },
    "unilateral": {
      "type": "boolean"
    },
    "contraindicationTags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    }
  },
  "additionalProperties": false
}
```

### Weekly Split Template Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.app/schemas/weekly-split-template.schema.json",
  "title": "WeeklySplitTemplate",
  "type": "object",
  "required": [
    "id",
    "name",
    "splitType",
    "bodyType",
    "daysPerWeek",
    "trainingDays"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "name": {
      "type": "string"
    },
    "splitType": {
      "enum": ["push_pull_legs", "upper_lower", "full_body"]
    },
    "bodyType": {
      "enum": ["ectomorph", "mesomorph", "endomorph"]
    },
    "daysPerWeek": {
      "type": "integer",
      "minimum": 2,
      "maximum": 6
    },
    "trainingDays": {
      "type": "array",
      "minItems": 2,
      "items": {
        "type": "object",
        "required": ["dayIndex", "name", "focus", "exerciseSlots"],
        "properties": {
          "dayIndex": {
            "type": "integer",
            "minimum": 1
          },
          "name": {
            "type": "string"
          },
          "focus": {
            "type": "array",
            "items": {
              "enum": ["chest", "back", "legs", "shoulders", "arms", "core"]
            },
            "uniqueItems": true
          },
          "exerciseSlots": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "slotId",
                "primaryMuscle",
                "targetZones",
                "mechanics",
                "movementType",
                "sets",
                "reps",
                "rpe",
                "restSeconds"
              ],
              "properties": {
                "slotId": {
                  "type": "string"
                },
                "primaryMuscle": {
                  "enum": ["chest", "back", "legs", "shoulders", "arms", "core"]
                },
                "targetZones": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "minItems": 1
                },
                "mechanics": {
                  "enum": ["compound", "isolation"]
                },
                "movementType": {
                  "type": "string"
                },
                "sets": {
                  "type": "object",
                  "required": ["min", "max"],
                  "properties": {
                    "min": { "type": "integer", "minimum": 1 },
                    "max": { "type": "integer", "minimum": 1 }
                  }
                },
                "reps": {
                  "type": "object",
                  "required": ["min", "max"],
                  "properties": {
                    "min": { "type": "integer", "minimum": 1 },
                    "max": { "type": "integer", "minimum": 1 }
                  }
                },
                "rpe": {
                  "type": "object",
                  "required": ["min", "max"],
                  "properties": {
                    "min": { "type": "number", "minimum": 1, "maximum": 10 },
                    "max": { "type": "number", "minimum": 1, "maximum": 10 }
                  }
                },
                "restSeconds": {
                  "type": "object",
                  "required": ["min", "max"],
                  "properties": {
                    "min": { "type": "integer", "minimum": 0 },
                    "max": { "type": "integer", "minimum": 0 }
                  }
                },
                "candidateExerciseIds": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "additionalProperties": false
            }
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

## Muscle Group to Target Zone Structure

```json
{
  "chest": {
    "targetZones": ["upper_chest", "mid_chest", "lower_chest", "inner_chest"],
    "primaryMovementTypes": ["horizontal_push", "incline_push", "decline_push", "fly"]
  },
  "back": {
    "targetZones": ["lats", "mid_back", "upper_back", "lower_back", "traps"],
    "primaryMovementTypes": ["vertical_pull", "horizontal_pull", "hip_hinge", "scapular_retraction"]
  },
  "legs": {
    "targetZones": ["quads", "hamstrings", "glutes", "calves", "adductors"],
    "primaryMovementTypes": ["squat", "hinge", "lunge", "leg_extension", "leg_curl", "calf_raise"]
  },
  "shoulders": {
    "targetZones": ["front_delts", "side_delts", "rear_delts", "rotator_cuff"],
    "primaryMovementTypes": ["vertical_push", "lateral_raise", "rear_delt_raise", "external_rotation"]
  },
  "arms": {
    "targetZones": ["biceps", "brachialis", "triceps_long_head", "triceps_lateral_medial", "forearms"],
    "primaryMovementTypes": ["elbow_flexion", "elbow_extension", "wrist_flexion_extension"]
  },
  "core": {
    "targetZones": ["rectus_abdominis", "obliques", "transverse_abdominis", "erectors"],
    "primaryMovementTypes": ["anti_extension", "anti_rotation", "rotation", "flexion", "carry"]
  }
}
```

