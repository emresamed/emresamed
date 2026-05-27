"""
Stage 2 (Agent 2 — Data Engineer) seed data builder.

This script is a *build-time tool*, not application source code. It emits:
  - data/exercises.seed.json
  - data/muscle-groups.seed.json
  - data/workout-templates.seed.json
  - data/seed.meta.json

Every output is then validated against the Stage 1 schemas under schemas/.

The exercise catalogue and muscle group taxonomy are authored explicitly.
The workout-template matrix (4 splits x 3 body types x 3 goals = 36 templates)
is generated combinatorially from a per-split slot blueprint with body-type
and goal adjustments applied.
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SCHEMAS = ROOT / "schemas"

SEED_VERSION = "1.0.0"


# ---------------------------------------------------------------------------
# 1. EXERCISE CATALOGUE  (>= 50, schema-conformant)
# ---------------------------------------------------------------------------
#
# Convention: id is UPPER_SNAKE_CASE. fatigue_index 1-10 reflects systemic
# cost. contraindications come from data/enums.json#/Contraindication.
# required_equipment is the *minimum* gear set; bodyweight-friendly variants
# include BODYWEIGHT plus any required apparatus (e.g. PULL_UP_BAR).

def E(**kwargs):  # tiny constructor to keep rows compact
    row = {
        "secondary_muscle_groups": [],
        "secondary_target_zones": [],
        "movement_plane": "SAGITTAL",
        "rom_priority": "FULL",
        "tags": [],
        "contraindications": [],
        "swap_candidates": [],
        "instruction_cues": [],
    }
    row.update(kwargs)
    return row


EXERCISES = [
    # ---------------------- CHEST ----------------------
    E(id="BB_BENCH_PRESS", name="Barbell Bench Press",
      primary_muscle_group="CHEST", primary_target_zone="MID_CHEST",
      secondary_muscle_groups=["ARMS", "SHOULDERS"],
      secondary_target_zones=["TRICEPS_LATERAL", "FRONT_DELT"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["BARBELL", "BENCH", "RACK"],
      difficulty="INTERMEDIATE", fatigue_index=8,
      default_tempo="2-0-1-0",
      tags=["MASS_BUILDER", "POWERLIFT"],
      swap_candidates=["DB_FLAT_BENCH_PRESS", "PUSH_UP"]),
    E(id="BB_INCLINE_BENCH_PRESS", name="Barbell Incline Bench Press",
      primary_muscle_group="CHEST", primary_target_zone="UPPER_CHEST",
      secondary_muscle_groups=["ARMS", "SHOULDERS"],
      secondary_target_zones=["TRICEPS_LATERAL", "FRONT_DELT"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["BARBELL", "BENCH", "RACK"],
      difficulty="INTERMEDIATE", fatigue_index=8,
      default_tempo="2-0-1-0",
      tags=["MASS_BUILDER"],
      swap_candidates=["DB_INCLINE_BENCH_PRESS"]),
    E(id="BB_DECLINE_BENCH_PRESS", name="Barbell Decline Bench Press",
      primary_muscle_group="CHEST", primary_target_zone="LOWER_CHEST",
      secondary_muscle_groups=["ARMS"], secondary_target_zones=["TRICEPS_LATERAL"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["BARBELL", "BENCH", "RACK"],
      difficulty="INTERMEDIATE", fatigue_index=7,
      default_tempo="2-0-1-0",
      swap_candidates=["DIP_CHEST"]),
    E(id="DB_FLAT_BENCH_PRESS", name="Dumbbell Flat Bench Press",
      primary_muscle_group="CHEST", primary_target_zone="MID_CHEST",
      secondary_muscle_groups=["ARMS", "SHOULDERS"],
      secondary_target_zones=["TRICEPS_LATERAL", "FRONT_DELT"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="BEGINNER", fatigue_index=6,
      default_tempo="2-0-1-0",
      swap_candidates=["BB_BENCH_PRESS"]),
    E(id="DB_INCLINE_BENCH_PRESS", name="Dumbbell Incline Bench Press",
      primary_muscle_group="CHEST", primary_target_zone="UPPER_CHEST",
      secondary_muscle_groups=["ARMS", "SHOULDERS"],
      secondary_target_zones=["TRICEPS_LATERAL", "FRONT_DELT"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="BEGINNER", fatigue_index=6,
      default_tempo="2-0-1-0",
      swap_candidates=["BB_INCLINE_BENCH_PRESS"]),
    E(id="DIP_CHEST", name="Chest Dip",
      primary_muscle_group="CHEST", primary_target_zone="LOWER_CHEST",
      secondary_muscle_groups=["ARMS"], secondary_target_zones=["TRICEPS_LATERAL"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["DIP_BAR", "BODYWEIGHT"],
      difficulty="INTERMEDIATE", fatigue_index=7,
      default_tempo="3-0-1-0",
      contraindications=["WRIST_HYPEREXTENSION"],
      swap_candidates=["BB_DECLINE_BENCH_PRESS"]),
    E(id="PUSH_UP", name="Push-Up",
      primary_muscle_group="CHEST", primary_target_zone="MID_CHEST",
      secondary_muscle_groups=["ARMS", "CORE"],
      secondary_target_zones=["TRICEPS_LATERAL", "TRANSVERSE"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["BODYWEIGHT"],
      difficulty="BEGINNER", fatigue_index=4,
      default_tempo="2-0-1-0",
      tags=["BEGINNER_FRIENDLY"]),
    E(id="CABLE_CHEST_FLY", name="Cable Chest Fly",
      primary_muscle_group="CHEST", primary_target_zone="MID_CHEST",
      mechanics="ISOLATION", force="PUSH",
      movement_plane="FRONTAL",
      required_equipment=["CABLE"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-1-1-0", rom_priority="STRETCH_FOCUS",
      swap_candidates=["PEC_DECK_FLY", "DB_INCLINE_FLY"]),
    E(id="PEC_DECK_FLY", name="Pec Deck Fly",
      primary_muscle_group="CHEST", primary_target_zone="MID_CHEST",
      mechanics="ISOLATION", force="PUSH",
      movement_plane="FRONTAL",
      required_equipment=["SELECTORIZED_MACHINE"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-1-1-0",
      swap_candidates=["CABLE_CHEST_FLY"]),
    E(id="DB_INCLINE_FLY", name="Dumbbell Incline Fly",
      primary_muscle_group="CHEST", primary_target_zone="UPPER_CHEST",
      mechanics="ISOLATION", force="PUSH",
      movement_plane="FRONTAL",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="BEGINNER", fatigue_index=4,
      default_tempo="3-1-1-0", rom_priority="STRETCH_FOCUS",
      swap_candidates=["CABLE_CHEST_FLY"]),

    # ---------------------- BACK ----------------------
    E(id="BB_DEADLIFT", name="Conventional Barbell Deadlift",
      primary_muscle_group="BACK", primary_target_zone="LOWER_BACK",
      secondary_muscle_groups=["LEGS", "BACK"],
      secondary_target_zones=["HAMSTRINGS", "GLUTES", "LATS_THICKNESS"],
      mechanics="COMPOUND", force="HINGE",
      required_equipment=["BARBELL"],
      difficulty="ADVANCED", fatigue_index=10,
      default_tempo="2-0-X-0",
      tags=["POWERLIFT", "POSTERIOR_CHAIN"],
      contraindications=["HIGH_LUMBAR_LOAD", "VALSALVA_HEAVY"],
      swap_candidates=["BB_RDL", "RACK_PULL"]),
    E(id="BB_BENT_OVER_ROW", name="Barbell Bent-Over Row",
      primary_muscle_group="BACK", primary_target_zone="LATS_THICKNESS",
      secondary_muscle_groups=["BACK", "ARMS"],
      secondary_target_zones=["MID_BACK", "BICEPS_LONG"],
      mechanics="COMPOUND", force="PULL",
      required_equipment=["BARBELL"],
      difficulty="INTERMEDIATE", fatigue_index=8,
      default_tempo="2-0-1-0",
      contraindications=["HIGH_LUMBAR_LOAD"],
      swap_candidates=["T_BAR_ROW", "DB_ONE_ARM_ROW"]),
    E(id="DB_ONE_ARM_ROW", name="One-Arm Dumbbell Row",
      primary_muscle_group="BACK", primary_target_zone="LATS_THICKNESS",
      secondary_muscle_groups=["BACK", "ARMS"],
      secondary_target_zones=["MID_BACK", "BICEPS_LONG"],
      mechanics="COMPOUND", force="PULL",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="BEGINNER", fatigue_index=5,
      default_tempo="2-0-1-0",
      swap_candidates=["BB_BENT_OVER_ROW"]),
    E(id="T_BAR_ROW", name="T-Bar Row",
      primary_muscle_group="BACK", primary_target_zone="MID_BACK",
      secondary_muscle_groups=["BACK", "ARMS"],
      secondary_target_zones=["LATS_THICKNESS", "BICEPS_LONG"],
      mechanics="COMPOUND", force="PULL",
      required_equipment=["BARBELL"],
      difficulty="INTERMEDIATE", fatigue_index=7,
      default_tempo="2-0-1-0",
      contraindications=["HIGH_LUMBAR_LOAD"],
      swap_candidates=["BB_BENT_OVER_ROW"]),
    E(id="PULL_UP", name="Pull-Up",
      primary_muscle_group="BACK", primary_target_zone="LATS_WIDTH",
      secondary_muscle_groups=["ARMS", "BACK"],
      secondary_target_zones=["BICEPS_LONG", "MID_BACK"],
      mechanics="COMPOUND", force="PULL",
      required_equipment=["PULL_UP_BAR", "BODYWEIGHT"],
      difficulty="INTERMEDIATE", fatigue_index=7,
      default_tempo="2-0-1-0",
      swap_candidates=["LAT_PULLDOWN_WIDE", "CHIN_UP"]),
    E(id="CHIN_UP", name="Chin-Up",
      primary_muscle_group="BACK", primary_target_zone="LATS_WIDTH",
      secondary_muscle_groups=["ARMS"],
      secondary_target_zones=["BICEPS_SHORT", "BICEPS_LONG"],
      mechanics="COMPOUND", force="PULL",
      required_equipment=["PULL_UP_BAR", "BODYWEIGHT"],
      difficulty="INTERMEDIATE", fatigue_index=7,
      default_tempo="2-0-1-0",
      swap_candidates=["PULL_UP", "LAT_PULLDOWN_WIDE"]),
    E(id="LAT_PULLDOWN_WIDE", name="Wide-Grip Lat Pulldown",
      primary_muscle_group="BACK", primary_target_zone="LATS_WIDTH",
      secondary_muscle_groups=["ARMS"], secondary_target_zones=["BICEPS_LONG"],
      mechanics="COMPOUND", force="PULL",
      required_equipment=["LAT_PULLDOWN"],
      difficulty="BEGINNER", fatigue_index=5,
      default_tempo="2-0-1-0",
      swap_candidates=["PULL_UP"]),
    E(id="SEATED_CABLE_ROW", name="Seated Cable Row",
      primary_muscle_group="BACK", primary_target_zone="MID_BACK",
      secondary_muscle_groups=["ARMS", "BACK"],
      secondary_target_zones=["BICEPS_LONG", "LATS_THICKNESS"],
      mechanics="COMPOUND", force="PULL",
      required_equipment=["SEATED_ROW"],
      difficulty="BEGINNER", fatigue_index=5,
      default_tempo="2-1-1-0",
      swap_candidates=["DB_ONE_ARM_ROW"]),
    E(id="CABLE_FACE_PULL", name="Cable Face Pull",
      primary_muscle_group="SHOULDERS", primary_target_zone="REAR_DELT",
      secondary_muscle_groups=["BACK"], secondary_target_zones=["MID_BACK", "UPPER_TRAPS"],
      mechanics="ISOLATION", force="PULL",
      required_equipment=["CABLE"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="2-1-1-0",
      tags=["SHOULDER_HEALTH"]),
    E(id="BB_SHRUG", name="Barbell Shrug",
      primary_muscle_group="BACK", primary_target_zone="UPPER_TRAPS",
      mechanics="ISOLATION", force="PULL",
      required_equipment=["BARBELL"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-1-1-0"),
    E(id="RACK_PULL", name="Rack Pull",
      primary_muscle_group="BACK", primary_target_zone="LOWER_BACK",
      secondary_muscle_groups=["BACK", "LEGS"],
      secondary_target_zones=["LATS_THICKNESS", "HAMSTRINGS"],
      mechanics="COMPOUND", force="HINGE",
      required_equipment=["BARBELL", "RACK"],
      difficulty="INTERMEDIATE", fatigue_index=8,
      default_tempo="2-0-1-0",
      contraindications=["HIGH_LUMBAR_LOAD"],
      swap_candidates=["BB_DEADLIFT"]),

    # ---------------------- SHOULDERS ----------------------
    E(id="BB_OVERHEAD_PRESS", name="Barbell Overhead Press",
      primary_muscle_group="SHOULDERS", primary_target_zone="FRONT_DELT",
      secondary_muscle_groups=["ARMS", "SHOULDERS"],
      secondary_target_zones=["TRICEPS_LATERAL", "SIDE_DELT"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["BARBELL", "RACK"],
      difficulty="INTERMEDIATE", fatigue_index=8,
      default_tempo="2-0-1-0",
      contraindications=["OVERHEAD_PRESSING"],
      tags=["POWERLIFT"],
      swap_candidates=["DB_SHOULDER_PRESS"]),
    E(id="DB_SHOULDER_PRESS", name="Seated Dumbbell Shoulder Press",
      primary_muscle_group="SHOULDERS", primary_target_zone="FRONT_DELT",
      secondary_muscle_groups=["ARMS", "SHOULDERS"],
      secondary_target_zones=["TRICEPS_LATERAL", "SIDE_DELT"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="BEGINNER", fatigue_index=6,
      default_tempo="2-0-1-0",
      contraindications=["OVERHEAD_PRESSING"],
      swap_candidates=["BB_OVERHEAD_PRESS", "ARNOLD_PRESS"]),
    E(id="ARNOLD_PRESS", name="Arnold Press",
      primary_muscle_group="SHOULDERS", primary_target_zone="FRONT_DELT",
      secondary_muscle_groups=["SHOULDERS", "ARMS"],
      secondary_target_zones=["SIDE_DELT", "TRICEPS_LATERAL"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="INTERMEDIATE", fatigue_index=6,
      default_tempo="2-0-1-0",
      contraindications=["OVERHEAD_PRESSING"],
      swap_candidates=["DB_SHOULDER_PRESS"]),
    E(id="DB_LATERAL_RAISE", name="Dumbbell Lateral Raise",
      primary_muscle_group="SHOULDERS", primary_target_zone="SIDE_DELT",
      mechanics="ISOLATION", force="PUSH",
      movement_plane="FRONTAL",
      required_equipment=["DUMBBELL"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-1-1-0",
      swap_candidates=["CABLE_LATERAL_RAISE"]),
    E(id="CABLE_LATERAL_RAISE", name="Cable Lateral Raise",
      primary_muscle_group="SHOULDERS", primary_target_zone="SIDE_DELT",
      mechanics="ISOLATION", force="PUSH",
      movement_plane="FRONTAL",
      required_equipment=["CABLE"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-1-1-0",
      swap_candidates=["DB_LATERAL_RAISE"]),
    E(id="DB_REAR_DELT_FLY", name="Dumbbell Rear Delt Fly",
      primary_muscle_group="SHOULDERS", primary_target_zone="REAR_DELT",
      mechanics="ISOLATION", force="PULL",
      movement_plane="FRONTAL",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="2-1-1-0",
      swap_candidates=["CABLE_FACE_PULL"]),
    E(id="DB_FRONT_RAISE", name="Dumbbell Front Raise",
      primary_muscle_group="SHOULDERS", primary_target_zone="FRONT_DELT",
      mechanics="ISOLATION", force="PUSH",
      required_equipment=["DUMBBELL"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="2-1-1-0"),

    # ---------------------- ARMS ----------------------
    E(id="BB_CURL", name="Barbell Curl",
      primary_muscle_group="ARMS", primary_target_zone="BICEPS_SHORT",
      secondary_muscle_groups=["ARMS"], secondary_target_zones=["BICEPS_LONG", "FOREARMS"],
      mechanics="ISOLATION", force="PULL",
      required_equipment=["BARBELL"],
      difficulty="BEGINNER", fatigue_index=4,
      default_tempo="2-0-1-0",
      contraindications=["WRIST_HYPEREXTENSION"]),
    E(id="DB_CURL", name="Dumbbell Curl",
      primary_muscle_group="ARMS", primary_target_zone="BICEPS_SHORT",
      secondary_target_zones=["BICEPS_LONG"],
      mechanics="ISOLATION", force="PULL",
      required_equipment=["DUMBBELL"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-0-1-0"),
    E(id="HAMMER_CURL", name="Hammer Curl",
      primary_muscle_group="ARMS", primary_target_zone="BRACHIALIS",
      secondary_target_zones=["BICEPS_LONG", "FOREARMS"],
      mechanics="ISOLATION", force="PULL",
      required_equipment=["DUMBBELL"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-0-1-0"),
    E(id="PREACHER_CURL", name="Preacher Curl",
      primary_muscle_group="ARMS", primary_target_zone="BICEPS_SHORT",
      mechanics="ISOLATION", force="PULL",
      required_equipment=["EZ_BAR", "BENCH"],
      difficulty="BEGINNER", fatigue_index=4,
      default_tempo="3-1-1-0", rom_priority="STRETCH_FOCUS"),
    E(id="INCLINE_DB_CURL", name="Incline Dumbbell Curl",
      primary_muscle_group="ARMS", primary_target_zone="BICEPS_LONG",
      mechanics="ISOLATION", force="PULL",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="3-1-1-0", rom_priority="STRETCH_FOCUS"),
    E(id="CLOSE_GRIP_BENCH_PRESS", name="Close-Grip Bench Press",
      primary_muscle_group="ARMS", primary_target_zone="TRICEPS_MEDIAL",
      secondary_muscle_groups=["CHEST", "SHOULDERS"],
      secondary_target_zones=["MID_CHEST", "FRONT_DELT"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["BARBELL", "BENCH", "RACK"],
      difficulty="INTERMEDIATE", fatigue_index=7,
      default_tempo="2-0-1-0",
      contraindications=["WRIST_HYPEREXTENSION"]),
    E(id="CABLE_TRICEP_PUSHDOWN", name="Cable Tricep Pushdown",
      primary_muscle_group="ARMS", primary_target_zone="TRICEPS_LATERAL",
      mechanics="ISOLATION", force="PUSH",
      required_equipment=["CABLE"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-0-1-0"),
    E(id="OVERHEAD_TRICEP_EXTENSION", name="Overhead Dumbbell Tricep Extension",
      primary_muscle_group="ARMS", primary_target_zone="TRICEPS_LONG",
      mechanics="ISOLATION", force="PUSH",
      required_equipment=["DUMBBELL"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="3-1-1-0", rom_priority="STRETCH_FOCUS",
      contraindications=["OVERHEAD_PRESSING"]),
    E(id="SKULL_CRUSHER", name="EZ-Bar Skull Crusher",
      primary_muscle_group="ARMS", primary_target_zone="TRICEPS_LONG",
      mechanics="ISOLATION", force="PUSH",
      required_equipment=["EZ_BAR", "BENCH"],
      difficulty="INTERMEDIATE", fatigue_index=4,
      default_tempo="3-1-1-0"),
    E(id="DIP_TRICEPS", name="Triceps Dip (Upright)",
      primary_muscle_group="ARMS", primary_target_zone="TRICEPS_LATERAL",
      secondary_muscle_groups=["CHEST"], secondary_target_zones=["LOWER_CHEST"],
      mechanics="COMPOUND", force="PUSH",
      required_equipment=["DIP_BAR", "BODYWEIGHT"],
      difficulty="INTERMEDIATE", fatigue_index=6,
      default_tempo="2-0-1-0",
      contraindications=["WRIST_HYPEREXTENSION"]),
    E(id="DB_TRICEPS_KICKBACK", name="Dumbbell Triceps Kickback",
      primary_muscle_group="ARMS", primary_target_zone="TRICEPS_LATERAL",
      mechanics="ISOLATION", force="PUSH",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="2-1-1-0"),

    # ---------------------- LEGS ----------------------
    E(id="BB_BACK_SQUAT", name="Barbell Back Squat",
      primary_muscle_group="LEGS", primary_target_zone="QUADS",
      secondary_muscle_groups=["LEGS", "CORE"],
      secondary_target_zones=["GLUTES", "HAMSTRINGS", "LOWER_BACK_STAB"],
      mechanics="COMPOUND", force="SQUAT",
      required_equipment=["BARBELL", "RACK"],
      difficulty="ADVANCED", fatigue_index=10,
      default_tempo="3-0-1-0",
      tags=["POWERLIFT", "MASS_BUILDER"],
      contraindications=["DEEP_KNEE_FLEXION", "HIGH_LUMBAR_LOAD", "VALSALVA_HEAVY"],
      swap_candidates=["LEG_PRESS", "HACK_SQUAT_MACHINE"]),
    E(id="BB_FRONT_SQUAT", name="Barbell Front Squat",
      primary_muscle_group="LEGS", primary_target_zone="QUADS",
      secondary_muscle_groups=["CORE", "LEGS"],
      secondary_target_zones=["LOWER_BACK_STAB", "GLUTES"],
      mechanics="COMPOUND", force="SQUAT",
      required_equipment=["BARBELL", "RACK"],
      difficulty="ADVANCED", fatigue_index=9,
      default_tempo="3-0-1-0",
      contraindications=["DEEP_KNEE_FLEXION", "WRIST_HYPEREXTENSION"]),
    E(id="LEG_PRESS", name="Leg Press",
      primary_muscle_group="LEGS", primary_target_zone="QUADS",
      secondary_target_zones=["GLUTES"],
      mechanics="COMPOUND", force="SQUAT",
      required_equipment=["LEG_PRESS"],
      difficulty="BEGINNER", fatigue_index=7,
      default_tempo="2-0-1-0",
      contraindications=["DEEP_HIP_FLEXION"]),
    E(id="HACK_SQUAT_MACHINE", name="Machine Hack Squat",
      primary_muscle_group="LEGS", primary_target_zone="QUADS",
      secondary_target_zones=["GLUTES"],
      mechanics="COMPOUND", force="SQUAT",
      required_equipment=["HACK_SQUAT"],
      difficulty="INTERMEDIATE", fatigue_index=7,
      default_tempo="3-0-1-0"),
    E(id="BB_RDL", name="Barbell Romanian Deadlift",
      primary_muscle_group="LEGS", primary_target_zone="HAMSTRINGS",
      secondary_muscle_groups=["LEGS", "BACK"],
      secondary_target_zones=["GLUTES", "LOWER_BACK"],
      mechanics="COMPOUND", force="HINGE",
      required_equipment=["BARBELL"],
      difficulty="INTERMEDIATE", fatigue_index=8,
      default_tempo="3-1-1-0", rom_priority="STRETCH_FOCUS",
      contraindications=["HIGH_LUMBAR_LOAD"],
      swap_candidates=["DB_RDL"]),
    E(id="DB_RDL", name="Dumbbell Romanian Deadlift",
      primary_muscle_group="LEGS", primary_target_zone="HAMSTRINGS",
      secondary_target_zones=["GLUTES", "LOWER_BACK"],
      mechanics="COMPOUND", force="HINGE",
      required_equipment=["DUMBBELL"],
      difficulty="BEGINNER", fatigue_index=6,
      default_tempo="3-1-1-0", rom_priority="STRETCH_FOCUS",
      swap_candidates=["BB_RDL"]),
    E(id="DB_WALKING_LUNGE", name="Dumbbell Walking Lunge",
      primary_muscle_group="LEGS", primary_target_zone="QUADS",
      secondary_target_zones=["GLUTES", "HAMSTRINGS"],
      mechanics="COMPOUND", force="LUNGE",
      required_equipment=["DUMBBELL"],
      difficulty="INTERMEDIATE", fatigue_index=6,
      default_tempo="2-0-1-0"),
    E(id="BB_HIP_THRUST", name="Barbell Hip Thrust",
      primary_muscle_group="LEGS", primary_target_zone="GLUTES",
      secondary_target_zones=["HAMSTRINGS"],
      mechanics="COMPOUND", force="HINGE",
      required_equipment=["BARBELL", "BENCH"],
      difficulty="INTERMEDIATE", fatigue_index=6,
      default_tempo="2-1-1-0"),
    E(id="LEG_CURL_MACHINE", name="Lying Leg Curl",
      primary_muscle_group="LEGS", primary_target_zone="HAMSTRINGS",
      mechanics="ISOLATION", force="PULL",
      required_equipment=["LEG_CURL"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-1-1-0"),
    E(id="LEG_EXTENSION_MACHINE", name="Leg Extension",
      primary_muscle_group="LEGS", primary_target_zone="QUADS",
      mechanics="ISOLATION", force="PUSH",
      required_equipment=["LEG_EXTENSION"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-1-1-0"),
    E(id="STANDING_CALF_RAISE", name="Standing Calf Raise",
      primary_muscle_group="LEGS", primary_target_zone="CALVES",
      mechanics="ISOLATION", force="PUSH",
      required_equipment=["CALF_RAISE_MACHINE"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="2-1-2-0", rom_priority="STRETCH_FOCUS"),
    E(id="SEATED_CALF_RAISE", name="Seated Calf Raise",
      primary_muscle_group="LEGS", primary_target_zone="CALVES",
      mechanics="ISOLATION", force="PUSH",
      required_equipment=["CALF_RAISE_MACHINE"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="2-1-2-0", rom_priority="STRETCH_FOCUS"),
    E(id="DB_GOBLET_SQUAT", name="Dumbbell Goblet Squat",
      primary_muscle_group="LEGS", primary_target_zone="QUADS",
      secondary_target_zones=["GLUTES"],
      mechanics="COMPOUND", force="SQUAT",
      required_equipment=["DUMBBELL"],
      difficulty="BEGINNER", fatigue_index=5,
      default_tempo="3-0-1-0"),
    E(id="BULGARIAN_SPLIT_SQUAT", name="Bulgarian Split Squat",
      primary_muscle_group="LEGS", primary_target_zone="QUADS",
      secondary_target_zones=["GLUTES"],
      mechanics="COMPOUND", force="LUNGE",
      required_equipment=["DUMBBELL", "BENCH"],
      difficulty="INTERMEDIATE", fatigue_index=6,
      default_tempo="3-0-1-0"),

    # ---------------------- CORE ----------------------
    E(id="PLANK", name="Front Plank",
      primary_muscle_group="CORE", primary_target_zone="TRANSVERSE",
      secondary_target_zones=["RECTUS_ABDOMINIS"],
      mechanics="ISOLATION", force="STATIC",
      required_equipment=["BODYWEIGHT"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="0-X-0-0"),
    E(id="SIDE_PLANK", name="Side Plank",
      primary_muscle_group="CORE", primary_target_zone="OBLIQUES",
      mechanics="ISOLATION", force="STATIC",
      required_equipment=["BODYWEIGHT"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="0-X-0-0"),
    E(id="HANGING_LEG_RAISE", name="Hanging Leg Raise",
      primary_muscle_group="CORE", primary_target_zone="RECTUS_ABDOMINIS",
      secondary_target_zones=["TRANSVERSE"],
      mechanics="ISOLATION", force="PULL",
      required_equipment=["PULL_UP_BAR", "BODYWEIGHT"],
      difficulty="INTERMEDIATE", fatigue_index=4,
      default_tempo="2-0-1-0"),
    E(id="CABLE_CRUNCH", name="Cable Crunch",
      primary_muscle_group="CORE", primary_target_zone="RECTUS_ABDOMINIS",
      mechanics="ISOLATION", force="STATIC",
      required_equipment=["CABLE"],
      difficulty="BEGINNER", fatigue_index=3,
      default_tempo="2-1-1-0"),
    E(id="AB_WHEEL_ROLLOUT", name="Ab Wheel Rollout",
      primary_muscle_group="CORE", primary_target_zone="TRANSVERSE",
      secondary_target_zones=["RECTUS_ABDOMINIS", "LOWER_BACK_STAB"],
      mechanics="ISOLATION", force="STATIC",
      required_equipment=["BODYWEIGHT"],
      difficulty="ADVANCED", fatigue_index=5,
      default_tempo="3-0-1-0",
      contraindications=["HIGH_LUMBAR_LOAD"]),
    E(id="PALLOF_PRESS", name="Cable Pallof Press",
      primary_muscle_group="CORE", primary_target_zone="OBLIQUES",
      secondary_target_zones=["TRANSVERSE"],
      mechanics="ISOLATION", force="ROTATION",
      movement_plane="TRANSVERSE",
      required_equipment=["CABLE"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="2-1-1-0",
      tags=["ANTI_ROTATION"]),
    E(id="BAND_PALLOF_PRESS", name="Band Pallof Press",
      primary_muscle_group="CORE", primary_target_zone="OBLIQUES",
      mechanics="ISOLATION", force="ROTATION",
      movement_plane="TRANSVERSE",
      required_equipment=["RESISTANCE_BAND"],
      difficulty="BEGINNER", fatigue_index=2,
      default_tempo="2-1-1-0"),
]


# ---------------------------------------------------------------------------
# 2. MUSCLE GROUPS (6) with target zones + weekly volume landmarks.
# Landmarks mirror docs/architecture/01-training-algorithm-rules.md §4
# (RP Volume Framework). Arm/leg landmarks are aggregated to the group;
# per-sub-group nuances are encoded via target_zones.
# ---------------------------------------------------------------------------

MUSCLE_GROUPS = [
    {
        "id": "CHEST",
        "name": "Chest",
        "antagonist": "BACK",
        "target_zones": [
            {"id": "UPPER_CHEST", "display_name": "Upper Chest", "preferred_force": ["PUSH"],
             "stimulus_priority": ["BB_INCLINE_BENCH_PRESS", "DB_INCLINE_BENCH_PRESS", "DB_INCLINE_FLY"]},
            {"id": "MID_CHEST",   "display_name": "Mid Chest",   "preferred_force": ["PUSH"],
             "stimulus_priority": ["BB_BENCH_PRESS", "DB_FLAT_BENCH_PRESS", "PEC_DECK_FLY", "CABLE_CHEST_FLY"]},
            {"id": "LOWER_CHEST", "display_name": "Lower Chest", "preferred_force": ["PUSH"],
             "stimulus_priority": ["BB_DECLINE_BENCH_PRESS", "DIP_CHEST"]},
        ],
        "weekly_volume_landmarks": {"MV": 6, "MEV": 8, "MAV": 12, "MRV": 20},
    },
    {
        "id": "BACK",
        "name": "Back",
        "antagonist": "CHEST",
        "target_zones": [
            {"id": "UPPER_TRAPS",     "display_name": "Upper Traps",     "preferred_force": ["PULL"],
             "stimulus_priority": ["BB_SHRUG", "CABLE_FACE_PULL"]},
            {"id": "MID_BACK",        "display_name": "Mid Back",        "preferred_force": ["PULL"],
             "stimulus_priority": ["T_BAR_ROW", "SEATED_CABLE_ROW", "DB_ONE_ARM_ROW"]},
            {"id": "LATS_WIDTH",      "display_name": "Lats (Width)",    "preferred_force": ["PULL"],
             "stimulus_priority": ["PULL_UP", "CHIN_UP", "LAT_PULLDOWN_WIDE"]},
            {"id": "LATS_THICKNESS",  "display_name": "Lats (Thickness)","preferred_force": ["PULL"],
             "stimulus_priority": ["BB_BENT_OVER_ROW", "DB_ONE_ARM_ROW", "T_BAR_ROW"]},
            {"id": "LOWER_BACK",      "display_name": "Lower Back / Erectors", "preferred_force": ["HINGE"],
             "stimulus_priority": ["BB_DEADLIFT", "RACK_PULL", "BB_RDL"]},
        ],
        "weekly_volume_landmarks": {"MV": 6, "MEV": 10, "MAV": 16, "MRV": 25},
    },
    {
        "id": "SHOULDERS",
        "name": "Shoulders",
        "antagonist": None,
        "target_zones": [
            {"id": "FRONT_DELT", "display_name": "Front Delt", "preferred_force": ["PUSH"],
             "stimulus_priority": ["BB_OVERHEAD_PRESS", "DB_SHOULDER_PRESS", "ARNOLD_PRESS", "DB_FRONT_RAISE"]},
            {"id": "SIDE_DELT",  "display_name": "Side Delt",  "preferred_force": ["PUSH"],
             "stimulus_priority": ["DB_LATERAL_RAISE", "CABLE_LATERAL_RAISE"]},
            {"id": "REAR_DELT",  "display_name": "Rear Delt",  "preferred_force": ["PULL"],
             "stimulus_priority": ["CABLE_FACE_PULL", "DB_REAR_DELT_FLY"]},
        ],
        "weekly_volume_landmarks": {"MV": 4, "MEV": 8, "MAV": 14, "MRV": 22},
    },
    {
        "id": "ARMS",
        "name": "Arms",
        "antagonist": None,
        "target_zones": [
            {"id": "BICEPS_LONG",    "display_name": "Biceps Long Head",  "preferred_force": ["PULL"],
             "stimulus_priority": ["INCLINE_DB_CURL", "HAMMER_CURL", "BB_CURL"]},
            {"id": "BICEPS_SHORT",   "display_name": "Biceps Short Head", "preferred_force": ["PULL"],
             "stimulus_priority": ["PREACHER_CURL", "BB_CURL", "DB_CURL"]},
            {"id": "BRACHIALIS",     "display_name": "Brachialis",        "preferred_force": ["PULL"],
             "stimulus_priority": ["HAMMER_CURL"]},
            {"id": "TRICEPS_LONG",   "display_name": "Triceps Long Head", "preferred_force": ["PUSH"],
             "stimulus_priority": ["OVERHEAD_TRICEP_EXTENSION", "SKULL_CRUSHER"]},
            {"id": "TRICEPS_LATERAL","display_name": "Triceps Lateral",   "preferred_force": ["PUSH"],
             "stimulus_priority": ["CABLE_TRICEP_PUSHDOWN", "DIP_TRICEPS", "DB_TRICEPS_KICKBACK"]},
            {"id": "TRICEPS_MEDIAL", "display_name": "Triceps Medial",    "preferred_force": ["PUSH"],
             "stimulus_priority": ["CLOSE_GRIP_BENCH_PRESS"]},
            {"id": "FOREARMS",       "display_name": "Forearms",          "preferred_force": ["CARRY"],
             "stimulus_priority": ["HAMMER_CURL", "BB_CURL"]},
        ],
        "weekly_volume_landmarks": {"MV": 4, "MEV": 6, "MAV": 12, "MRV": 20},
    },
    {
        "id": "LEGS",
        "name": "Legs",
        "antagonist": None,
        "target_zones": [
            {"id": "QUADS",      "display_name": "Quadriceps", "preferred_force": ["SQUAT", "LUNGE"],
             "stimulus_priority": ["BB_BACK_SQUAT", "BB_FRONT_SQUAT", "LEG_PRESS", "HACK_SQUAT_MACHINE", "LEG_EXTENSION_MACHINE"]},
            {"id": "HAMSTRINGS", "display_name": "Hamstrings", "preferred_force": ["HINGE", "PULL"],
             "stimulus_priority": ["BB_RDL", "DB_RDL", "LEG_CURL_MACHINE"]},
            {"id": "GLUTES",     "display_name": "Glutes",     "preferred_force": ["HINGE", "SQUAT"],
             "stimulus_priority": ["BB_HIP_THRUST", "BB_RDL", "DB_WALKING_LUNGE", "BULGARIAN_SPLIT_SQUAT"]},
            {"id": "CALVES",     "display_name": "Calves",     "preferred_force": ["PUSH"],
             "stimulus_priority": ["STANDING_CALF_RAISE", "SEATED_CALF_RAISE"]},
        ],
        "weekly_volume_landmarks": {"MV": 6, "MEV": 8, "MAV": 14, "MRV": 20},
    },
    {
        "id": "CORE",
        "name": "Core",
        "antagonist": None,
        "target_zones": [
            {"id": "RECTUS_ABDOMINIS", "display_name": "Rectus Abdominis", "preferred_force": ["PULL", "STATIC"],
             "stimulus_priority": ["CABLE_CRUNCH", "HANGING_LEG_RAISE"]},
            {"id": "OBLIQUES",         "display_name": "Obliques",         "preferred_force": ["ROTATION", "STATIC"],
             "stimulus_priority": ["PALLOF_PRESS", "BAND_PALLOF_PRESS", "SIDE_PLANK"]},
            {"id": "TRANSVERSE",       "display_name": "Transverse Abdominis", "preferred_force": ["STATIC"],
             "stimulus_priority": ["PLANK", "AB_WHEEL_ROLLOUT"]},
            {"id": "LOWER_BACK_STAB",  "display_name": "Erectors (Stabilizer)","preferred_force": ["STATIC"],
             "stimulus_priority": ["AB_WHEEL_ROLLOUT"]},
        ],
        "weekly_volume_landmarks": {"MV": 0, "MEV": 6, "MAV": 12, "MRV": 20},
    },
]


# ---------------------------------------------------------------------------
# 3. WORKOUT TEMPLATE MATRIX (4 splits x 3 body x 3 goals = 36 templates).
#
# A "slot blueprint" defines the per-session slot skeleton for each split.
# For each (body, goal) we apply two adjustments:
#   * body type sets a *slot count multiplier* (volume_mult from §3 of the
#     training algorithm rules), rounded.
#   * goal selects the *primary pool* and the *accessory ratio*:
#       STRENGTH    => prefer compound exercises, deeper PRIMARY/SECONDARY
#                      compound slots, fewer accessory slots.
#       HYPERTROPHY => balanced.
#       ENDURANCE   => trim heavy compound depth, add finishers.
# All exercise IDs must exist in EXERCISES.
# ---------------------------------------------------------------------------

EX_IDS = {e["id"] for e in EXERCISES}


def pool(*ids):
    for i in ids:
        assert i in EX_IDS, f"unknown exercise id {i}"
    return list(ids)


# Slot blueprint: list of (role, muscle_group, zone-or-None, mechanics-or-None, candidate_pool)
# Per split and per session day. Sessions are 1-indexed.

FULL_BODY_BLUEPRINT = {
    "name_prefix": "Full Body",
    "split_type": "FULL_BODY",
    "days_per_week": 3,
    "sessions": [
        {  # Day 1 - emphasis: lower
            "name": "Full Body A (Squat focus)",
            "focus_groups": ["LEGS", "CHEST", "BACK", "SHOULDERS", "ARMS", "CORE"],
            "slots": [
                ("PRIMARY_COMPOUND",   "LEGS",      "QUADS",         "COMPOUND", pool("BB_BACK_SQUAT", "LEG_PRESS", "DB_GOBLET_SQUAT")),
                ("PRIMARY_COMPOUND",   "CHEST",     "MID_CHEST",     "COMPOUND", pool("BB_BENCH_PRESS", "DB_FLAT_BENCH_PRESS", "PUSH_UP")),
                ("SECONDARY_COMPOUND", "BACK",      "LATS_WIDTH",    "COMPOUND", pool("PULL_UP", "LAT_PULLDOWN_WIDE", "CHIN_UP")),
                ("ACCESSORY_ISOLATION","SHOULDERS", "SIDE_DELT",     "ISOLATION",pool("DB_LATERAL_RAISE", "CABLE_LATERAL_RAISE")),
                ("ACCESSORY_ISOLATION","ARMS",      "BICEPS_SHORT",  "ISOLATION",pool("DB_CURL", "BB_CURL", "HAMMER_CURL")),
                ("CORE_FINISHER",      "CORE",      "TRANSVERSE",    None,       pool("PLANK", "AB_WHEEL_ROLLOUT")),
            ],
        },
        {  # Day 2 - emphasis: upper push
            "name": "Full Body B (Press focus)",
            "focus_groups": ["CHEST", "SHOULDERS", "BACK", "LEGS", "ARMS", "CORE"],
            "slots": [
                ("PRIMARY_COMPOUND",   "CHEST",     "UPPER_CHEST",   "COMPOUND", pool("BB_INCLINE_BENCH_PRESS", "DB_INCLINE_BENCH_PRESS")),
                ("PRIMARY_COMPOUND",   "SHOULDERS", "FRONT_DELT",    "COMPOUND", pool("BB_OVERHEAD_PRESS", "DB_SHOULDER_PRESS", "ARNOLD_PRESS")),
                ("SECONDARY_COMPOUND", "LEGS",      "HAMSTRINGS",    "COMPOUND", pool("BB_RDL", "DB_RDL")),
                ("SECONDARY_COMPOUND", "BACK",      "MID_BACK",      "COMPOUND", pool("SEATED_CABLE_ROW", "BB_BENT_OVER_ROW", "DB_ONE_ARM_ROW")),
                ("ACCESSORY_ISOLATION","ARMS",      "TRICEPS_LATERAL","ISOLATION",pool("CABLE_TRICEP_PUSHDOWN", "DB_TRICEPS_KICKBACK")),
                ("CORE_FINISHER",      "CORE",      "OBLIQUES",      None,       pool("PALLOF_PRESS", "SIDE_PLANK", "BAND_PALLOF_PRESS")),
            ],
        },
        {  # Day 3 - emphasis: pull
            "name": "Full Body C (Pull focus)",
            "focus_groups": ["BACK", "LEGS", "SHOULDERS", "CHEST", "ARMS", "CORE"],
            "slots": [
                ("PRIMARY_COMPOUND",   "BACK",      "LOWER_BACK",    "COMPOUND", pool("BB_DEADLIFT", "RACK_PULL", "BB_RDL")),
                ("PRIMARY_COMPOUND",   "BACK",      "LATS_THICKNESS","COMPOUND", pool("BB_BENT_OVER_ROW", "DB_ONE_ARM_ROW", "T_BAR_ROW")),
                ("SECONDARY_COMPOUND", "LEGS",      "GLUTES",        "COMPOUND", pool("BB_HIP_THRUST", "DB_WALKING_LUNGE", "BULGARIAN_SPLIT_SQUAT")),
                ("SECONDARY_COMPOUND", "CHEST",     "LOWER_CHEST",   "COMPOUND", pool("BB_DECLINE_BENCH_PRESS", "DIP_CHEST")),
                ("ACCESSORY_ISOLATION","SHOULDERS", "REAR_DELT",     "ISOLATION",pool("CABLE_FACE_PULL", "DB_REAR_DELT_FLY")),
                ("ACCESSORY_ISOLATION","ARMS",      "BICEPS_LONG",   "ISOLATION",pool("INCLINE_DB_CURL", "HAMMER_CURL", "BB_CURL")),
            ],
        },
    ],
}


UPPER_LOWER_BLUEPRINT = {
    "name_prefix": "Upper/Lower",
    "split_type": "UPPER_LOWER",
    "days_per_week": 4,
    "sessions": [
        {  # Day 1 - Upper A (horizontal push/pull)
            "name": "Upper A",
            "focus_groups": ["CHEST", "BACK", "SHOULDERS", "ARMS"],
            "slots": [
                ("PRIMARY_COMPOUND",   "CHEST",     "MID_CHEST",     "COMPOUND", pool("BB_BENCH_PRESS", "DB_FLAT_BENCH_PRESS")),
                ("PRIMARY_COMPOUND",   "BACK",      "LATS_THICKNESS","COMPOUND", pool("BB_BENT_OVER_ROW", "DB_ONE_ARM_ROW", "T_BAR_ROW")),
                ("SECONDARY_COMPOUND", "CHEST",     "UPPER_CHEST",   "COMPOUND", pool("BB_INCLINE_BENCH_PRESS", "DB_INCLINE_BENCH_PRESS")),
                ("SECONDARY_COMPOUND", "BACK",      "LATS_WIDTH",    "COMPOUND", pool("PULL_UP", "LAT_PULLDOWN_WIDE", "CHIN_UP")),
                ("ACCESSORY_ISOLATION","SHOULDERS", "SIDE_DELT",     "ISOLATION",pool("DB_LATERAL_RAISE", "CABLE_LATERAL_RAISE")),
                ("ACCESSORY_ISOLATION","ARMS",      "BICEPS_SHORT",  "ISOLATION",pool("BB_CURL", "DB_CURL")),
                ("ACCESSORY_ISOLATION","ARMS",      "TRICEPS_LATERAL","ISOLATION",pool("CABLE_TRICEP_PUSHDOWN", "DB_TRICEPS_KICKBACK")),
            ],
        },
        {  # Day 2 - Lower A (squat focus)
            "name": "Lower A",
            "focus_groups": ["LEGS", "CORE"],
            "slots": [
                ("PRIMARY_COMPOUND",   "LEGS", "QUADS",      "COMPOUND", pool("BB_BACK_SQUAT", "BB_FRONT_SQUAT", "LEG_PRESS")),
                ("SECONDARY_COMPOUND", "LEGS", "HAMSTRINGS", "COMPOUND", pool("BB_RDL", "DB_RDL")),
                ("SECONDARY_COMPOUND", "LEGS", "GLUTES",     "COMPOUND", pool("BB_HIP_THRUST", "DB_WALKING_LUNGE", "BULGARIAN_SPLIT_SQUAT")),
                ("ACCESSORY_ISOLATION","LEGS", "QUADS",      "ISOLATION",pool("LEG_EXTENSION_MACHINE")),
                ("ACCESSORY_ISOLATION","LEGS", "HAMSTRINGS", "ISOLATION",pool("LEG_CURL_MACHINE")),
                ("ACCESSORY_ISOLATION","LEGS", "CALVES",     "ISOLATION",pool("STANDING_CALF_RAISE", "SEATED_CALF_RAISE")),
                ("CORE_FINISHER",      "CORE", "TRANSVERSE", None,       pool("PLANK", "AB_WHEEL_ROLLOUT")),
            ],
        },
        {  # Day 3 - Upper B (vertical push/pull)
            "name": "Upper B",
            "focus_groups": ["SHOULDERS", "BACK", "CHEST", "ARMS"],
            "slots": [
                ("PRIMARY_COMPOUND",   "SHOULDERS", "FRONT_DELT",    "COMPOUND", pool("BB_OVERHEAD_PRESS", "DB_SHOULDER_PRESS", "ARNOLD_PRESS")),
                ("PRIMARY_COMPOUND",   "BACK",      "LATS_WIDTH",    "COMPOUND", pool("PULL_UP", "LAT_PULLDOWN_WIDE", "CHIN_UP")),
                ("SECONDARY_COMPOUND", "CHEST",     "LOWER_CHEST",   "COMPOUND", pool("BB_DECLINE_BENCH_PRESS", "DIP_CHEST")),
                ("SECONDARY_COMPOUND", "BACK",      "MID_BACK",      "COMPOUND", pool("SEATED_CABLE_ROW", "T_BAR_ROW")),
                ("ACCESSORY_ISOLATION","SHOULDERS", "REAR_DELT",     "ISOLATION",pool("CABLE_FACE_PULL", "DB_REAR_DELT_FLY")),
                ("ACCESSORY_ISOLATION","ARMS",      "BICEPS_LONG",   "ISOLATION",pool("INCLINE_DB_CURL", "HAMMER_CURL")),
                ("ACCESSORY_ISOLATION","ARMS",      "TRICEPS_LONG",  "ISOLATION",pool("OVERHEAD_TRICEP_EXTENSION", "SKULL_CRUSHER")),
            ],
        },
        {  # Day 4 - Lower B (hinge focus)
            "name": "Lower B",
            "focus_groups": ["LEGS", "CORE"],
            "slots": [
                ("PRIMARY_COMPOUND",   "LEGS", "HAMSTRINGS", "COMPOUND", pool("BB_DEADLIFT", "RACK_PULL", "BB_RDL")),
                ("SECONDARY_COMPOUND", "LEGS", "QUADS",      "COMPOUND", pool("BB_FRONT_SQUAT", "HACK_SQUAT_MACHINE", "DB_GOBLET_SQUAT")),
                ("SECONDARY_COMPOUND", "LEGS", "GLUTES",     "COMPOUND", pool("BB_HIP_THRUST", "DB_WALKING_LUNGE")),
                ("ACCESSORY_ISOLATION","LEGS", "HAMSTRINGS", "ISOLATION",pool("LEG_CURL_MACHINE")),
                ("ACCESSORY_ISOLATION","LEGS", "QUADS",      "ISOLATION",pool("LEG_EXTENSION_MACHINE")),
                ("ACCESSORY_ISOLATION","LEGS", "CALVES",     "ISOLATION",pool("SEATED_CALF_RAISE", "STANDING_CALF_RAISE")),
                ("CORE_FINISHER",      "CORE", "OBLIQUES",   None,       pool("PALLOF_PRESS", "BAND_PALLOF_PRESS", "SIDE_PLANK")),
            ],
        },
    ],
}


PPL_5D_BLUEPRINT = {
    "name_prefix": "Push/Pull/Legs + Upper + Lower",
    "split_type": "PUSH_PULL_LEGS",
    "days_per_week": 5,
    "sessions": [
        {
            "name": "Push",
            "focus_groups": ["CHEST", "SHOULDERS", "ARMS"],
            "slots": [
                ("PRIMARY_COMPOUND",   "CHEST",     "MID_CHEST",     "COMPOUND", pool("BB_BENCH_PRESS", "DB_FLAT_BENCH_PRESS")),
                ("PRIMARY_COMPOUND",   "SHOULDERS", "FRONT_DELT",    "COMPOUND", pool("BB_OVERHEAD_PRESS", "DB_SHOULDER_PRESS", "ARNOLD_PRESS")),
                ("SECONDARY_COMPOUND", "CHEST",     "UPPER_CHEST",   "COMPOUND", pool("BB_INCLINE_BENCH_PRESS", "DB_INCLINE_BENCH_PRESS")),
                ("ACCESSORY_ISOLATION","CHEST",     "MID_CHEST",     "ISOLATION",pool("PEC_DECK_FLY", "CABLE_CHEST_FLY", "DB_INCLINE_FLY")),
                ("ACCESSORY_ISOLATION","SHOULDERS", "SIDE_DELT",     "ISOLATION",pool("DB_LATERAL_RAISE", "CABLE_LATERAL_RAISE")),
                ("ACCESSORY_ISOLATION","ARMS",      "TRICEPS_LATERAL","ISOLATION",pool("CABLE_TRICEP_PUSHDOWN", "SKULL_CRUSHER", "DB_TRICEPS_KICKBACK")),
            ],
        },
        {
            "name": "Pull",
            "focus_groups": ["BACK", "ARMS"],
            "slots": [
                ("PRIMARY_COMPOUND",   "BACK", "LOWER_BACK",    "COMPOUND", pool("BB_DEADLIFT", "RACK_PULL")),
                ("PRIMARY_COMPOUND",   "BACK", "LATS_WIDTH",    "COMPOUND", pool("PULL_UP", "LAT_PULLDOWN_WIDE", "CHIN_UP")),
                ("SECONDARY_COMPOUND", "BACK", "LATS_THICKNESS","COMPOUND", pool("BB_BENT_OVER_ROW", "DB_ONE_ARM_ROW", "T_BAR_ROW")),
                ("ACCESSORY_ISOLATION","SHOULDERS","REAR_DELT", "ISOLATION",pool("CABLE_FACE_PULL", "DB_REAR_DELT_FLY")),
                ("ACCESSORY_ISOLATION","ARMS", "BICEPS_LONG",   "ISOLATION",pool("INCLINE_DB_CURL", "HAMMER_CURL")),
                ("ACCESSORY_ISOLATION","ARMS", "BICEPS_SHORT",  "ISOLATION",pool("BB_CURL", "PREACHER_CURL", "DB_CURL")),
            ],
        },
        {
            "name": "Legs",
            "focus_groups": ["LEGS", "CORE"],
            "slots": [
                ("PRIMARY_COMPOUND",   "LEGS", "QUADS",      "COMPOUND", pool("BB_BACK_SQUAT", "BB_FRONT_SQUAT")),
                ("SECONDARY_COMPOUND", "LEGS", "HAMSTRINGS", "COMPOUND", pool("BB_RDL", "DB_RDL")),
                ("SECONDARY_COMPOUND", "LEGS", "GLUTES",     "COMPOUND", pool("BB_HIP_THRUST", "DB_WALKING_LUNGE", "BULGARIAN_SPLIT_SQUAT")),
                ("ACCESSORY_ISOLATION","LEGS", "QUADS",      "ISOLATION",pool("LEG_EXTENSION_MACHINE")),
                ("ACCESSORY_ISOLATION","LEGS", "HAMSTRINGS", "ISOLATION",pool("LEG_CURL_MACHINE")),
                ("ACCESSORY_ISOLATION","LEGS", "CALVES",     "ISOLATION",pool("STANDING_CALF_RAISE", "SEATED_CALF_RAISE")),
                ("CORE_FINISHER",      "CORE", "TRANSVERSE", None,       pool("PLANK", "AB_WHEEL_ROLLOUT")),
            ],
        },
        {  # Day 4 - Upper: extra recovery-friendly upper session
            "name": "Upper (Volume)",
            "focus_groups": ["CHEST", "BACK", "SHOULDERS", "ARMS"],
            "slots": [
                ("SECONDARY_COMPOUND", "CHEST",     "MID_CHEST",   "COMPOUND", pool("DB_FLAT_BENCH_PRESS", "PUSH_UP")),
                ("SECONDARY_COMPOUND", "BACK",      "MID_BACK",    "COMPOUND", pool("SEATED_CABLE_ROW", "DB_ONE_ARM_ROW")),
                ("ACCESSORY_ISOLATION","SHOULDERS", "SIDE_DELT",   "ISOLATION",pool("CABLE_LATERAL_RAISE", "DB_LATERAL_RAISE")),
                ("ACCESSORY_ISOLATION","SHOULDERS", "REAR_DELT",   "ISOLATION",pool("DB_REAR_DELT_FLY", "CABLE_FACE_PULL")),
                ("ACCESSORY_ISOLATION","ARMS",      "BICEPS_SHORT","ISOLATION",pool("PREACHER_CURL", "BB_CURL")),
                ("ACCESSORY_ISOLATION","ARMS",      "TRICEPS_LONG","ISOLATION",pool("OVERHEAD_TRICEP_EXTENSION", "SKULL_CRUSHER")),
            ],
        },
        {  # Day 5 - Lower: posterior chain focus
            "name": "Lower (Posterior)",
            "focus_groups": ["LEGS", "CORE"],
            "slots": [
                ("PRIMARY_COMPOUND",   "LEGS", "HAMSTRINGS", "COMPOUND", pool("BB_RDL", "DB_RDL")),
                ("SECONDARY_COMPOUND", "LEGS", "GLUTES",     "COMPOUND", pool("BB_HIP_THRUST", "BULGARIAN_SPLIT_SQUAT")),
                ("SECONDARY_COMPOUND", "LEGS", "QUADS",      "COMPOUND", pool("LEG_PRESS", "HACK_SQUAT_MACHINE", "DB_GOBLET_SQUAT")),
                ("ACCESSORY_ISOLATION","LEGS", "HAMSTRINGS", "ISOLATION",pool("LEG_CURL_MACHINE")),
                ("ACCESSORY_ISOLATION","LEGS", "CALVES",     "ISOLATION",pool("SEATED_CALF_RAISE", "STANDING_CALF_RAISE")),
                ("CORE_FINISHER",      "CORE", "OBLIQUES",   None,       pool("PALLOF_PRESS", "BAND_PALLOF_PRESS", "SIDE_PLANK")),
            ],
        },
    ],
}


PPL_6D_BLUEPRINT = {
    "name_prefix": "Push/Pull/Legs x2",
    "split_type": "PUSH_PULL_LEGS",
    "days_per_week": 6,
    "sessions": [
        # Days 1-3 = strength/heavy
        {
            "name": "Push (Heavy)",
            "focus_groups": ["CHEST", "SHOULDERS", "ARMS"],
            "slots": [
                ("PRIMARY_COMPOUND",   "CHEST",     "MID_CHEST",    "COMPOUND", pool("BB_BENCH_PRESS")),
                ("PRIMARY_COMPOUND",   "SHOULDERS", "FRONT_DELT",   "COMPOUND", pool("BB_OVERHEAD_PRESS", "DB_SHOULDER_PRESS")),
                ("SECONDARY_COMPOUND", "CHEST",     "UPPER_CHEST",  "COMPOUND", pool("BB_INCLINE_BENCH_PRESS", "DB_INCLINE_BENCH_PRESS")),
                ("ACCESSORY_ISOLATION","SHOULDERS", "SIDE_DELT",    "ISOLATION",pool("DB_LATERAL_RAISE")),
                ("ACCESSORY_ISOLATION","ARMS",      "TRICEPS_LATERAL","ISOLATION",pool("CABLE_TRICEP_PUSHDOWN", "SKULL_CRUSHER")),
            ],
        },
        {
            "name": "Pull (Heavy)",
            "focus_groups": ["BACK", "ARMS"],
            "slots": [
                ("PRIMARY_COMPOUND",   "BACK", "LOWER_BACK",    "COMPOUND", pool("BB_DEADLIFT")),
                ("PRIMARY_COMPOUND",   "BACK", "LATS_WIDTH",    "COMPOUND", pool("PULL_UP", "LAT_PULLDOWN_WIDE")),
                ("SECONDARY_COMPOUND", "BACK", "LATS_THICKNESS","COMPOUND", pool("BB_BENT_OVER_ROW", "T_BAR_ROW")),
                ("ACCESSORY_ISOLATION","SHOULDERS","REAR_DELT", "ISOLATION",pool("CABLE_FACE_PULL")),
                ("ACCESSORY_ISOLATION","ARMS", "BICEPS_SHORT",  "ISOLATION",pool("BB_CURL", "PREACHER_CURL")),
            ],
        },
        {
            "name": "Legs (Heavy)",
            "focus_groups": ["LEGS", "CORE"],
            "slots": [
                ("PRIMARY_COMPOUND",   "LEGS", "QUADS",      "COMPOUND", pool("BB_BACK_SQUAT")),
                ("SECONDARY_COMPOUND", "LEGS", "HAMSTRINGS", "COMPOUND", pool("BB_RDL")),
                ("SECONDARY_COMPOUND", "LEGS", "GLUTES",     "COMPOUND", pool("BB_HIP_THRUST")),
                ("ACCESSORY_ISOLATION","LEGS", "QUADS",      "ISOLATION",pool("LEG_EXTENSION_MACHINE")),
                ("ACCESSORY_ISOLATION","LEGS", "CALVES",     "ISOLATION",pool("STANDING_CALF_RAISE")),
                ("CORE_FINISHER",      "CORE", "TRANSVERSE", None,       pool("PLANK", "AB_WHEEL_ROLLOUT")),
            ],
        },
        # Days 4-6 = volume/light
        {
            "name": "Push (Volume)",
            "focus_groups": ["CHEST", "SHOULDERS", "ARMS"],
            "slots": [
                ("SECONDARY_COMPOUND", "CHEST",     "UPPER_CHEST", "COMPOUND", pool("DB_INCLINE_BENCH_PRESS", "BB_INCLINE_BENCH_PRESS")),
                ("SECONDARY_COMPOUND", "CHEST",     "LOWER_CHEST", "COMPOUND", pool("DIP_CHEST", "BB_DECLINE_BENCH_PRESS")),
                ("ACCESSORY_ISOLATION","CHEST",     "MID_CHEST",   "ISOLATION",pool("PEC_DECK_FLY", "CABLE_CHEST_FLY")),
                ("ACCESSORY_ISOLATION","SHOULDERS", "SIDE_DELT",   "ISOLATION",pool("CABLE_LATERAL_RAISE", "DB_LATERAL_RAISE")),
                ("ACCESSORY_ISOLATION","ARMS",      "TRICEPS_LONG","ISOLATION",pool("OVERHEAD_TRICEP_EXTENSION", "SKULL_CRUSHER")),
            ],
        },
        {
            "name": "Pull (Volume)",
            "focus_groups": ["BACK", "ARMS"],
            "slots": [
                ("SECONDARY_COMPOUND", "BACK", "MID_BACK",      "COMPOUND", pool("SEATED_CABLE_ROW", "DB_ONE_ARM_ROW")),
                ("SECONDARY_COMPOUND", "BACK", "LATS_WIDTH",    "COMPOUND", pool("CHIN_UP", "LAT_PULLDOWN_WIDE")),
                ("ACCESSORY_ISOLATION","BACK", "UPPER_TRAPS",   "ISOLATION",pool("BB_SHRUG")),
                ("ACCESSORY_ISOLATION","ARMS", "BICEPS_LONG",   "ISOLATION",pool("INCLINE_DB_CURL", "HAMMER_CURL")),
                ("ACCESSORY_ISOLATION","ARMS", "BRACHIALIS",    "ISOLATION",pool("HAMMER_CURL")),
            ],
        },
        {
            "name": "Legs (Volume)",
            "focus_groups": ["LEGS", "CORE"],
            "slots": [
                ("SECONDARY_COMPOUND", "LEGS", "QUADS",      "COMPOUND", pool("LEG_PRESS", "HACK_SQUAT_MACHINE", "DB_GOBLET_SQUAT")),
                ("SECONDARY_COMPOUND", "LEGS", "HAMSTRINGS", "COMPOUND", pool("DB_RDL")),
                ("ACCESSORY_ISOLATION","LEGS", "GLUTES",     "ISOLATION",pool("BULGARIAN_SPLIT_SQUAT", "DB_WALKING_LUNGE")),
                ("ACCESSORY_ISOLATION","LEGS", "HAMSTRINGS", "ISOLATION",pool("LEG_CURL_MACHINE")),
                ("ACCESSORY_ISOLATION","LEGS", "CALVES",     "ISOLATION",pool("SEATED_CALF_RAISE")),
                ("CORE_FINISHER",      "CORE", "OBLIQUES",   None,       pool("PALLOF_PRESS", "BAND_PALLOF_PRESS")),
            ],
        },
    ],
}


BLUEPRINTS = [FULL_BODY_BLUEPRINT, UPPER_LOWER_BLUEPRINT, PPL_5D_BLUEPRINT, PPL_6D_BLUEPRINT]


# Body-type modifier: slot_count_mult (mirrors training_algorithm_rules §3 volume_mult)
BODY_TYPE_VOLUME_MULT = {"ECTOMORPH": 0.85, "MESOMORPH": 1.00, "ENDOMORPH": 1.15}

# Goal-driven slot filtering: which roles are emphasized vs. trimmed.
GOAL_PROFILE = {
    "STRENGTH":     {"compound_keep_factor": 1.00, "isolation_keep_factor": 0.50, "finisher_keep": False},
    "HYPERTROPHY":  {"compound_keep_factor": 1.00, "isolation_keep_factor": 1.00, "finisher_keep": True},
    "ENDURANCE":    {"compound_keep_factor": 0.75, "isolation_keep_factor": 1.10, "finisher_keep": True},
}


def template_id(split_short, body, goal, days):
    short_map = {"FULL_BODY": "FB", "UPPER_LOWER": "UL", "PUSH_PULL_LEGS": "PPL"}
    body_map  = {"ECTOMORPH": "ECTO", "MESOMORPH": "MESO", "ENDOMORPH": "ENDO"}
    goal_map  = {"STRENGTH": "STR", "HYPERTROPHY": "HYP", "ENDURANCE": "END"}
    return f"{short_map[split_short]}_{body_map[body]}_{goal_map[goal]}_{days}D"


def build_template(blueprint, body, goal):
    vmult = BODY_TYPE_VOLUME_MULT[body]
    gprof = GOAL_PROFILE[goal]

    sessions_out = []
    for d_idx, sess in enumerate(blueprint["sessions"], start=1):
        compound_slots  = [s for s in sess["slots"] if s[0] in ("PRIMARY_COMPOUND", "SECONDARY_COMPOUND")]
        isolation_slots = [s for s in sess["slots"] if s[0] == "ACCESSORY_ISOLATION"]
        finisher_slots  = [s for s in sess["slots"] if s[0] in ("FINISHER", "CORE_FINISHER", "CONDITIONING")]

        def keep_count(items, factor):
            # Apply both body type and goal modifier; round half-up; minimum 1 if list non-empty.
            if not items:
                return 0
            target = round(len(items) * vmult * factor)
            if target < 1 and len(items) >= 1:
                target = 1
            return min(target, len(items))

        kept_comp = compound_slots[:keep_count(compound_slots,  gprof["compound_keep_factor"])]
        kept_iso  = isolation_slots[:keep_count(isolation_slots, gprof["isolation_keep_factor"])]
        kept_fin  = finisher_slots if gprof["finisher_keep"] else []

        ordered = kept_comp + kept_iso + kept_fin
        # Ensure minimum 3 slots per session (schema requirement).
        if len(ordered) < 3:
            # Pad from the original session in original order, skipping duplicates.
            for s in sess["slots"]:
                if s not in ordered:
                    ordered.append(s)
                if len(ordered) >= 3:
                    break

        slots_out = []
        for i, (role, mg, zone, mech, candidates) in enumerate(ordered, start=1):
            slot = {
                "slot_id": i,
                "role": role,
                "muscle_group": mg,
                "zone": zone,
                "required_mechanics": mech,
                "candidate_pool": candidates,
                "superset_with_slot_id": None,
            }
            slots_out.append(slot)

        sessions_out.append({
            "day_index": d_idx,
            "name": sess["name"],
            "focus_groups": sess["focus_groups"],
            "slots": slots_out,
        })

    tpl_id = template_id(blueprint["split_type"], body, goal, blueprint["days_per_week"])
    return {
        "id": tpl_id,
        "split_type": blueprint["split_type"],
        "days_per_week": blueprint["days_per_week"],
        "target_body_type": body,
        "target_goal": goal,
        "target_experience": ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
        "mesocycle_weeks": 4,
        "sessions": sessions_out,
    }


# ---------------------------------------------------------------------------
# Validation harness (against Stage 1 schemas)
# ---------------------------------------------------------------------------

def load_schema(name):
    with open(SCHEMAS / name, "r", encoding="utf-8") as fh:
        return json.load(fh)


def validate_each(objs, schema, label):
    import jsonschema
    errors = []
    for i, obj in enumerate(objs):
        try:
            jsonschema.validate(obj, schema)
        except jsonschema.ValidationError as e:
            errors.append(f"  [{label} #{i} id={obj.get('id','?')}] {e.message} at path {list(e.absolute_path)}")
    if errors:
        print(f"\nVALIDATION FAILED ({label}):")
        for line in errors:
            print(line)
        return False
    print(f"  {label}: {len(objs)} objects valid")
    return True


def main():
    DATA.mkdir(exist_ok=True)

    print("Building exercises...")
    with open(DATA / "exercises.seed.json", "w", encoding="utf-8") as fh:
        json.dump(EXERCISES, fh, indent=2, ensure_ascii=False)
    print(f"  wrote {len(EXERCISES)} exercises")

    print("Building muscle groups...")
    with open(DATA / "muscle-groups.seed.json", "w", encoding="utf-8") as fh:
        json.dump(MUSCLE_GROUPS, fh, indent=2, ensure_ascii=False)
    print(f"  wrote {len(MUSCLE_GROUPS)} muscle groups")

    print("Building workout templates (4 splits x 3 body x 3 goals)...")
    templates = []
    for bp in BLUEPRINTS:
        for body in ("ECTOMORPH", "MESOMORPH", "ENDOMORPH"):
            for goal in ("STRENGTH", "HYPERTROPHY", "ENDURANCE"):
                templates.append(build_template(bp, body, goal))
    with open(DATA / "workout-templates.seed.json", "w", encoding="utf-8") as fh:
        json.dump(templates, fh, indent=2, ensure_ascii=False)
    print(f"  wrote {len(templates)} templates")

    print("Writing seed metadata...")
    meta = {
        "seed_version": SEED_VERSION,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "exercise_count": len(EXERCISES),
        "muscle_group_count": len(MUSCLE_GROUPS),
        "template_count": len(templates),
        "goals":      ["STRENGTH", "HYPERTROPHY", "ENDURANCE"],
        "body_types": ["ECTOMORPH", "MESOMORPH", "ENDOMORPH"],
        "splits":     ["FULL_BODY", "UPPER_LOWER", "PUSH_PULL_LEGS"],
    }
    with open(DATA / "seed.meta.json", "w", encoding="utf-8") as fh:
        json.dump(meta, fh, indent=2, ensure_ascii=False)

    print("\nValidating against Stage 1 schemas...")
    ok = True
    ok &= validate_each(EXERCISES,      load_schema("exercise.schema.json"),         "Exercise")
    ok &= validate_each(MUSCLE_GROUPS,  load_schema("muscle-group.schema.json"),     "MuscleGroup")
    ok &= validate_each(templates,      load_schema("workout-template.schema.json"), "WorkoutTemplate")

    # Cross-reference: every candidate_pool ID exists in EXERCISES; every
    # exercise's primary_target_zone is a valid zone of its primary_muscle_group;
    # every swap_candidate exists.
    print("\nCross-reference checks...")
    cross_errors = []
    zone_map = {mg["id"]: {z["id"] for z in mg["target_zones"]} for mg in MUSCLE_GROUPS}
    for ex in EXERCISES:
        valid_zones = zone_map.get(ex["primary_muscle_group"], set())
        if ex["primary_target_zone"] not in valid_zones:
            cross_errors.append(f"  Exercise {ex['id']}: zone {ex['primary_target_zone']} not in {ex['primary_muscle_group']}")
        for sc in ex.get("swap_candidates", []):
            if sc not in EX_IDS:
                cross_errors.append(f"  Exercise {ex['id']}: unknown swap_candidate {sc}")
    for tpl in templates:
        for sess in tpl["sessions"]:
            for slot in sess["slots"]:
                for cid in slot["candidate_pool"]:
                    if cid not in EX_IDS:
                        cross_errors.append(f"  Template {tpl['id']} session {sess['day_index']} slot {slot['slot_id']}: unknown {cid}")
    if cross_errors:
        ok = False
        print("\nCROSS-REFERENCE FAILED:")
        for line in cross_errors:
            print(line)
    else:
        print("  All references resolve.")

    # Coverage check: HOME_INTERMEDIATE, HOME_ADVANCED, COMMERCIAL_GYM
    print("\nCoverage check per equipment kit...")
    KITS = {
        "HOME_INTERMEDIATE": {"BODYWEIGHT", "RESISTANCE_BAND", "PULL_UP_BAR", "DUMBBELL", "BENCH"},
        "HOME_ADVANCED":     {"BODYWEIGHT", "RESISTANCE_BAND", "PULL_UP_BAR", "DUMBBELL", "BENCH",
                              "BARBELL", "RACK", "EZ_BAR"},
        "COMMERCIAL_GYM":    {"BODYWEIGHT", "RESISTANCE_BAND", "PULL_UP_BAR", "DUMBBELL", "KETTLEBELL",
                              "BENCH", "DIP_BAR", "EZ_BAR", "BARBELL", "RACK", "TRAP_BAR",
                              "CABLE", "SMITH_MACHINE", "PLATE_LOADED_MACHINE", "SELECTORIZED_MACHINE",
                              "LEG_PRESS", "HACK_SQUAT", "LEG_CURL", "LEG_EXTENSION", "CALF_RAISE_MACHINE",
                              "LAT_PULLDOWN", "SEATED_ROW"},
    }
    MIN_PER_GROUP = {"CHEST": 2, "BACK": 2, "SHOULDERS": 2, "ARMS": 2, "LEGS": 3, "CORE": 2}
    cov_errors = []
    for kit, equip in KITS.items():
        for grp, minimum in MIN_PER_GROUP.items():
            usable = [
                e for e in EXERCISES
                if e["primary_muscle_group"] == grp and set(e["required_equipment"]).issubset(equip)
            ]
            if len(usable) < minimum:
                cov_errors.append(f"  Kit {kit} / group {grp}: have {len(usable)}, need {minimum}")
            else:
                print(f"  {kit:>18s} / {grp:<10s}: {len(usable):>2d} usable (>= {minimum})")
    if cov_errors:
        ok = False
        print("\nCOVERAGE FAILED:")
        for line in cov_errors:
            print(line)

    print("\nDONE. Status:", "OK" if ok else "FAIL")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
