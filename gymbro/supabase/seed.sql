-- =============================================================================
-- GymBro — Seed Data
-- Run AFTER 001_initial_schema.sql
-- =============================================================================

-- =============================================================================
-- MUSCLE GROUPS
-- =============================================================================
INSERT INTO muscle_groups (id, name, slug, color) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Chest',      'chest',      '#E94560'),
  ('11111111-0000-0000-0000-000000000002', 'Back',       'back',       '#3B82F6'),
  ('11111111-0000-0000-0000-000000000003', 'Legs',       'legs',       '#22C55E'),
  ('11111111-0000-0000-0000-000000000004', 'Shoulders',  'shoulders',  '#F59E0B'),
  ('11111111-0000-0000-0000-000000000005', 'Arms',       'arms',       '#7C3AED'),
  ('11111111-0000-0000-0000-000000000006', 'Core',       'core',       '#EC4899');

-- =============================================================================
-- EXERCISES  (24 total — 4 per muscle group)
-- =============================================================================

-- ---- CHEST ----
INSERT INTO exercises (id, name, slug, description, instructions, difficulty, equipment, primary_muscle_group_id, secondary_muscle_group_ids) VALUES
(
  'eeeeeeee-0001-0000-0000-000000000001',
  'Barbell Bench Press', 'barbell-bench-press',
  'The foundational compound chest movement. Builds overall chest mass, front deltoids, and triceps.',
  ARRAY[
    'Lie flat on a bench with your eyes under the bar.',
    'Grip the bar slightly wider than shoulder-width, thumbs wrapped around.',
    'Unrack the bar and position it over your mid-chest.',
    'Lower the bar with control until it lightly touches your chest.',
    'Press explosively back to the start, locking out elbows at the top.'
  ],
  'intermediate', ARRAY['barbell'],
  '11111111-0000-0000-0000-000000000001',
  ARRAY['11111111-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000005']
),
(
  'eeeeeeee-0001-0000-0000-000000000002',
  'Incline Dumbbell Press', 'incline-dumbbell-press',
  'Targets the upper chest and front deltoids with a greater range of motion than the barbell variation.',
  ARRAY[
    'Set the bench to a 30–45° incline.',
    'Hold a dumbbell in each hand at shoulder height, palms facing forward.',
    'Press the dumbbells up until your arms are fully extended.',
    'Slowly lower back to the start position.',
    'Keep your shoulder blades retracted throughout.'
  ],
  'beginner', ARRAY['dumbbell'],
  '11111111-0000-0000-0000-000000000001',
  ARRAY['11111111-0000-0000-0000-000000000004']
),
(
  'eeeeeeee-0001-0000-0000-000000000003',
  'Cable Fly', 'cable-fly',
  'An isolation movement providing constant tension throughout the chest stretch and contraction.',
  ARRAY[
    'Set both cable pulleys to chest height.',
    'Stand in the center, grab both handles with a slight bend in the elbows.',
    'Bring both hands together in front of your chest in an arc.',
    'Squeeze the chest at peak contraction.',
    'Slowly return to the starting position with control.'
  ],
  'beginner', ARRAY['cable'],
  '11111111-0000-0000-0000-000000000001',
  ARRAY[]::UUID[]
),
(
  'eeeeeeee-0001-0000-0000-000000000004',
  'Push-Up', 'push-up',
  'A bodyweight classic that builds chest, triceps, and core stability.',
  ARRAY[
    'Start in a high plank with hands slightly wider than shoulder-width.',
    'Keep your body in a straight line from head to heels.',
    'Lower your chest to the floor, elbows at roughly 45° from your torso.',
    'Push back up to full arm extension.',
    'Avoid sagging the hips or shrugging the shoulders.'
  ],
  'beginner', ARRAY['bodyweight'],
  '11111111-0000-0000-0000-000000000001',
  ARRAY['11111111-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000006']
);

