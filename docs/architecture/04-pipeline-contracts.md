# 04 — Pipeline Contracts (Agent-to-Agent Hand-offs)

> What every downstream agent receives, returns, and is forbidden from doing. Read together with `schemas/`.

## 1. Agent 2 — Data Engineer

**Receives:**
- All JSON schemas in `schemas/`.
- Enum values in `data/enums.json`.
- Coverage rules in `03-equipment-tiers.md` §4.
- Volume landmarks in `01-training-algorithm-rules.md` §4 (used to size workout templates).

**Must produce:**
1. `data/exercises.seed.json` — array conforming to `schemas/exercise.schema.json`, **≥ 50 entries**, satisfying §4 coverage minimums for `HOME_INTERMEDIATE`, `HOME_ADVANCED`, and `COMMERCIAL_GYM` kits.
2. `data/muscle-groups.seed.json` — array conforming to `schemas/muscle-group.schema.json`, exactly 6 entries (one per `MuscleGroup` enum value).
3. `data/workout-templates.seed.json` — array conforming to `schemas/workout-template.schema.json`, providing at minimum:
   - 3-day Full Body × `{ECTOMORPH, MESOMORPH, ENDOMORPH} × {STRENGTH, HYPERTROPHY, ENDURANCE, FAT_LOSS}`
   - 4-day Upper/Lower × same matrix
   - 5-day & 6-day Push/Pull/Legs × same matrix
4. `data/seed.meta.json` — `{ "seed_version": "1.0.0", "generated_at": "...", "exercise_count": N, "template_count": M }`.

**Forbidden:**
- Adding fields not in the schema.
- Inventing new enum values (e.g. a 4th body type).
- Skipping the coverage minimums.

**Acceptance gate:** all four files MUST validate against their schemas with zero errors. Validation tooling itself is Agent 5's responsibility; Agent 2 must run it locally before hand-off.

## 2. Agent 3 — Core Developer

**Receives:**
- All Agent 2 seed files.
- The rules in `01-training-algorithm-rules.md` (encoded as a `constants.ts` / `constants.dart` file derived from `data/enums.json` + the rule tables).

**Must produce (only logic; UI belongs to Agent 4):**
- An onboarding state module that captures and validates a `UserProfile` against `schemas/user-profile.schema.json`.
- A pure function:
  ```
  generateWorkout(
      profile: UserProfile,
      seed: { exercises: Exercise[]; templates: WorkoutTemplate[]; muscleGroups: MuscleGroup[] },
      week_index: number  // 1-based mesocycle week
  ): GeneratedWorkout
  ```
  whose output validates against `schemas/generated-workout.schema.json` and follows the selection algorithm in `02-muscle-zone-map.md` §6, the math in `01-training-algorithm-rules.md` §5, and the progression scheme in §6.
- A `logSet(session, setLog) → SessionLog` reducer.

**Forbidden:**
- Using random numbers, `Date.now()`, network calls, or any non-deterministic input inside `generateWorkout`.
- Mutating seed data in place.
- Catching errors silently — Agent 5 expects to add error boundaries; Agent 3 throws typed errors.

**Determinism contract:** for any fixed `(profile, seed, week_index)`, `generateWorkout` must return byte-identical JSON.

## 3. Selection Algorithm Pseudocode (binding)

```
function generateWorkout(profile, seed, week_index):
    template = pickTemplate(seed.templates, profile)        // by split_type, body_type, goal, days_per_week
    sessions = []
    for tplSession in template.sessions:
        exercises = []
        for slot in tplSession.slots:
            pool = slot.candidate_pool
                .map(id => seed.exercises.find(e => e.id == id))
                .filter(e => isUsable(e, profile))
                .filter(e => respectsLimitations(e, profile))
                .filter(e => fitsExperience(e, profile))
            assert pool.length > 0, "PoolExhaustedError"
            chosen = pool[(week_index - 1) mod pool.length]
            params = computeSetRepLoad(chosen, profile, slot, week_index)
            exercises.push({ exercise_id: chosen.id, ...params })
        sessions.push({ day_index: tplSession.day_index, name: tplSession.name, exercises })
    return { user_id: profile.user_id, week_index, sessions, generated_from_template: template.id }
```

`computeSetRepLoad` applies the §5 formula from `01-training-algorithm-rules.md` plus the §6 progression delta for `week_index`.

## 4. Agent 4 — UI/UX & Motion Engineer

**Receives:**
- `GeneratedWorkout` from Agent 3 (read-only).
- `Exercise` lookup table for display strings, images, swap candidates.
- The rest-timer rule in `01-training-algorithm-rules.md` §8.

**Must produce:**
- Onboarding flow that emits a valid `UserProfile`.
- Muscle group selector screen.
- Active Workout Screen with set checkboxes, target rep range, dynamic rest timer.
- Writes back a `SessionLog` shaped per `schemas/session-log.schema.json`.

**Forbidden:**
- Computing sets/reps/rest itself. UI displays what Agent 3 produced; it never re-derives training math.
- Persisting any object not declared in `schemas/`.

## 5. Agent 5 — Auditor, QA & Optimization Engine

**Receives:**
- Everything above.

**Must produce:**
- Schema validation harness (Ajv/json_schema) that runs across all seed and generated artifacts.
- Unit tests covering the full matrix `{3 body types} × {4 goals} × {3 experience levels}` = 36 fixtures for `generateWorkout`, asserting:
  1. Output validates against `generated-workout.schema.json`.
  2. Volume landmarks in `01-training-algorithm-rules.md` §4 are satisfied for every muscle group present in the template.
  3. Compound ratio is respected.
  4. Determinism: 10 successive calls return identical output.
  5. Limitation filter: a profile with `LOW_BACK_SENSITIVE` never receives `BB_DEADLIFT` or any exercise tagged `HIGH_LUMBAR_LOAD`.
- Error boundaries around all data-loading code.
- The §9 worked example in `01-training-algorithm-rules.md` as a regression test.

**Veto authority:** Agent 5 may refactor code from Agents 3 and 4 but **cannot** alter any schema, enum, rule, or pipeline contract defined in Stage 1 without re-running Agent 1.

## 6. Hand-off Checklist (each agent attaches this to its PR)

```
[ ] Output files validate against their schemas
[ ] No new enum values introduced
[ ] No new top-level keys introduced
[ ] Determinism tests pass
[ ] Coverage guarantees (03 §4) verified
[ ] Worked example (01 §9) reproduced
```
