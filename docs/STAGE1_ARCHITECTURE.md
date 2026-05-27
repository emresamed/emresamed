# STAGE 1 — System Architecture & Biomechanics Blueprint

**Role:** Lead Software Architect & Elite Sports Scientist  
**Output:** Algorithmic rule sets, relational schemas, and JSON structures — no application source code.

---

## 1. CORE DOMAIN MODEL (Conceptual Entities)

```
User ──────────────────────┐
  ├─ BodyType               │
  ├─ PrimaryGoal            │
  ├─ AvailableEquipment[]   │
  └─ TrainingDaysPerWeek    │
                            ▼
            WorkoutProgram (generated)
                  │
          ┌───────┴──────────┐
          ▼                  ▼
     WorkoutDay          ProgressionPlan
          │
     ExerciseSlot[]
          │
     Exercise ────────── MuscleGroup
          │                   │
     Equipment            TargetZone
```

---

## 2. BODY TYPE CLASSIFICATION RULES

### 2.1 Ectomorph
| Attribute          | Value                              |
|--------------------|------------------------------------|
| Metabolism         | Fast — high caloric burn           |
| Muscle Gain Rate   | Low (responds slowly to volume)    |
| Recovery Speed     | Moderate                           |
| Training Frequency | 3–4 days/week (avoid overtraining) |
| Volume Tolerance   | Low-to-Moderate                    |
| Rep Range Bias     | Moderate-heavy (6–10 reps)         |
| Rest Period Bias   | Long (90–180 s) — CNS recovery     |
| Cardio             | Minimal; steady-state only         |

### 2.2 Mesomorph
| Attribute          | Value                              |
|--------------------|------------------------------------|
| Metabolism         | Moderate — balanced                |
| Muscle Gain Rate   | High — responds to any stimulus    |
| Recovery Speed     | Fast                               |
| Training Frequency | 4–5 days/week                      |
| Volume Tolerance   | High                               |
| Rep Range Bias     | All ranges viable                  |
| Rest Period Bias   | Moderate (60–120 s)                |
| Cardio             | Moderate HIIT or steady-state      |

### 2.3 Endomorph
| Attribute          | Value                              |
|--------------------|------------------------------------|
| Metabolism         | Slow — prone to fat storage        |
| Muscle Gain Rate   | Moderate                           |
| Recovery Speed     | Slow                               |
| Training Frequency | 4–6 days/week                      |
| Volume Tolerance   | High — metabolic demand            |
| Rep Range Bias     | Higher (12–20 reps)                |
| Rest Period Bias   | Short (30–60 s) — metabolic stress |
| Cardio             | High — HIIT preferred              |

---

## 3. GOAL-BASED TRAINING PARAMETER RULES

### 3.1 Strength
| Parameter       | Value                    |
|-----------------|--------------------------|
| Rep Range       | 1–5                      |
| Intensity (%1RM)| 85–100%                  |
| RPE Target      | 8–10                     |
| Sets per exercise | 4–6                    |
| Rest Period     | 180–300 s                |
| Mechanic Bias   | Compound movements only  |
| Progression     | Linear (+2.5–5 kg/week)  |
| Weekly Frequency| 3–4 sessions             |

### 3.2 Hypertrophy
| Parameter       | Value                        |
|-----------------|------------------------------|
| Rep Range       | 6–12                         |
| Intensity (%1RM)| 65–85%                       |
| RPE Target      | 7–9                          |
| Sets per exercise | 3–5                        |
| Rest Period     | 60–120 s                     |
| Mechanic Bias   | Compound + Isolation (70/30) |
| Progression     | Double-progressive (reps then load) |
| Weekly Frequency| 4–5 sessions                 |

### 3.3 Endurance / Fat Loss
| Parameter       | Value                           |
|-----------------|---------------------------------|
| Rep Range       | 12–20+                          |
| Intensity (%1RM)| 50–65%                          |
| RPE Target      | 6–8                             |
| Sets per exercise | 3–4                           |
| Rest Period     | 30–60 s                         |
| Mechanic Bias   | Compound + Supersets allowed    |
| Progression     | Volume progressive (add reps/sets) |
| Weekly Frequency| 4–6 sessions                    |