-- ---- BACK ----
INSERT INTO exercises (id, name, slug, description, instructions, difficulty, equipment, primary_muscle_group_id, secondary_muscle_group_ids) VALUES
(
  'eeeeeeee-0002-0000-0000-000000000001',
  'Conventional Deadlift', 'conventional-deadlift',
  'The king of all back exercises. Builds total-body strength with emphasis on the entire posterior chain.',
  ARRAY[
    'Stand with feet hip-width apart, bar over mid-foot.',
    'Hinge at the hips and grip the bar just outside your legs.',
    'Take a deep breath, brace your core, and pull your chest up.',
    'Drive through the floor and extend hips and knees simultaneously.',
    'Lock out at the top, then hinge back down with control.'
  ],
  'intermediate', ARRAY['barbell'],
  '11111111-0000-0000-0000-000000000002',
  ARRAY['11111111-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000006']
),
(
  'eeeeeeee-0002-0000-0000-000000000002',
  'Pull-Up', 'pull-up',
  'The ultimate vertical pulling movement for building lat width and upper-back thickness.',
  ARRAY[
    'Hang from a bar with an overhand grip, slightly wider than shoulders.',
    'Pull your shoulder blades down and back (depress and retract).',
    'Pull yourself up until your chin clears the bar.',
    'Slowly lower back to a full dead hang.',
    'Avoid kipping — control the movement throughout.'
  ],
  'intermediate', ARRAY['bodyweight'],
  '11111111-0000-0000-0000-000000000002',
  ARRAY['11111111-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004']
),
(
  'eeeeeeee-0002-0000-0000-000000000003',
  'Barbell Row', 'barbell-row',
  'A horizontal pulling compound that thickens the mid-back and lats.',
  ARRAY[
    'Stand with feet hip-width apart and hinge forward to about 45°.',
    'Grip the bar with an overhand grip slightly outside shoulder width.',
    'Pull the bar into your lower chest/upper abdomen.',
    'Squeeze the shoulder blades together at the top.',
    'Lower the bar with full control back to the start.'
  ],
  'intermediate', ARRAY['barbell'],
  '11111111-0000-0000-0000-000000000002',
  ARRAY['11111111-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000006']
),
(
  'eeeeeeee-0002-0000-0000-000000000004',
  'Lat Pulldown', 'lat-pulldown',
  'A machine/cable vertical pull that develops lat width, ideal for beginners building toward pull-ups.',
  ARRAY[
    'Sit at the lat pulldown machine and adjust the knee pad.',
    'Grip the bar wider than shoulder-width with an overhand grip.',
    'Lean back slightly and pull the bar down to your upper chest.',
    'Squeeze the lats at the bottom of the movement.',
    'Slowly return the bar to the top under full control.'
  ],
  'beginner', ARRAY['cable', 'machine'],
  '11111111-0000-0000-0000-000000000002',
  ARRAY['11111111-0000-0000-0000-000000000005']
);

-- ---- LEGS ----
INSERT INTO exercises (id, name, slug, description, instructions, difficulty, equipment, primary_muscle_group_id, secondary_muscle_group_ids) VALUES
(
  'eeeeeeee-0003-0000-0000-000000000001',
  'Barbell Back Squat', 'barbell-back-squat',
  'The foundational lower-body compound. Builds quad, glute, and hamstring mass simultaneously.',
  ARRAY[
    'Set the bar at upper-chest height in the rack. Step under and brace the bar across your traps.',
    'Step back, feet shoulder-width apart, toes slightly out.',
    'Take a deep breath, brace your core, and squat down until hips are at or below parallel.',
    'Drive through your heels to stand back up.',
    'Keep your chest up and knees tracking over your toes throughout.'
  ],
  'intermediate', ARRAY['barbell'],
  '11111111-0000-0000-0000-000000000003',
  ARRAY['11111111-0000-0000-0000-000000000006']
),
(
  'eeeeeeee-0003-0000-0000-000000000002',
  'Romanian Deadlift', 'romanian-deadlift',
  'A hip-hinge variation that isolates the hamstrings and glutes through a long range of motion.',
  ARRAY[
    'Stand holding a barbell at hip level with an overhand grip.',
    'With a soft bend in the knees, push your hips back and lower the bar along your legs.',
    'Feel a deep stretch in the hamstrings at the bottom.',
    'Drive hips forward to return to the start.',
    'Keep your back flat and core braced the entire time.'
  ],
  'intermediate', ARRAY['barbell'],
  '11111111-0000-0000-0000-000000000003',
  ARRAY['11111111-0000-0000-0000-000000000002']
),
(
  'eeeeeeee-0003-0000-0000-000000000003',
  'Leg Press', 'leg-press',
  'A machine compound that lets you load the quads and glutes heavily with minimal lower-back stress.',
  ARRAY[
    'Sit in the leg press machine with feet shoulder-width on the platform.',
    'Lower the platform until your knees are at 90° or slightly below.',
    'Press the weight away by extending your knees and hips.',
    'Do not lock out the knees at the top.',
    'Keep your lower back pressed into the seat throughout.'
  ],
  'beginner', ARRAY['machine'],
  '11111111-0000-0000-0000-000000000003',
  ARRAY[]::UUID[]
),
(
  'eeeeeeee-0003-0000-0000-000000000004',
  'Leg Curl', 'leg-curl',
  'An isolation exercise for the hamstrings performed on a lying or seated curl machine.',
  ARRAY[
    'Lie face-down on the leg curl machine, ankles under the pad.',
    'Curl your legs up toward your glutes as far as possible.',
    'Squeeze the hamstrings at peak contraction.',
    'Slowly lower back to the start position.',
    'Avoid lifting your hips off the pad.'
  ],
  'beginner', ARRAY['machine'],
  '11111111-0000-0000-0000-000000000003',
  ARRAY[]::UUID[]
);

