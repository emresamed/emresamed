# 03 — Equipment Tiers & Filter Logic

## 1. Equipment Enum (canonical)

| ID | Display | Tier |
|---|---|---|
| `BODYWEIGHT` | Bodyweight only | 0 |
| `RESISTANCE_BAND` | Resistance band | 1 |
| `PULL_UP_BAR` | Pull-up bar | 1 |
| `DUMBBELL` | Dumbbells | 2 |
| `KETTLEBELL` | Kettlebells | 2 |
| `BENCH` | Flat / adjustable bench | 2 |
| `BARBELL` | Barbell + plates | 3 |
| `RACK` | Power / squat rack | 3 |
| `CABLE` | Cable machine | 3 |
| `SMITH_MACHINE` | Smith machine | 3 |
| `PLATE_LOADED_MACHINE` | Hammer-strength style machine | 3 |
| `SELECTORIZED_MACHINE` | Pin-loaded machine | 3 |
| `LEG_PRESS` | Leg press machine | 3 |
| `HACK_SQUAT` | Hack squat machine | 3 |
| `LEG_CURL` | Leg curl machine | 3 |
| `LEG_EXTENSION` | Leg extension machine | 3 |
| `CALF_RAISE_MACHINE` | Calf raise machine | 3 |
| `LAT_PULLDOWN` | Lat pulldown station | 3 |
| `SEATED_ROW` | Seated row machine | 3 |
| `DIP_BAR` | Dip station | 2 |
| `EZ_BAR` | EZ-curl bar | 2 |
| `TRAP_BAR` | Hex/trap bar | 3 |

## 2. User-Side Equipment Profile

Three predefined kits + custom array.

| Kit ID | Auto-includes |
|---|---|
| `HOME_MINIMAL` | `BODYWEIGHT`, `RESISTANCE_BAND` |
| `HOME_INTERMEDIATE` | `HOME_MINIMAL` + `DUMBBELL`, `BENCH`, `PULL_UP_BAR` |
| `HOME_ADVANCED` | `HOME_INTERMEDIATE` + `BARBELL`, `RACK`, `EZ_BAR` |
| `COMMERCIAL_GYM` | All of the above + all machines listed in §1 tier 3 |
| `CUSTOM` | Explicit `available_equipment[]` set by user. |

The kit ID is **resolved at onboarding into a flat `available_equipment[]`**. Algorithms never branch on kit IDs.

## 3. Filter Rule

```
isUsable(exercise, user) =
    exercise.required_equipment.every(e => user.available_equipment.includes(e))
```

There is no partial credit and no substitution at the algorithm layer. Substitution suggestions ("you can swap barbell row for dumbbell row") are a UI affordance owned by Agent 4 and built on top of `exercise.swap_candidates[]` (optional field).

## 4. Equipment-Constrained Coverage Guarantee

For every supported user kit, the seed catalogue (Agent 2's responsibility) must contain at least:

| Muscle Group | Minimum usable exercises per kit |
|---|---|
| `CHEST` | 2 |
| `BACK` | 2 |
| `SHOULDERS` | 2 |
| `ARMS` | 2 |
| `LEGS` | 3 |
| `CORE` | 2 |

If a kit cannot meet this minimum for a group, Agent 1 must be re-run to expand the catalogue requirements (escalation; it is not Agent 2's call to lower the bar).
