# 01 — Training Algorithm Rules

> Body Type × Goal × Progression. All numbers below are **deterministic** inputs to `generateWorkout()`. Agent 3 must consume them as constants; it may not invent additional modifiers.

## 1. Variable Glossary

| Symbol | Meaning | Range |
|---|---|---|
| `sets` | Working sets per exercise (excludes warm-ups) | 1–8 |
| `reps_min` / `reps_max` | Target rep range per set | 1–25 |
| `rpe` | Rate of Perceived Exertion target | 5–10 |
| `pct_1rm` | Load as % of estimated 1RM | 30–100 |
| `rest_s` | Inter-set rest in seconds | 20–360 |
| `tempo` | `ecc-pause-conc-pause` seconds, e.g. `"3-1-1-0"` | strings |
| `weekly_sets_per_muscle` | Sum of working sets per muscle group across the week | 6–25 |

## 2. Goal Baselines (assume `MESOMORPH`, `INTERMEDIATE`)

| Goal | `sets` | `reps` | `rpe` | `pct_1rm` | `rest_s` | `tempo` | Notes |
|---|---|---|---|---|---|---|---|
| `STRENGTH` | 4–6 | 3–6 | 8–9 | 80–92 | 180–300 | `2-1-1-0` | Compound-heavy; low-rep top sets. |
| `HYPERTROPHY` | 3–5 | 6–12 | 7–9 | 65–80 | 60–120 | `2-0-1-0` | Mixed compound/isolation; near-failure work sets. |
| `ENDURANCE` | 2–4 | 12–20 | 6–8 | 50–65 | 30–60 | `1-0-1-0` | Higher density; minimal rest. |

## 3. Body Type Modifiers (multiplicative / additive)

Applied **after** the goal baseline is selected.

| Body Type | `volume_mult` (sets) | `intensity_bias` (% 1RM) | `rest_bias` (s) | `compound_ratio` | `frequency_per_muscle_per_week` | `conditioning_min_per_week` |
|---|---|---|---|---|---|---|
| `ECTOMORPH` | 0.85 | +5 | +30 | 0.70 | 1.5 | 30 |
| `MESOMORPH` | 1.00 | 0 | 0 | 0.60 | 2.0 | 75 |
| `ENDOMORPH` | 1.15 | −5 | −20 | 0.55 | 2.5 | 150 |

**Rationale:**
- Ectomorphs recover slower per unit of mechanical tension; emphasize compound stimulus, longer rest, and conservative volume to avoid net-catabolic states.
- Mesomorphs sit at the textbook baseline.
- Endomorphs benefit from higher density/volume and added conditioning to improve insulin sensitivity and energy balance.

## 4. Volume Landmarks per Muscle Group (weekly working sets)

Source: Renaissance Periodization volume framework. `MV` = Maintenance, `MEV` = Minimum Effective, `MAV` = Maximum Adaptive, `MRV` = Maximum Recoverable.

| Muscle Group | MV | MEV | MAV | MRV |
|---|---|---|---|---|
| `CHEST` | 6 | 8 | 12 | 20 |
| `BACK` | 6 | 10 | 16 | 25 |
| `SHOULDERS` | 4 | 8 | 14 | 22 |
| `ARMS` (biceps) | 4 | 6 | 12 | 20 |
| `ARMS` (triceps) | 4 | 6 | 12 | 18 |
| `LEGS` (quads) | 6 | 8 | 14 | 20 |
| `LEGS` (hamstrings) | 4 | 6 | 12 | 18 |
| `LEGS` (glutes) | 4 | 6 | 12 | 18 |
| `LEGS` (calves) | 6 | 8 | 14 | 20 |
| `CORE` | 0 | 6 | 12 | 20 |

**Targeting rule:** the weekly working-set sum for any muscle group must satisfy
`MEV × volume_mult  ≤  weekly_sets  ≤  min(MRV, MAV × volume_mult × goal_volume_factor)`
where `goal_volume_factor` is `0.80` for `STRENGTH`, `1.00` for `HYPERTROPHY`, `1.10` for `ENDURANCE`.

## 5. Final Per-Exercise Formula

Given the goal baseline `B` and body modifier `M`:

```
sets_final     = round( pick(B.sets)   * M.volume_mult )
reps_final     = clampRange( B.reps,   B.reps_min,  B.reps_max )
rest_final     = clamp( pick(B.rest_s) + M.rest_bias, 20, 360 )
pct_1rm_final  = clamp( pick(B.pct_1rm) + M.intensity_bias, 40, 95 )
rpe_final      = pick(B.rpe)              // not modified by body type
tempo_final    = exercise.default_tempo ?? B.tempo
```

`pick()` chooses the midpoint of the baseline range unless an autoregulation override exists (see §7).

## 6. Progression Model (weekly)

Linear baseline with periodized deload, all values relative to the previous matching session for that exercise.

| Week (mesocycle) | Sets | Load (kg) | RPE Target | Reason |
|---|---|---|---|---|
| 1 | base | base | base | Accumulation start |
| 2 | +1 set on top compound | +2.5 (upper) / +5 (lower) if last RPE ≤ 7 | base + 0.5 | Progressive overload |
| 3 | +1 set on isolations | +2.5 / +5 if last RPE ≤ 8 | base + 1.0 | Peak loading |
| 4 (deload) | × 0.6 | × 0.85 | base − 1.5 | CNS recovery |

**Plateau rule:** if `weight × reps` does not exceed the previous session's value for 2 consecutive sessions on the same exercise, switch to **double progression** (max reps in the range, then add the smallest plate, then reset to the bottom of the range).

## 7. Autoregulation Overrides

Inputs read from the most recent `SessionLog`:

| Signal | Source | Effect on next session |
|---|---|---|
| Average completed RPE > 9.0 | Last 3 working sets | `sets_final − 1`, `pct_1rm_final − 5` |
| Missed rep target on ≥ 50% of working sets | This exercise, this week | Hold weight; same `sets`, retest next session |
| Reported soreness ≥ 8/10 on target group | User check-in | Demote muscle group to `MV` for the affected day |
| Sleep ≤ 5 h reported | User check-in | Cap session at 75% of planned volume |

## 8. Rest-Period Behavior on the Active Session Screen

The timer logic itself is Agent 4's concern, but the **rule** that governs it lives here:

```
displayed_rest_s = exercise_set.rest_s
overrun_grace_s  = 30
warn_at_s        = exercise_set.rest_s - 10   // haptic / sound cue
auto_skip_after  = exercise_set.rest_s + overrun_grace_s + 90  // safety upper bound
```

Rest is **never** auto-shortened by the algorithm; only the user may skip early.

## 9. Worked Example (binding test case)

Input:
```json
{ "body_type": "ECTOMORPH", "goal": "HYPERTROPHY", "experience": "INTERMEDIATE" }
```
Selecting exercise `BB_BENCH_PRESS` (mechanics `COMPOUND`, primary `CHEST`):

```
B = HYPERTROPHY baseline: sets=4, reps=8-10, rpe=8, pct_1rm=72, rest=90
M = ECTOMORPH:            volume_mult=0.85, intensity_bias=+5, rest_bias=+30

sets_final    = round(4 * 0.85)    = 3
reps_final    = 8-10
rest_final    = clamp(90 + 30, 20, 360) = 120
pct_1rm_final = clamp(72 + 5, 40, 95)   = 77
rpe_final     = 8
```

Agent 5 must include this exact case as a unit test fixture.