-- ---- SHOULDERS ----
INSERT INTO exercises (id, name, slug, description, instructions, difficulty, equipment, primary_muscle_group_id, secondary_muscle_group_ids) VALUES
(
  'eeeeeeee-0004-0000-0000-000000000001',
  'Overhead Press', 'overhead-press',
  'The primary shoulder compound. Builds front and lateral delts, upper chest, and triceps.',
  ARRAY[
    'Stand with feet shoulder-width apart, bar in a front rack position.',
    'Brace your core and glutes tightly.',
    'Press the bar straight overhead until arms are fully extended.',
    'Bring your head slightly forward as the bar passes your face.',
    'Lower the bar back to the rack position with control.'
  ],
  'intermediate', ARRAY['barbell'],
  '11111111-0000-0000-0000-000000000004',
  ARRAY['11111111-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001']
),
(
  'eeeeeeee-0004-0000-0000-000000000002',
  'Dumbbell Lateral Raise', 'dumbbell-lateral-raise',
  'The best lateral deltoid isolation exercise for building shoulder width.',
  ARRAY[
    'Stand with a dumbbell in each hand at your sides.',
    'With a slight bend in the elbows, raise both arms out to the sides.',
    'Stop when your hands are at shoulder height.',
    'Pause briefly, then lower with control.',
    'Lead with your elbows, not your wrists.'
  ],
  'beginner', ARRAY['dumbbell'],
  '11111111-0000-0000-0000-000000000004',
  ARRAY[]::UUID[]
),
(
  'eeeeeeee-0004-0000-0000-000000000003',
  'Face Pull', 'face-pull',
  'A cable exercise that targets the rear delts and rotator cuff, essential for shoulder health.',
  ARRAY[
    'Attach a rope to a high cable pulley.',
    'Grasp both ends of the rope with an overhand grip.',
    'Pull the rope toward your face, flaring your elbows wide.',
    'Externally rotate at the end so your hands end up beside your ears.',
    'Slowly return to the start position.'
  ],
  'beginner', ARRAY['cable'],
  '11111111-0000-0000-0000-000000000004',
  ARRAY['11111111-0000-0000-0000-000000000002']
),
(
  'eeeeeeee-0004-0000-0000-000000000004',
  'Arnold Press', 'arnold-press',
  'A dumbbell shoulder press variation that hits all three delt heads through rotation.',
  ARRAY[
    'Sit with dumbbells at shoulder height, palms facing you.',
    'Press the dumbbells up while rotating your palms forward.',
    'Fully extend arms overhead, palms now facing away from you.',
    'Reverse the motion on the way down.',
    'Keep your core braced and avoid arching your lower back.'
  ],
  'beginner', ARRAY['dumbbell'],
  '11111111-0000-0000-0000-000000000004',
  ARRAY['11111111-0000-0000-0000-000000000005']
);