---

## 4. VOLUME MATRIX — Body Type × Goal

The matrix defines `{ sets, repRangeLow, repRangeHigh, restSeconds, rpeTarget, intensityPct1RM }` per combination.

| Body Type   | Goal          | Sets | Reps    | Rest (s) | RPE | %1RM   |
|-------------|---------------|------|---------|----------|-----|--------|
| Ectomorph   | Strength      | 4    | 1–5     | 240      | 9   | 90–100 |
| Ectomorph   | Hypertrophy   | 3    | 6–10    | 120      | 8   | 70–80  |
| Ectomorph   | Fat Loss      | 3    | 10–15   | 60       | 7   | 55–65  |
| Mesomorph   | Strength      | 5    | 1–5     | 210      | 9   | 87–100 |
| Mesomorph   | Hypertrophy   | 4    | 8–12    | 90       | 8   | 67–82  |
| Mesomorph   | Fat Loss      | 4    | 12–16   | 45       | 7   | 52–65  |
| Endomorph   | Strength      | 4    | 3–5     | 180      | 8   | 85–95  |
| Endomorph   | Hypertrophy   | 4    | 10–15   | 75       | 8   | 65–78  |
| Endomorph   | Fat Loss      | 4    | 15–20   | 30       | 7   | 50–62  |

---

## 5. PROGRESSION ALGORITHM RULES

### 5.1 Double-Progressive Model (Primary — Hypertrophy)
```
IF current_reps >= repRangeHigh FOR all sets THEN
    increase_load_by = 2.5 kg (upper body) | 5.0 kg (lower body)
    reset_reps_to = repRangeLow
ELSE
    attempt to add 1 rep per set each session
```

### 5.2 Linear Progression Model (Strength)
```
IF RPE <= 8 for all working sets THEN
    increase_load_by = 2.5–5.0 kg next session
ELSE IF RPE = 9 THEN
    maintain load, same sets/reps
ELSE IF RPE = 10 OR failed reps THEN
    deload: reduce load by 10%, reset
```

### 5.3 Volume Progressive Model (Fat Loss / Endurance)
```
Week 1–3: Add 1 rep per set per session until repRangeHigh
Week 4:   Add 1 set per exercise
Week 5–6: Reduce rest by 5 s (floor = 30 s)
Week 7+:  Increase load by 2.5 kg, reset reps to repRangeLow
```

### 5.4 Deload Protocol
```
Every 4th week OR IF weekly_fatigue_score > threshold:
    reduce_volume_by = 40%
    reduce_intensity_by = 20%
    maintain_frequency = true
```

---

## 6. MUSCLE GROUP → TARGET ZONE → MOVEMENT SCHEMA

```
MuscleGroup
    ├── id: string          (e.g. "CHEST")
    ├── name: string
    ├── targetZones: TargetZone[]
    │       ├── id: string  (e.g. "UPPER_CHEST")
    │       ├── name: string
    │       └── anatomicalNote: string
    └── weeklyVolumeRecommendation: VolumeRange
            ├── minSets: number
            └── maxSets: number
```

**Defined Muscle Groups & Target Zones:**

| Muscle Group | Target Zones                                    | Min Sets/Week | Max Sets/Week |
|--------------|-------------------------------------------------|---------------|---------------|
| Chest        | Upper Chest, Mid Chest, Lower Chest             | 10            | 20            |
| Back         | Upper Back, Mid Back (Lats), Lower Back (Erectors) | 10         | 22            |
| Legs         | Quads, Hamstrings, Glutes, Calves               | 12            | 24            |
| Shoulders    | Anterior Delt, Lateral Delt, Posterior Delt     | 8             | 16            |
| Arms         | Biceps, Triceps, Forearms                       | 6             | 16            |
| Core         | Upper Abs, Lower Abs, Obliques, TVA             | 6             | 14            |

---

