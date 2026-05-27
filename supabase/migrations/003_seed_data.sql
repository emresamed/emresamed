-- GymBro seed data
-- Sample muscle groups, exercises, and a starter workout program

-- ---------------------------------------------------------------------------
-- muscle_groups
-- ---------------------------------------------------------------------------

INSERT INTO public.muscle_groups (id, name, slug, description, icon_name) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Chest', 'chest', 'Pectoral muscles', 'chest'),
  ('11111111-1111-1111-1111-111111111102', 'Back', 'back', 'Latissimus, traps, and rhomboids', 'back'),
  ('11111111-1111-1111-1111-111111111103', 'Legs', 'legs', 'Quads, hamstrings, glutes, and calves', 'legs'),
  ('11111111-1111-1111-1111-111111111104', 'Shoulders', 'shoulders', 'Deltoids and rotator cuff', 'shoulders'),
  ('11111111-1111-1111-1111-111111111105', 'Arms', 'arms', 'Biceps and triceps', 'arms'),
  ('11111111-1111-1111-1111-111111111106', 'Core', 'core', 'Abs and obliques', 'core');

-- ---------------------------------------------------------------------------
-- exercises
-- ---------------------------------------------------------------------------

INSERT INTO public.exercises (
  id, muscle_group_id, name, slug, description, instructions, equipment, difficulty
) VALUES
  (
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    'Barbell Bench Press',
    'barbell-bench-press',
    'Classic compound chest builder.',
    'Lie on a flat bench, grip the bar slightly wider than shoulder width, lower to mid-chest, and press up.',
    'Barbell',
    'intermediate'
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111101',
    'Incline Dumbbell Press',
    'incline-dumbbell-press',
    'Upper chest focused pressing movement.',
    'Set bench to 30-45 degrees, press dumbbells up and together without clanking.',
    'Dumbbells',
    'intermediate'
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111102',
    'Pull-Up',
    'pull-up',
    'Bodyweight vertical pull for back width.',
    'Hang from bar with overhand grip, pull chest toward bar, control the descent.',
    'Pull-up bar',
    'intermediate'
  ),
  (
    '22222222-2222-2222-2222-222222222204',
    '11111111-1111-1111-1111-111111111102',
    'Barbell Row',
    'barbell-row',
    'Horizontal pull for back thickness.',
    'Hinge at hips, pull bar to lower ribs, keep core braced.',
    'Barbell',
    'intermediate'
  ),
  (
    '22222222-2222-2222-2222-222222222205',
    '11111111-1111-1111-1111-111111111103',
    'Barbell Squat',
    'barbell-squat',
    'Foundational lower body strength movement.',
    'Bar on upper back, sit hips back and down, drive through mid-foot to stand.',
    'Barbell',
    'intermediate'
  ),
  (
    '22222222-2222-2222-2222-222222222206',
    '11111111-1111-1111-1111-111111111103',
    'Romanian Deadlift',
    'romanian-deadlift',
    'Hamstring and glute focused hinge pattern.',
    'Soft knee bend, push hips back, keep bar close to legs, feel stretch in hamstrings.',
    'Barbell',
    'intermediate'
  ),
  (
    '22222222-2222-2222-2222-222222222207',
    '11111111-1111-1111-1111-111111111104',
    'Overhead Press',
    'overhead-press',
    'Standing shoulder press for overall delt development.',
    'Press bar overhead in straight line, lock out with biceps near ears.',
    'Barbell',
    'intermediate'
  ),
  (
    '22222222-2222-2222-2222-222222222208',
    '11111111-1111-1111-1111-111111111105',
    'Barbell Curl',
    'barbell-curl',
    'Primary biceps isolation exercise.',
    'Keep elbows pinned, curl without swinging, squeeze at the top.',
    'Barbell',
    'beginner'
  ),
  (
    '22222222-2222-2222-2222-222222222209',
    '11111111-1111-1111-1111-111111111105',
    'Tricep Pushdown',
    'tricep-pushdown',
    'Cable isolation for triceps.',
    'Keep elbows at sides, extend fully without leaning forward.',
    'Cable machine',
    'beginner'
  ),
  (
    '22222222-2222-2222-2222-222222222210',
    '11111111-1111-1111-1111-111111111106',
    'Plank',
    'plank',
    'Isometric core stability exercise.',
    'Maintain straight line from head to heels, brace abs and glutes.',
    'Bodyweight',
    'beginner'
  );