-- ---- ARMS ----
INSERT INTO exercises (id, name, slug, description, instructions, difficulty, equipment, primary_muscle_group_id, secondary_muscle_group_ids) VALUES
(
  'eeeeeeee-0005-0000-0000-000000000001',
  'Barbell Curl', 'barbell-curl',
  'The foundational bicep exercise for building peak and overall arm size.',
  ARRAY[
    'Stand with feet shoulder-width apart, barbell held with an underhand grip.',
    'Pin your elbows to your sides — they should not move during the lift.',
    'Curl the bar up to shoulder height, squeezing the biceps at the top.',
    'Slowly lower back to full extension.',
    'Avoid swinging your torso to generate momentum.'
  ],
  'beginner', ARRAY['barbell'],
  '11111111-0000-0000-0000-000000000005',
  ARRAY[]::UUID[]
),
(
  'eeeeeeee-0005-0000-0000-000000000002',
  'Tricep Pushdown', 'tricep-pushdown',
  'A cable isolation exercise that effectively targets all three heads of the tricep.',
  ARRAY[
    'Attach a straight bar or rope to a high cable pulley.',
    'Stand close to the cable, elbows at your sides.',
    'Push the bar down until your arms are fully extended.',
    'Squeeze the triceps at the bottom.',
    'Slowly let the bar return to the start, keeping elbows stationary.'
  ],
  'beginner', ARRAY['cable'],
  '11111111-0000-0000-0000-000000000005',
  ARRAY[]::UUID[]
),
(
  'eeeeeeee-0005-0000-0000-000000000003',
  'Hammer Curl', 'hammer-curl',
  'A neutral-grip curl that develops the brachialis and brachioradialis for arm thickness.',
  ARRAY[
    'Hold dumbbells at your sides with a neutral (hammer) grip.',
    'Keeping elbows stationary, curl both dumbbells up to shoulder height.',
    'Squeeze at the top then lower with control.',
    'Alternate arms or curl both simultaneously.',
    'Keep your wrists neutral throughout — do not rotate.'
  ],
  'beginner', ARRAY['dumbbell'],
  '11111111-0000-0000-0000-000000000005',
  ARRAY[]::UUID[]
),
(
  'eeeeeeee-0005-0000-0000-000000000004',
  'Skull Crusher', 'skull-crusher',
  'A lying tricep extension that loads the long head through a full range of motion.',
  ARRAY[
    'Lie on a bench holding an EZ-bar or barbell above your chest with a narrow grip.',
    'Keeping upper arms vertical, lower the bar toward your forehead.',
    'Extend the elbows to press back to the start.',
    'Keep your upper arms perpendicular to the floor throughout.',
    'Lower slowly to protect the elbow joint.'
  ],
  'intermediate', ARRAY['barbell'],
  '11111111-0000-0000-0000-000000000005',
  ARRAY[]::UUID[]
);

-- ---- CORE ----
INSERT INTO exercises (id, name, slug, description, instructions, difficulty, equipment, primary_muscle_group_id, secondary_muscle_group_ids) VALUES
(
  'eeeeeeee-0006-0000-0000-000000000001',
  'Plank', 'plank',
  'An isometric hold that builds core stability, anti-extension strength, and total-body tension.',
  ARRAY[
    'Start in a push-up position on your forearms.',
    'Align elbows directly under your shoulders.',
    'Keep your body in a straight line from head to heels.',
    'Brace your abs, glutes, and quads simultaneously.',
    'Breathe steadily and hold the position for the prescribed duration.'
  ],
  'beginner', ARRAY['bodyweight'],
  '11111111-0000-0000-0000-000000000006',
  ARRAY[]::UUID[]
),
(
  'eeeeeeee-0006-0000-0000-000000000002',
  'Hanging Leg Raise', 'hanging-leg-raise',
  'A demanding exercise that works the lower abs and hip flexors through a full range of motion.',
  ARRAY[
    'Hang from a pull-up bar with an overhand grip.',
    'Brace your core and prevent your body from swinging.',
    'Raise your legs (knees slightly bent or straight) until parallel with the floor or higher.',
    'Pause briefly at the top.',
    'Lower your legs with control — do not drop them.'
  ],
  'intermediate', ARRAY['bodyweight'],
  '11111111-0000-0000-0000-000000000006',
  ARRAY[]::UUID[]
),
(
  'eeeeeeee-0006-0000-0000-000000000003',
  'Ab Wheel Rollout', 'ab-wheel-rollout',
  'One of the most effective ab exercises, training anti-extension strength through a long lever.',
  ARRAY[
    'Kneel on the floor, holding the ab wheel with both hands directly below your shoulders.',
    'Slowly roll the wheel forward, extending your hips and torso toward the floor.',
    'Keep your core braced and back flat — do not let your hips sag.',
    'Roll out as far as you can control, then pull back to the start.',
    'Beginners should limit the range of motion until stronger.'
  ],
  'advanced', ARRAY['other'],
  '11111111-0000-0000-0000-000000000006',
  ARRAY[]::UUID[]
),
(
  'eeeeeeee-0006-0000-0000-000000000004',
  'Russian Twist', 'russian-twist',
  'A rotational core exercise that develops the obliques and rotational stability.',
  ARRAY[
    'Sit on the floor with knees bent and feet slightly raised.',
    'Lean back slightly so your torso is at 45°.',
    'Hold a weight plate or medicine ball with both hands.',
    'Rotate your torso to the left, then to the right — that is one rep.',
    'Keep your core braced and move from the obliques, not the arms.'
  ],
  'beginner', ARRAY['bodyweight', 'other'],
  '11111111-0000-0000-0000-000000000006',
  ARRAY[]::UUID[]
);

