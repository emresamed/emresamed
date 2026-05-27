# Mobile Fitness App — Architecture Blueprint (Stage 1)

Approved blueprint for the multi-agent pipeline. Application source code lives in later stages; this document defines business logic, schemas, and algorithms.

## Stack Defaults (post-approval)

- **Runtime:** Flutter + Dart (`mobile/`)
- **Goals:** `strength`, `hypertrophy`, `fat_loss`, `endurance`
- **Split selection:** Auto from `daysPerWeek` with optional user override

## Data Layout

```
data/
  config/algorithm_config.json    # Volume, RPE, rest multipliers
  seed/exercises.seed.json        # 59 exercises (schema: Exercise)
  seed/split_templates.seed.json  # PPL / Upper-Lower / Full Body × body types
docs/ARCHITECTURE.md              # This file
```

## Core Algorithms

See Stage 1 delivery in PR description for:

- Body type volume / rest / intensity offsets
- Goal presets (sets, reps, RPE, %1RM, rest)
- Weekly volume per muscle group
- Progressive overload (2-week microcycle, week-6 deload)
- Exercise selection scoring

## JSON Schemas

Canonical schemas: `Exercise`, `UserProfile`, `WorkoutSessionTemplate`, `Prescription`, `GeneratedWorkout`, `AlgorithmConfig` — keys are locked for Agent 2 seed data compatibility.

## Pipeline Status

| Stage | Agent | Status |
|-------|-------|--------|
| 1 | Architect | Done |
| 2 | Data Engineer | Done (seed files) |
| 3 | Core Developer | Done (`mobile/lib/domain`, `mobile/lib/state`) |
| 4 | UI Engineer | Done (`mobile/lib/ui`) |
| 5 | QA | Partial (generator unit tests) |
