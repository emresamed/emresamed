# Schemas (Stage 1 contract)

Draft-07 JSON Schemas. Every persisted object in this app must validate against one of these. Authored by Agent 1; consumed by Agents 2–5.

| Schema | Owner of instances | Consumed by |
|---|---|---|
| `exercise.schema.json` | Agent 2 (seed) | 3, 4, 5 |
| `muscle-group.schema.json` | Agent 2 (seed) | 3, 5 |
| `workout-template.schema.json` | Agent 2 (seed) | 3, 5 |
| `user-profile.schema.json` | Agent 3 (onboarding) | 3, 4, 5 |
| `generated-workout.schema.json` | Agent 3 (`generateWorkout`) | 4, 5 |
| `session-log.schema.json` | Agent 4 (active session) | 3 (autoregulation), 5 |

Enum values are centralized in [`../data/enums.json`](../data/enums.json). Schemas inline the enum lists for cross-language portability; if you change an enum, change both files and re-run Agent 1.