-- =============================================================================
-- WORKOUT PROGRAMS
-- =============================================================================
INSERT INTO workout_programs (id, name, slug, description, difficulty, goal, duration_weeks, days_per_week, is_public) VALUES
(
  'pppppppp-0000-0000-0000-000000000001',
  'Beginner Full Body',
  'beginner-full-body',
  'A 3-day full-body program designed for beginners. Covers every major muscle group each session for maximum frequency and early gains.',
  'beginner', 'general_fitness', 8, 3
),
(
  'pppppppp-0000-0000-0000-000000000002',
  'PPL — Push Pull Legs',
  'push-pull-legs',
  'The classic 6-day split. Push days train chest, shoulders, triceps. Pull days train back and biceps. Leg days cover the entire lower body.',
  'intermediate', 'muscle_gain', 12, 6
),
(
  'pppppppp-0000-0000-0000-000000000003',
  'Strength Foundation',
  'strength-foundation',
  'A 4-day powerlifting-inspired program built around the squat, bench press, deadlift, and overhead press. Focuses on progressive overload and strength development.',
  'intermediate', 'strength', 16, 4
);

-- =============================================================================
-- WORKOUT DAYS
-- =============================================================================

-- ---- Beginner Full Body (3 days) ----
INSERT INTO workout_days (id, program_id, day_number, name, description) VALUES
  ('dddddddd-0001-0000-0000-000000000001', 'pppppppp-0000-0000-0000-000000000001', 1, 'Full Body A', 'Squat pattern + horizontal push + vertical pull'),
  ('dddddddd-0001-0000-0000-000000000002', 'pppppppp-0000-0000-0000-000000000001', 2, 'Full Body B', 'Hip hinge + incline push + horizontal pull'),
  ('dddddddd-0001-0000-0000-000000000003', 'pppppppp-0000-0000-0000-000000000001', 3, 'Full Body C', 'Leg press + bodyweight push + cable pull + core');

-- ---- PPL (6 days) ----
INSERT INTO workout_days (id, program_id, day_number, name, description) VALUES
  ('dddddddd-0002-0000-0000-000000000001', 'pppppppp-0000-0000-0000-000000000002', 1, 'Push A',  'Chest, front and lateral delts, triceps'),
  ('dddddddd-0002-0000-0000-000000000002', 'pppppppp-0000-0000-0000-000000000002', 2, 'Pull A',  'Back thickness and width, biceps'),
  ('dddddddd-0002-0000-0000-000000000003', 'pppppppp-0000-0000-0000-000000000002', 3, 'Legs A',  'Quad-focused lower body'),
  ('dddddddd-0002-0000-0000-000000000004', 'pppppppp-0000-0000-0000-000000000002', 4, 'Push B',  'Shoulder-focused push day'),
  ('dddddddd-0002-0000-0000-000000000005', 'pppppppp-0000-0000-0000-000000000002', 5, 'Pull B',  'Back width, rear delts, biceps'),
  ('dddddddd-0002-0000-0000-000000000006', 'pppppppp-0000-0000-0000-000000000002', 6, 'Legs B',  'Hamstring and glute focused');