## 7. EXERCISE ENTITY — JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Exercise",
  "type": "object",
  "required": [
    "id", "name", "primaryMuscle", "secondaryMuscles",
    "mechanics", "equipment", "difficulty",
    "targetZone", "movementPattern"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique slug, e.g. 'barbell-bench-press'"
    },
    "name": { "type": "string" },
    "primaryMuscle": {
      "type": "string",
      "enum": ["CHEST","BACK","LEGS","SHOULDERS","ARMS","CORE"]
    },
    "secondaryMuscles": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["CHEST","BACK","LEGS","SHOULDERS","ARMS","CORE"]
      }
    },
    "mechanics": {
      "type": "string",
      "enum": ["COMPOUND","ISOLATION"]
    },
    "equipment": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "BARBELL","DUMBBELL","CABLE","MACHINE",
          "BODYWEIGHT","KETTLEBELL","RESISTANCE_BAND","PULL_UP_BAR"
        ]
      }
    },
    "difficulty": {
      "type": "string",
      "enum": ["BEGINNER","INTERMEDIATE","ADVANCED"]
    },
    "targetZone": {
      "type": "string",
      "description": "Sub-region of the primary muscle, e.g. 'UPPER_CHEST'"
    },
    "movementPattern": {
      "type": "string",
      "enum": [
        "HORIZONTAL_PUSH","HORIZONTAL_PULL",
        "VERTICAL_PUSH","VERTICAL_PULL",
        "HIP_HINGE","SQUAT","LUNGE",
        "ROTATION","CARRY","ISOLATION_CURL",
        "ISOLATION_EXTENSION","ISOLATION_FLY","CORE_STABILIZATION"
      ]
    },
    "unilateral": { "type": "boolean" },
    "videoRef": {
      "type": "string",
      "description": "Reference key for exercise demonstration asset"
    }
  }
}
```

---

## 8. USER PROFILE — JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "UserProfile",
  "type": "object",
  "required": [
    "id", "bodyType", "primaryGoal",
    "availableEquipment", "trainingDaysPerWeek",
    "experienceLevel", "createdAt"
  ],
  "properties": {
    "id": { "type": "string" },
    "bodyType": {
      "type": "string",
      "enum": ["ECTOMORPH","MESOMORPH","ENDOMORPH"]
    },
    "primaryGoal": {
      "type": "string",
      "enum": ["STRENGTH","HYPERTROPHY","FAT_LOSS"]
    },
    "availableEquipment": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "BARBELL","DUMBBELL","CABLE","MACHINE",
          "BODYWEIGHT","KETTLEBELL","RESISTANCE_BAND","PULL_UP_BAR"
        ]
      },
      "minItems": 1
    },
    "trainingDaysPerWeek": {
      "type": "integer",
      "minimum": 2,
      "maximum": 6
    },
    "experienceLevel": {
      "type": "string",
      "enum": ["BEGINNER","INTERMEDIATE","ADVANCED"]
    },
    "bodyMetrics": {
      "type": "object",
      "properties": {
        "weightKg": { "type": "number" },
        "heightCm": { "type": "number" },
        "ageYears": { "type": "integer" },
        "biologicalSex": { "type": "string", "enum": ["MALE","FEMALE","OTHER"] }
      }
    },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  }
}
```

---

