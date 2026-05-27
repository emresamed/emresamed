# Stage 1 — Master Architectural Blueprint

> **Owner:** Agent 1 (System Architect & Biomechanics Expert)
> **Status:** Awaiting user approval before Stage 2 (Data Engineering) and Stage 3/4 (Coding) can start.
> **Output type:** Architectural blueprint, rule sets, and JSON schemas **only** — no application source code.

This folder contains the canonical specification that all downstream agents (Data Engineer, Core Developer, UI/UX Engineer, QA & Optimizer) must consume verbatim. Any key, enum value, or rule used downstream that is not declared here is a contract violation.

## 1. Document Index

| # | File | Purpose |
|---|------|---------|
| 1 | [`01-training-algorithm-rules.md`](./01-training-algorithm-rules.md) | Body type × Goal volume/intensity/rest math, progression, deload, autoregulation. |
| 2 | [`02-muscle-zone-map.md`](./02-muscle-zone-map.md) | Muscle Group → Target Zone → Movement Type → Equipment relational model. |
| 3 | [`03-equipment-tiers.md`](./03-equipment-tiers.md) | Equipment enum, tiers, and filter logic for exercise selection. |
| 4 | [`04-pipeline-contracts.md`](./04-pipeline-contracts.md) | Per-agent input/output contracts and hand-off invariants. |
| — | [`../../schemas/`](../../schemas) | JSON Schema (Draft-07) files for every persisted object. |
| — | [`../../data/enums.json`](../../data/enums.json) | Canonical enum values referenced by every schema. |

## 2. System Boundaries

```
                ┌─────────────────────────────────────────────────────┐
                │                  Mobile Fitness App                 │
                └─────────────────────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
   Onboarding                  Workout Generation                Active Session
   (User Profile)              (Algorithm Engine)                (Tracking + Logs)
        │                              │                              │
        ▼                              ▼                              ▼
   UserProfile.json   ◀──reads──   GeneratedWorkout.json   ◀──reads──   SessionLog.json
                                       ▲
                                       │ reads
                                       │
                       ┌───────────────┴──────────────────┐
                       │                                  │
                  Exercise[]                       WorkoutTemplate[]
                  (seed data)                      (seed data)
                       │                                  │
                       └────── conforms to ──────► Stage 1 schemas
```

## 3. Core Domain Vocabulary (binding)

| Concept | Definition | Source of Truth |
|---|---|---|
| `BodyType` | `ECTOMORPH` \| `MESOMORPH` \| `ENDOMORPH` | `data/enums.json` |
| `Goal` | `STRENGTH` \| `HYPERTROPHY` \| `ENDURANCE` \| `FAT_LOSS` | `data/enums.json` |
| `MuscleGroup` | `CHEST` \| `BACK` \| `SHOULDERS` \| `ARMS` \| `LEGS` \| `CORE` | `data/enums.json` |
| `TargetZone` | Sub-region of a muscle group (e.g. `UPPER_CHEST`, `LATS_WIDTH`). Full list in `02-muscle-zone-map.md`. | `02-muscle-zone-map.md` |
| `Mechanics` | `COMPOUND` \| `ISOLATION` | `data/enums.json` |
| `Force` | `PUSH` \| `PULL` \| `SQUAT` \| `HINGE` \| `LUNGE` \| `CARRY` \| `STATIC` \| `ROTATION` | `data/enums.json` |
| `Equipment` | See `03-equipment-tiers.md`. | `data/enums.json` |
| `Experience` | `BEGINNER` \| `INTERMEDIATE` \| `ADVANCED` | `data/enums.json` |
| `SplitType` | `FULL_BODY` \| `UPPER_LOWER` \| `PUSH_PULL_LEGS` \| `BRO_SPLIT` | `data/enums.json` |
| `Volume Landmark` | `MV` / `MEV` / `MAV` / `MRV` weekly working-set counts per muscle group. | `01-training-algorithm-rules.md` §4 |
| `RPE` | Rate of Perceived Exertion, integer 1–10. | `01-training-algorithm-rules.md` §2 |
| `%1RM` | Percentage of estimated one-rep max, integer 30–100. | `01-training-algorithm-rules.md` §2 |

## 4. High-Level Pipeline (recap of Master Prompt §3)

```
Agent 1 (this doc)        Agent 2                Agent 3                    Agent 4                Agent 5
Architecture & Rules ──► Seed Data ──────────► Generation Logic ────────► UI & Active Session ──► Audit, Tests, Refactor
   (JSON schemas)         (≥50 exercises +      (TS/Dart, type-safe,        (dark-mode, timer,     (final production code)
                          templates per body    pure functions consume      progress write-back)
                          type)                  Agent 2 output)
```

**Hand-off invariants:**
- Agent 2's seed data MUST validate against every schema in `schemas/`.
- Agent 3's `generateWorkout(profile, seed, rules)` MUST return an object that validates against `schemas/generated-workout.schema.json`.
- Agent 4 MUST only read/write `GeneratedWorkout` and `SessionLog` shapes; it never mutates seed data.
- Agent 5 owns refactor authority but cannot change any key name, enum value, or rule defined here without re-running Agent 1.

## 5. Non-Functional Constraints (architectural, not implementation)

| Constraint | Target | Rationale |
|---|---|---|
| Generation latency (cold) | ≤ 150 ms on mid-range mobile | Onboarding feel; rule out heavy I/O in core path. |
| Generation determinism | Same `(UserProfile, week_index, seed_version)` ⇒ identical output | Reproducibility, testability, QA. |
| Schema validation | All persisted objects validate Draft-07 | Cross-language (TS/Dart) safety. |
| Algorithm purity | `generateWorkout` is a pure function (no clock, no RNG except via injected seed) | Unit-testable by Agent 5. |
| Locale | All user-facing strings live outside the algorithm; algorithm uses IDs only | i18n readiness. |

## 6. Approval Gate

Stage 2 (Agent 2 — Seed Data) and Stage 3+ (coding) **do not start** until the user signs off on:

1. The training algorithm rule matrix in `01-training-algorithm-rules.md`.
2. The muscle/zone/movement/equipment relational model in `02-muscle-zone-map.md`.
3. The six JSON schemas in `schemas/`.
4. The pipeline contracts in `04-pipeline-contracts.md`.