-- ---- Strength Foundation (4 days) ----
INSERT INTO workout_days (id, program_id, day_number, name, description) VALUES
  ('dddddddd-0003-0000-0000-000000000001', 'pppppppp-0000-0000-0000-000000000003', 1, 'Squat Day',     'Heavy squats + accessory lower body'),
  ('dddddddd-0003-0000-0000-000000000002', 'pppppppp-0000-0000-0000-000000000003', 2, 'Bench Day',     'Heavy bench press + accessory upper body'),
  ('dddddddd-0003-0000-0000-000000000003', 'pppppppp-0000-0000-0000-000000000003', 3, 'Deadlift Day',  'Heavy deadlifts + back accessories'),
  ('dddddddd-0003-0000-0000-000000000004', 'pppppppp-0000-0000-0000-000000000003', 4, 'Press Day',     'Overhead press + shoulder and arm accessories');

-- =============================================================================
-- WORKOUT EXERCISES (prescribed sets/reps per day)
-- =============================================================================

-- ---- Full Body A ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0001-0000-0000-000000000001', 'eeeeeeee-0003-0000-0000-000000000001', 0, 3, 8,  12, 120), -- Squat
  ('dddddddd-0001-0000-0000-000000000001', 'eeeeeeee-0001-0000-0000-000000000001', 1, 3, 8,  12, 90),  -- Bench Press
  ('dddddddd-0001-0000-0000-000000000001', 'eeeeeeee-0002-0000-0000-000000000004', 2, 3, 10, 12, 90),  -- Lat Pulldown
  ('dddddddd-0001-0000-0000-000000000001', 'eeeeeeee-0004-0000-0000-000000000002', 3, 3, 12, 15, 60),  -- Lateral Raise
  ('dddddddd-0001-0000-0000-000000000001', 'eeeeeeee-0006-0000-0000-000000000001', 4, 3, NULL, NULL, 60); -- Plank (duration)

-- ---- Full Body B ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0001-0000-0000-000000000002', 'eeeeeeee-0003-0000-0000-000000000002', 0, 3, 8,  12, 120), -- Romanian DL
  ('dddddddd-0001-0000-0000-000000000002', 'eeeeeeee-0001-0000-0000-000000000002', 1, 3, 10, 12, 90),  -- Incline DB Press
  ('dddddddd-0001-0000-0000-000000000002', 'eeeeeeee-0002-0000-0000-000000000003', 2, 3, 8,  12, 90),  -- Barbell Row
  ('dddddddd-0001-0000-0000-000000000002', 'eeeeeeee-0005-0000-0000-000000000001', 3, 3, 10, 12, 60),  -- Barbell Curl
  ('dddddddd-0001-0000-0000-000000000002', 'eeeeeeee-0005-0000-0000-000000000002', 4, 3, 12, 15, 60);  -- Tricep Pushdown

-- ---- Full Body C ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0001-0000-0000-000000000003', 'eeeeeeee-0003-0000-0000-000000000003', 0, 3, 12, 15, 90),  -- Leg Press
  ('dddddddd-0001-0000-0000-000000000003', 'eeeeeeee-0003-0000-0000-000000000004', 1, 3, 12, 15, 60),  -- Leg Curl
  ('dddddddd-0001-0000-0000-000000000003', 'eeeeeeee-0001-0000-0000-000000000004', 2, 3, 12, 20, 60),  -- Push-Up
  ('dddddddd-0001-0000-0000-000000000003', 'eeeeeeee-0001-0000-0000-000000000003', 3, 3, 12, 15, 60),  -- Cable Fly
  ('dddddddd-0001-0000-0000-000000000003', 'eeeeeeee-0006-0000-0000-000000000004', 4, 3, 15, 20, 45);  -- Russian Twist

-- ---- PPL Push A ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0002-0000-0000-000000000001', 'eeeeeeee-0001-0000-0000-000000000001', 0, 4, 6,  10, 120), -- Bench Press
  ('dddddddd-0002-0000-0000-000000000001', 'eeeeeeee-0001-0000-0000-000000000002', 1, 3, 10, 12, 90),  -- Incline DB Press
  ('dddddddd-0002-0000-0000-000000000001', 'eeeeeeee-0004-0000-0000-000000000001', 2, 3, 8,  10, 90),  -- OHP
  ('dddddddd-0002-0000-0000-000000000001', 'eeeeeeee-0001-0000-0000-000000000003', 3, 3, 12, 15, 60),  -- Cable Fly
  ('dddddddd-0002-0000-0000-000000000001', 'eeeeeeee-0004-0000-0000-000000000002', 4, 4, 15, 20, 45),  -- Lateral Raise
  ('dddddddd-0002-0000-0000-000000000001', 'eeeeeeee-0005-0000-0000-000000000002', 5, 3, 12, 15, 60);  -- Tricep Pushdown