## 9. VOLUME PRESCRIPTION — JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "VolumePrescription",
  "type": "object",
  "required": [
    "bodyType","goal","sets",
    "repRangeLow","repRangeHigh",
    "restSeconds","rpeTarget","intensityPctMin","intensityPctMax"
  ],
  "properties": {
    "bodyType": {
      "type": "string",
      "enum": ["ECTOMORPH","MESOMORPH","ENDOMORPH"]
    },
    "goal": {
      "type": "string",
      "enum": ["STRENGTH","HYPERTROPHY","FAT_LOSS"]
    },
    "sets": { "type": "integer", "minimum": 1 },
    "repRangeLow": { "type": "integer", "minimum": 1 },
    "repRangeHigh": { "type": "integer", "minimum": 1 },
    "restSeconds": { "type": "integer", "minimum": 20 },
    "rpeTarget": { "type": "number", "minimum": 1, "maximum": 10 },
    "intensityPctMin": { "type": "number", "minimum": 0, "maximum": 100 },
    "intensityPctMax": { "type": "number", "minimum": 0, "maximum": 100 },
    "progressionModel": {
      "type": "string",
      "enum": ["LINEAR","DOUBLE_PROGRESSIVE","VOLUME_PROGRESSIVE"]
    }
  }
}
```

---

## 10. WORKOUT PROGRAM — JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "WorkoutProgram",
  "type": "object",
  "required": ["id","userId","splitType","weeks","days"],
  "properties": {
    "id": { "type": "string" },
    "userId": { "type": "string" },
    "splitType": {
      "type": "string",
      "enum": ["PUSH_PULL_LEGS","UPPER_LOWER","FULL_BODY","BRO_SPLIT"]
    },
    "weeks": { "type": "integer", "minimum": 4, "maximum": 16 },
    "currentWeek": { "type": "integer", "minimum": 1 },
    "days": {
      "type": "array",
      "items": { "$ref": "#/definitions/WorkoutDay" }
    },
    "progressionPlan": { "$ref": "#/definitions/ProgressionPlan" }
  },
  "definitions": {
    "WorkoutDay": {
      "type": "object",
      "required": ["dayIndex","label","muscleGroupFocus","exerciseSlots"],
      "properties": {
        "dayIndex": { "type": "integer", "minimum": 1, "maximum": 7 },
        "label": { "type": "string", "examples": ["Push A","Pull A","Legs"] },
        "isRestDay": { "type": "boolean" },
        "muscleGroupFocus": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["CHEST","BACK","LEGS","SHOULDERS","ARMS","CORE"]
          }
        },
        "exerciseSlots": {
          "type": "array",
          "items": { "$ref": "#/definitions/ExerciseSlot" }
        }
      }
    },
    "ExerciseSlot": {
      "type": "object",
      "required": ["slotOrder","exerciseId","sets","repRangeLow","repRangeHigh","restSeconds"],
      "properties": {
        "slotOrder": { "type": "integer" },
        "exerciseId": { "type": "string" },
        "sets": { "type": "integer" },
        "repRangeLow": { "type": "integer" },
        "repRangeHigh": { "type": "integer" },
        "restSeconds": { "type": "integer" },
        "rpeTarget": { "type": "number" },
        "notes": { "type": "string" },
        "isSuperset": { "type": "boolean" },
        "supersetPartnerId": { "type": "string" }
      }
    },
    "ProgressionPlan": {
      "type": "object",
      "properties": {
        "model": {
          "type": "string",
          "enum": ["LINEAR","DOUBLE_PROGRESSIVE","VOLUME_PROGRESSIVE"]
        },
        "deloadEveryNWeeks": { "type": "integer" },
        "loadIncrementUpperBodyKg": { "type": "number" },
        "loadIncrementLowerBodyKg": { "type": "number" }
      }
    }
  }
}
```

---

