# 02 — Muscle Group → Target Zone → Movement → Equipment Relational Model

> The canonical taxonomy every `Exercise` row must map into. Agent 2 cannot introduce a target zone not listed here.

## 1. Top-Level Muscle Groups

| ID | Display | Antagonist | Notes |
|---|---|---|---|
| `CHEST` | Chest | `BACK` | Push pattern dominant. |
| `BACK` | Back | `CHEST` | Pull pattern dominant; split into width and thickness. |
| `SHOULDERS` | Shoulders | — | Three independent heads. |
| `ARMS` | Arms | self | Biceps ↔ Triceps antagonist pair internally. |
| `LEGS` | Legs | self | Quad ↔ Hamstring antagonist pair internally. |
| `CORE` | Core | — | Stabilizer; rarely the primary mover for compounds. |

## 2. Target Zones (sub-regions)

| Muscle Group | Target Zone ID | Description | Preferred Mechanics |
|---|---|---|---|
| `CHEST` | `UPPER_CHEST` | Clavicular head | Incline press/fly |
| `CHEST` | `MID_CHEST` | Sternal head | Flat press/fly |
| `CHEST` | `LOWER_CHEST` | Costal head | Decline press, dips |
| `BACK` | `UPPER_TRAPS` | Upper trapezius | Shrugs, high pulls |
| `BACK` | `MID_BACK` | Rhomboids / mid traps | Rows (horizontal pull) |
| `BACK` | `LATS_WIDTH` | Latissimus, frontal plane | Pulldowns / pull-ups (vertical pull) |
| `BACK` | `LATS_THICKNESS` | Latissimus, sagittal plane | Heavy rows |
| `BACK` | `LOWER_BACK` | Erector spinae | Hinges, extensions |
| `SHOULDERS` | `FRONT_DELT` | Anterior deltoid | Overhead/front press |
| `SHOULDERS` | `SIDE_DELT` | Lateral deltoid | Lateral raises |
| `SHOULDERS` | `REAR_DELT` | Posterior deltoid | Reverse fly, face pull |
| `ARMS` | `BICEPS_LONG` | Long head | Incline curl, drag curl |
| `ARMS` | `BICEPS_SHORT` | Short head | Preacher curl, spider curl |
| `ARMS` | `BRACHIALIS` | Brachialis / brachioradialis | Hammer curl |
| `ARMS` | `TRICEPS_LONG` | Long head | Overhead extensions |
| `ARMS` | `TRICEPS_LATERAL` | Lateral head | Pressdowns |
| `ARMS` | `TRICEPS_MEDIAL` | Medial head | Close-grip press |
| `ARMS` | `FOREARMS` | Wrist flexors/extensors | Wrist curls, grip work |
| `LEGS` | `QUADS` | Vastus group + rectus femoris | Squats, extensions |
| `LEGS` | `HAMSTRINGS` | Biceps femoris + semi-* | Curls, RDLs |
| `LEGS` | `GLUTES` | Gluteus maximus | Hip thrusts, hinges |
| `LEGS` | `ADDUCTORS` | Inner thigh | Adduction, sumo stance |
| `LEGS` | `CALVES` | Gastrocnemius + soleus | Standing/seated raises |
| `CORE` | `RECTUS_ABDOMINIS` | Six-pack | Crunch family |
| `CORE` | `OBLIQUES` | External/internal obliques | Rotation, side flexion |
| `CORE` | `TRANSVERSE` | Transverse abdominis | Anti-extension, planks |
| `CORE` | `LOWER_BACK_STAB` | Erectors as stabilizer | Anti-flexion/extension |

## 3. Movement Pattern Catalogue

Every exercise must declare exactly one `force` value:

| Pattern (`force`) | Examples | Primary group |
|---|---|---|
| `PUSH` | Bench press, OHP, dip, push-up | Chest / Shoulders / Triceps |
| `PULL` | Row, pulldown, pull-up, face pull | Back / Biceps / Rear delt |
| `SQUAT` | Back squat, front squat, leg press | Quads / Glutes |
| `HINGE` | Deadlift, RDL, hip thrust, good morning | Hamstrings / Glutes / Lower back |
| `LUNGE` | Walking lunge, split squat, step-up | Quads / Glutes (unilateral) |
| `CARRY` | Farmer's carry, suitcase carry | Core / Traps / Forearms |
| `STATIC` | Plank, hollow hold, wall sit | Core / Quads (isometric) |
| `ROTATION` | Cable woodchop, Pallof press | Core / Obliques |

## 4. Mechanics (`COMPOUND` vs `ISOLATION`)

| Field | Definition |
|---|---|
| `COMPOUND` | ≥ 2 joints crossed; recruits ≥ 2 muscle groups meaningfully. Examples: squat, bench, row. |
| `ISOLATION` | Single joint (or single dominant joint); targets a single muscle group. Examples: leg extension, curl, lateral raise. |

Selection bias by body type (from `01-training-algorithm-rules.md` §3 `compound_ratio`): when the generator picks `N` exercises for a session, `round(N × compound_ratio)` must be `COMPOUND` and the remainder `ISOLATION`. Ties round toward `COMPOUND`.

## 5. Equipment Requirements

See [`03-equipment-tiers.md`](./03-equipment-tiers.md). Every `Exercise.required_equipment` value must be a subset of the enum.

## 6. Selection Algorithm (deterministic ordering)

When Agent 3 fills a `WorkoutTemplate` slot, it applies these filters **in this exact order**:

1. **Equipment filter:** keep only exercises where `required_equipment ⊆ user.available_equipment`.
2. **Limitation filter:** drop exercises whose `contraindications` intersect `user.limitations`.
3. **Muscle/Zone match:** keep exercises whose `primary_muscle_group = slot.muscle_group` AND (`slot.zone == null` OR `primary_target_zone == slot.zone`).
4. **Mechanics match:** keep exercises whose `mechanics == slot.required_mechanics` (if slot specifies it).
5. **Experience cap:** drop exercises whose `difficulty` is harder than `user.experience` (with `BEGINNER < INTERMEDIATE < ADVANCED`).
6. **Sort** the remaining candidates by:
   1. `fatigue_index` descending for `PRIMARY_COMPOUND` slots, ascending for accessory slots;
   2. then by `id` ascending (tie-breaker → guarantees determinism).
7. **Pick** index `0`. Pseudocode lives in `04-pipeline-contracts.md` §3.

No randomness is permitted in the core picker. Variation across weeks is achieved by rotating the candidate pool offset in `WorkoutTemplate.slot.candidate_pool` (Agent 2 supplies the rotation order; Agent 3 just iterates `pool[(week_index − 1) mod len(pool)]`).

## 7. Antagonist Pairing Hints (used by `FAT_LOSS` supersets)

| Pair Key | A | B |
|---|---|---|
| `PUSH_PULL` | any `PUSH` | any `PULL` |
| `QUAD_HAM` | `LEGS/QUADS` | `LEGS/HAMSTRINGS` |
| `BICEPS_TRICEPS` | `ARMS/BICEPS_*` | `ARMS/TRICEPS_*` |
| `CHEST_BACK` | any `CHEST` zone | any `BACK` zone |

When `goal == FAT_LOSS`, Agent 3 pairs accessory slots according to the table above; rest is taken **only between supersets**, not between A and B.