-- ---- PPL Pull A ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0002-0000-0000-000000000002', 'eeeeeeee-0002-0000-0000-000000000003', 0, 4, 6,  10, 120), -- Barbell Row
  ('dddddddd-0002-0000-0000-000000000002', 'eeeeeeee-0002-0000-0000-000000000002', 1, 3, 6,  10, 90),  -- Pull-Up
  ('dddddddd-0002-0000-0000-000000000002', 'eeeeeeee-0002-0000-0000-000000000004', 2, 3, 10, 12, 75),  -- Lat Pulldown
  ('dddddddd-0002-0000-0000-000000000002', 'eeeeeeee-0004-0000-0000-000000000003', 3, 3, 15, 20, 45),  -- Face Pull
  ('dddddddd-0002-0000-0000-000000000002', 'eeeeeeee-0005-0000-0000-000000000001', 4, 3, 10, 12, 60),  -- Barbell Curl
  ('dddddddd-0002-0000-0000-000000000002', 'eeeeeeee-0005-0000-0000-000000000003', 5, 3, 12, 15, 60);  -- Hammer Curl

-- ---- PPL Legs A ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0002-0000-0000-000000000003', 'eeeeeeee-0003-0000-0000-000000000001', 0, 4, 6,  10, 150), -- Squat
  ('dddddddd-0002-0000-0000-000000000003', 'eeeeeeee-0003-0000-0000-000000000003', 1, 3, 10, 12, 90),  -- Leg Press
  ('dddddddd-0002-0000-0000-000000000003', 'eeeeeeee-0003-0000-0000-000000000004', 2, 3, 12, 15, 60),  -- Leg Curl
  ('dddddddd-0002-0000-0000-000000000003', 'eeeeeeee-0006-0000-0000-000000000002', 3, 3, 10, 12, 60),  -- Hanging Leg Raise
  ('dddddddd-0002-0000-0000-000000000003', 'eeeeeeee-0006-0000-0000-000000000001', 4, 3, NULL, NULL, 60); -- Plank

-- ---- PPL Push B ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0002-0000-0000-000000000004', 'eeeeeeee-0004-0000-0000-000000000001', 0, 4, 6,  10, 120), -- OHP
  ('dddddddd-0002-0000-0000-000000000004', 'eeeeeeee-0004-0000-0000-000000000004', 1, 3, 10, 12, 75),  -- Arnold Press
  ('dddddddd-0002-0000-0000-000000000004', 'eeeeeeee-0001-0000-0000-000000000001', 2, 3, 10, 12, 90),  -- Bench Press
  ('dddddddd-0002-0000-0000-000000000004', 'eeeeeeee-0004-0000-0000-000000000002', 3, 4, 15, 20, 45),  -- Lateral Raise
  ('dddddddd-0002-0000-0000-000000000004', 'eeeeeeee-0005-0000-0000-000000000004', 4, 3, 10, 12, 60);  -- Skull Crusher

-- ---- PPL Pull B ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0002-0000-0000-000000000005', 'eeeeeeee-0002-0000-0000-000000000002', 0, 4, 6,  10, 90),  -- Pull-Up
  ('dddddddd-0002-0000-0000-000000000005', 'eeeeeeee-0002-0000-0000-000000000001', 1, 3, 6,  8,  120), -- Deadlift
  ('dddddddd-0002-0000-0000-000000000005', 'eeeeeeee-0002-0000-0000-000000000004', 2, 3, 10, 12, 75),  -- Lat Pulldown
  ('dddddddd-0002-0000-0000-000000000005', 'eeeeeeee-0004-0000-0000-000000000003', 3, 3, 15, 20, 45),  -- Face Pull
  ('dddddddd-0002-0000-0000-000000000005', 'eeeeeeee-0005-0000-0000-000000000003', 4, 4, 12, 15, 60);  -- Hammer Curl