## 11. ACTIVE WORKOUT SESSION — JSON SCHEMA

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ActiveWorkoutSession",
  "type": "object",
  "required": ["id","userId","workoutDayId","startedAt","status","setLogs"],
  "properties": {
    "id": { "type": "string" },
    "userId": { "type": "string" },
    "workoutDayId": { "type": "string" },
    "startedAt": { "type": "string", "format": "date-time" },
    "completedAt": { "type": "string", "format": "date-time" },
    "status": {
      "type": "string",
      "enum": ["IN_PROGRESS","COMPLETED","ABANDONED"]
    },
    "setLogs": {
      "type": "array",
      "items": { "$ref": "#/definitions/SetLog" }
    },
    "restTimerState": { "$ref": "#/definitions/RestTimerState" }
  },
  "definitions": {
    "SetLog": {
      "type": "object",
      "required": ["slotOrder","setNumber","isCompleted"],
      "properties": {
        "slotOrder": { "type": "integer" },
        "exerciseId": { "type": "string" },
        "setNumber": { "type": "integer" },
        "targetReps": { "type": "integer" },
        "actualReps": { "type": "integer" },
        "loadKg": { "type": "number" },
        "rpe": { "type": "number" },
        "isCompleted": { "type": "boolean" },
        "completedAt": { "type": "string", "format": "date-time" }
      }
    },
    "RestTimerState": {
      "type": "object",
      "properties": {
        "durationSeconds": { "type": "integer" },
        "remainingSeconds": { "type": "integer" },
        "isRunning": { "type": "boolean" },
        "triggeredBySlotOrder": { "type": "integer" },
        "triggeredBySetNumber": { "type": "integer" }
      }
    }
  }
}
```

---

## 12. PROGRAM GENERATION ALGORITHM — PSEUDOCODE

```
FUNCTION generateWorkoutProgram(user: UserProfile): WorkoutProgram

    // 1. Resolve split type based on days per week
    splitType = resolveSplitType(user.trainingDaysPerWeek)
    // Rule:
    //   2–3 days → FULL_BODY
    //   4 days   → UPPER_LOWER
    //   5–6 days → PUSH_PULL_LEGS

    // 2. Fetch volume prescription for this body type × goal
    prescription = VOLUME_MATRIX[user.bodyType][user.primaryGoal]

    // 3. Build day templates from split
    dayTemplates = SPLIT_TEMPLATES[splitType]

    // 4. For each day template, populate exercise slots
    FOR each dayTemplate IN dayTemplates:
        FOR each muscleGroup IN dayTemplate.muscleGroupFocus:

            // 4a. Filter exercises by availability
            candidates = exercises
                .filter(e => e.primaryMuscle == muscleGroup)
                .filter(e => e.equipment is subset of user.availableEquipment)
                .filter(e => e.difficulty <= user.experienceLevel)

            // 4b. Prioritize compounds first, isolations second
            compounds  = candidates.filter(e => e.mechanics == "COMPOUND")
            isolations = candidates.filter(e => e.mechanics == "ISOLATION")

            // 4c. Slot assignment rule
            //   Strength goal  → compounds only
            //   Hypertrophy    → 2 compounds + 1–2 isolations
            //   Fat Loss       → 1 compound  + 2–3 isolations (supersets allowed)
            selectedExercises = applyMechanicsBias(
                goal, compounds, isolations, prescription
            )

            // 4d. Map prescription onto each slot
            FOR each exercise IN selectedExercises:
                slot = ExerciseSlot {
                    exerciseId:   exercise.id,
                    sets:         prescription.sets,
                    repRangeLow:  prescription.repRangeLow,
                    repRangeHigh: prescription.repRangeHigh,
                    restSeconds:  prescription.restSeconds,
                    rpeTarget:    prescription.rpeTarget
                }

    // 5. Attach progression plan
    program.progressionPlan = {
        model:                     prescription.progressionModel,
        deloadEveryNWeeks:         4,
        loadIncrementUpperBodyKg:  2.5,
        loadIncrementLowerBodyKg:  5.0
    }

    RETURN program
END FUNCTION
```

---

## 13. ENTITY RELATIONSHIP SUMMARY

```
UserProfile ──────────────────────── 1:N ──── WorkoutProgram
WorkoutProgram ────────────────────── 1:N ──── WorkoutDay
WorkoutDay ─────────────────────────  1:N ──── ExerciseSlot
ExerciseSlot ────────────────── many:1 ──── Exercise
Exercise ──────────────────────── many:1 ──── MuscleGroup
MuscleGroup ─────────────────────── 1:N ──── TargetZone
WorkoutProgram ─────────────────── 1:1 ──── ProgressionPlan
ActiveWorkoutSession ──────── many:1 ──── WorkoutDay
ActiveWorkoutSession ─────────── 1:N ──── SetLog
```

---

## 14. TECHNOLOGY STACK RECOMMENDATION (Architectural Constraints for Downstream Agents)

| Layer               | Technology                                   | Rationale                                      |
|---------------------|----------------------------------------------|------------------------------------------------|
| Mobile Framework    | React Native (TypeScript)                    | Cross-platform, strong typing, large ecosystem |
| State Management    | Zustand + React Query                        | Lightweight, no boilerplate, cache + server sync |
| Local Database      | WatermelonDB (SQLite)                        | High-performance offline-first, reactive queries |
| Navigation          | React Navigation v7                          | Industry standard for RN                       |
| UI Components       | Custom + React Native Reanimated v3          | 60/120 fps animations on UI thread             |
| Testing             | Jest + React Native Testing Library          | Unit + integration coverage                    |
| Schema Validation   | Zod                                          | Runtime type safety matching JSON schemas      |

---

*End of Stage 1 — Architectural Blueprint. No application source code is included.*