-- ---------------------------------------------------------------------------
-- workout_programs
-- ---------------------------------------------------------------------------

INSERT INTO public.workout_programs (
  id, title, slug, description, difficulty, duration_weeks, is_public
) VALUES (
  '33333333-3333-3333-3333-333333333301',
  'Push Pull Legs',
  'push-pull-legs',
  'A balanced 3-day split focusing on push, pull, and leg movements. Ideal for intermediate lifters.',
  'intermediate',
  8,
  TRUE
);

INSERT INTO public.workout_programs (
  id, title, slug, description, difficulty, duration_weeks, is_public
) VALUES (
  '33333333-3333-3333-3333-333333333302',
  'Full Body Strength',
  'full-body-strength',
  'Three full-body sessions per week built around compound lifts.',
  'beginner',
  6,
  TRUE
);

-- ---------------------------------------------------------------------------
-- workout_days
-- ---------------------------------------------------------------------------

INSERT INTO public.workout_days (id, program_id, day_number, title, description) VALUES
  (
    '44444444-4444-4444-4444-444444444401',
    '33333333-3333-3333-3333-333333333301',
    1,
    'Push Day',
    'Chest, shoulders, and triceps'
  ),
  (
    '44444444-4444-4444-4444-444444444402',
    '33333333-3333-3333-3333-333333333301',
    2,
    'Pull Day',
    'Back and biceps'
  ),
  (
    '44444444-4444-4444-4444-444444444403',
    '33333333-3333-3333-3333-333333333301',
    3,
    'Leg Day',
    'Quads, hamstrings, glutes, and core'
  ),
  (
    '44444444-4444-4444-4444-444444444404',
    '33333333-3333-3333-3333-333333333302',
    1,
    'Full Body A',
    'Squat focus with upper body accessories'
  );

-- ---------------------------------------------------------------------------
-- workout_exercises
-- ---------------------------------------------------------------------------

-- Push Day
INSERT INTO public.workout_exercises (
  workout_day_id, exercise_id, order_index, target_sets, target_reps, rest_seconds
) VALUES
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', 1, 4, '6-8', 120),
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222202', 2, 3, '8-12', 90),
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222207', 3, 3, '8-10', 90),
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222209', 4, 3, '12-15', 60);

-- Pull Day
INSERT INTO public.workout_exercises (
  workout_day_id, exercise_id, order_index, target_sets, target_reps, rest_seconds
) VALUES
  ('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222203', 1, 4, '6-10', 120),
  ('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222204', 2, 4, '8-10', 90),
  ('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222208', 3, 3, '10-12', 60);

-- Leg Day
INSERT INTO public.workout_exercises (
  workout_day_id, exercise_id, order_index, target_sets, target_reps, rest_seconds
) VALUES
  ('44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222205', 1, 4, '5-8', 150),
  ('44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222206', 2, 3, '8-12', 90),
  ('44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222210', 3, 3, '30-60s', 60);

-- Full Body A
INSERT INTO public.workout_exercises (
  workout_day_id, exercise_id, order_index, target_sets, target_reps, rest_seconds
) VALUES
  ('44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222205', 1, 3, '8-10', 120),
  ('44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222201', 2, 3, '8-10', 90),
  ('44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222204', 3, 3, '8-10', 90),
  ('44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222210', 4, 3, '30-45s', 60);