-- ---- PPL Legs B ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0002-0000-0000-000000000006', 'eeeeeeee-0003-0000-0000-000000000002', 0, 4, 8,  12, 120), -- Romanian DL
  ('dddddddd-0002-0000-0000-000000000006', 'eeeeeeee-0003-0000-0000-000000000004', 1, 4, 10, 15, 75),  -- Leg Curl
  ('dddddddd-0002-0000-0000-000000000006', 'eeeeeeee-0003-0000-0000-000000000003', 2, 3, 12, 15, 90),  -- Leg Press
  ('dddddddd-0002-0000-0000-000000000006', 'eeeeeeee-0006-0000-0000-000000000004', 3, 3, 20, 25, 45),  -- Russian Twist
  ('dddddddd-0002-0000-0000-000000000006', 'eeeeeeee-0006-0000-0000-000000000003', 4, 3, 8,  10, 60);  -- Ab Wheel

-- ---- Strength — Squat Day ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0003-0000-0000-000000000001', 'eeeeeeee-0003-0000-0000-000000000001', 0, 5, 3,  5,  240), -- Squat (heavy)
  ('dddddddd-0003-0000-0000-000000000001', 'eeeeeeee-0003-0000-0000-000000000003', 1, 3, 8,  10, 120), -- Leg Press
  ('dddddddd-0003-0000-0000-000000000001', 'eeeeeeee-0003-0000-0000-000000000004', 2, 3, 10, 12, 90),  -- Leg Curl
  ('dddddddd-0003-0000-0000-000000000001', 'eeeeeeee-0006-0000-0000-000000000001', 3, 3, NULL, NULL, 60); -- Plank

-- ---- Strength — Bench Day ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0003-0000-0000-000000000002', 'eeeeeeee-0001-0000-0000-000000000001', 0, 5, 3,  5,  240), -- Bench Press (heavy)
  ('dddddddd-0003-0000-0000-000000000002', 'eeeeeeee-0001-0000-0000-000000000002', 1, 3, 8,  10, 120), -- Incline DB Press
  ('dddddddd-0003-0000-0000-000000000002', 'eeeeeeee-0005-0000-0000-000000000004', 2, 3, 8,  10, 90),  -- Skull Crusher
  ('dddddddd-0003-0000-0000-000000000002', 'eeeeeeee-0004-0000-0000-000000000003', 3, 3, 15, 20, 45);  -- Face Pull

-- ---- Strength — Deadlift Day ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0003-0000-0000-000000000003', 'eeeeeeee-0002-0000-0000-000000000001', 0, 4, 3,  5,  300), -- Deadlift (heavy)
  ('dddddddd-0003-0000-0000-000000000003', 'eeeeeeee-0003-0000-0000-000000000002', 1, 3, 8,  10, 120), -- Romanian DL
  ('dddddddd-0003-0000-0000-000000000003', 'eeeeeeee-0002-0000-0000-000000000003', 2, 3, 8,  10, 90),  -- Barbell Row
  ('dddddddd-0003-0000-0000-000000000003', 'eeeeeeee-0002-0000-0000-000000000004', 3, 3, 10, 12, 75),  -- Lat Pulldown
  ('dddddddd-0003-0000-0000-000000000003', 'eeeeeeee-0006-0000-0000-000000000002', 4, 3, 10, 12, 60);  -- Hanging Leg Raise

-- ---- Strength — Press Day ----
INSERT INTO workout_exercises (workout_day_id, exercise_id, order_index, sets, reps_min, reps_max, rest_seconds) VALUES
  ('dddddddd-0003-0000-0000-000000000004', 'eeeeeeee-0004-0000-0000-000000000001', 0, 5, 3,  5,  240), -- OHP (heavy)
  ('dddddddd-0003-0000-0000-000000000004', 'eeeeeeee-0004-0000-0000-000000000004', 1, 3, 8,  10, 90),  -- Arnold Press
  ('dddddddd-0003-0000-0000-000000000004', 'eeeeeeee-0004-0000-0000-000000000002', 2, 4, 15, 20, 45),  -- Lateral Raise
  ('dddddddd-0003-0000-0000-000000000004', 'eeeeeeee-0005-0000-0000-000000000001', 3, 3, 10, 12, 60),  -- Barbell Curl
  ('dddddddd-0003-0000-0000-000000000004', 'eeeeeeee-0005-0000-0000-000000000002', 4, 3, 12, 15, 60);  -- Tricep Pushdown
