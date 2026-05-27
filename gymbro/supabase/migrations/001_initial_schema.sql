-- =============================================================================
-- GymBro — Initial Schema
-- Migration: 001_initial_schema.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: auto-update updated_at column
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- user_profiles
-- Extends auth.users with fitness-specific data.
-- Created automatically via trigger on auth signup.
-- ---------------------------------------------------------------------------
CREATE TABLE user_profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT        NOT NULL,
  full_name       TEXT,
  username        TEXT        UNIQUE,
  avatar_url      TEXT,
  weight_kg       DECIMAL(5,2),
  height_cm       DECIMAL(5,2),
  fitness_goal    TEXT        CHECK (fitness_goal IN (
                                'muscle_gain','weight_loss','strength',
                                'endurance','general_fitness'
                              )),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile on Supabase auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- muscle_groups
-- Reference table for primary/secondary muscle groups on exercises.
-- ---------------------------------------------------------------------------
CREATE TABLE muscle_groups (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL UNIQUE,
  slug        TEXT        NOT NULL UNIQUE,
  icon_url    TEXT,
  color       TEXT        NOT NULL DEFAULT '#E94560',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- exercises
-- The global exercise library. Admins/seed populate this.
-- ---------------------------------------------------------------------------
CREATE TABLE exercises (
  id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                        TEXT        NOT NULL,
  slug                        TEXT        NOT NULL UNIQUE,
  description                 TEXT,
  instructions                TEXT[]      NOT NULL DEFAULT '{}',
  difficulty                  TEXT        NOT NULL CHECK (difficulty IN ('beginner','intermediate','advanced')),
  equipment                   TEXT[]      NOT NULL DEFAULT '{}',
  primary_muscle_group_id     UUID        NOT NULL REFERENCES muscle_groups(id),
  secondary_muscle_group_ids  UUID[]      NOT NULL DEFAULT '{}',
  video_url                   TEXT,
  thumbnail_url               TEXT,
  calories_per_minute         DECIMAL(5,2),
  is_public                   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- workout_programs
-- Training plans. Can be created by admins (is_public) or users (private).
-- ---------------------------------------------------------------------------
CREATE TABLE workout_programs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  description     TEXT,
  thumbnail_url   TEXT,
  difficulty      TEXT        NOT NULL CHECK (difficulty IN ('beginner','intermediate','advanced')),
  goal            TEXT        NOT NULL CHECK (goal IN (
                                'muscle_gain','weight_loss','strength',
                                'endurance','general_fitness'
                              )),
  duration_weeks  INTEGER     NOT NULL CHECK (duration_weeks > 0),
  days_per_week   INTEGER     NOT NULL CHECK (days_per_week BETWEEN 1 AND 7),
  created_by      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- workout_days
-- Individual training days within a program.
-- ---------------------------------------------------------------------------
CREATE TABLE workout_days (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID    NOT NULL REFERENCES workout_programs(id) ON DELETE CASCADE,
  day_number  INTEGER NOT NULL CHECK (day_number > 0),
  name        TEXT    NOT NULL,
  description TEXT,
  UNIQUE (program_id, day_number)
);

-- ---------------------------------------------------------------------------
-- workout_exercises
-- Prescribed exercises for a workout day (sets, reps, rest).
-- ---------------------------------------------------------------------------
CREATE TABLE workout_exercises (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_day_id   UUID    NOT NULL REFERENCES workout_days(id) ON DELETE CASCADE,
  exercise_id      UUID    NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index      INTEGER NOT NULL DEFAULT 0,
  sets             INTEGER NOT NULL DEFAULT 3 CHECK (sets > 0),
  reps_min         INTEGER CHECK (reps_min > 0),
  reps_max         INTEGER CHECK (reps_max > 0),
  duration_seconds INTEGER CHECK (duration_seconds > 0),
  rest_seconds     INTEGER NOT NULL DEFAULT 60 CHECK (rest_seconds >= 0),
  notes            TEXT,
  UNIQUE (workout_day_id, order_index)
);

-- ---------------------------------------------------------------------------
-- favorites
-- User-saved exercises (heart/bookmark feature).
-- ---------------------------------------------------------------------------
CREATE TABLE favorites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID        NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, exercise_id)
);

-- ---------------------------------------------------------------------------
-- workout_logs
-- Completed workout sessions (header record).
-- ---------------------------------------------------------------------------
CREATE TABLE workout_logs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_day_id   UUID        REFERENCES workout_days(id) ON DELETE SET NULL,
  program_id       UUID        REFERENCES workout_programs(id) ON DELETE SET NULL,
  started_at       TIMESTAMPTZ NOT NULL,
  finished_at      TIMESTAMPTZ NOT NULL,
  duration_seconds INTEGER     NOT NULL CHECK (duration_seconds >= 0),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- workout_log_exercises
-- Exercises performed within a session (child of workout_logs).
-- exercise_name is denormalized so history stays readable if exercises change.
-- ---------------------------------------------------------------------------
CREATE TABLE workout_log_exercises (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id  UUID    NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,
  exercise_id     UUID    NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  exercise_name   TEXT    NOT NULL,
  order_index     INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- workout_log_sets
-- Individual sets within each exercise of a completed session.
-- ---------------------------------------------------------------------------
CREATE TABLE workout_log_sets (
  id                       UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_exercise_id  UUID       NOT NULL REFERENCES workout_log_exercises(id) ON DELETE CASCADE,
  set_number               INTEGER    NOT NULL CHECK (set_number > 0),
  reps                     INTEGER    CHECK (reps >= 0),
  weight_kg                DECIMAL(6,2) CHECK (weight_kg >= 0),
  duration_seconds         INTEGER    CHECK (duration_seconds >= 0),
  is_completed             BOOLEAN    NOT NULL DEFAULT TRUE
);

-- ---------------------------------------------------------------------------
-- user_progress
-- Body weight / measurements over time for progress charts.
-- ---------------------------------------------------------------------------
CREATE TABLE user_progress (
  id                   UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID       NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recorded_at          DATE       NOT NULL DEFAULT CURRENT_DATE,
  weight_kg            DECIMAL(5,2) CHECK (weight_kg > 0),
  body_fat_percentage  DECIMAL(5,2) CHECK (body_fat_percentage BETWEEN 1 AND 70),
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, recorded_at)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- exercises
CREATE INDEX idx_exercises_primary_muscle   ON exercises (primary_muscle_group_id);
CREATE INDEX idx_exercises_difficulty       ON exercises (difficulty);
CREATE INDEX idx_exercises_name             ON exercises USING GIN (to_tsvector('english', name));

-- workout_programs
CREATE INDEX idx_programs_goal              ON workout_programs (goal);
CREATE INDEX idx_programs_difficulty        ON workout_programs (difficulty);
CREATE INDEX idx_programs_is_public         ON workout_programs (is_public);

-- workout_days
CREATE INDEX idx_workout_days_program       ON workout_days (program_id);

-- workout_exercises
CREATE INDEX idx_workout_exercises_day      ON workout_exercises (workout_day_id);
CREATE INDEX idx_workout_exercises_exercise ON workout_exercises (exercise_id);

-- favorites
CREATE INDEX idx_favorites_user             ON favorites (user_id);
CREATE INDEX idx_favorites_exercise         ON favorites (exercise_id);

-- workout_logs
CREATE INDEX idx_workout_logs_user          ON workout_logs (user_id);
CREATE INDEX idx_workout_logs_finished_at   ON workout_logs (finished_at DESC);
CREATE INDEX idx_workout_logs_user_date     ON workout_logs (user_id, finished_at DESC);

-- workout_log_exercises
CREATE INDEX idx_log_exercises_log          ON workout_log_exercises (workout_log_id);
CREATE INDEX idx_log_exercises_exercise     ON workout_log_exercises (exercise_id);

-- workout_log_sets
CREATE INDEX idx_log_sets_exercise          ON workout_log_sets (workout_log_exercise_id);

-- user_progress
CREATE INDEX idx_user_progress_user_date    ON user_progress (user_id, recorded_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE user_profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_groups          ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises               ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_programs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_days            ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises       ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites               ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_log_exercises   ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_log_sets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress           ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- user_profiles policies
-- ---------------------------------------------------------------------------
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- muscle_groups policies (public read)
-- ---------------------------------------------------------------------------
CREATE POLICY "Anyone can read muscle groups"
  ON muscle_groups FOR SELECT
  USING (TRUE);

-- ---------------------------------------------------------------------------
-- exercises policies (public read for is_public)
-- ---------------------------------------------------------------------------
CREATE POLICY "Anyone can read public exercises"
  ON exercises FOR SELECT
  USING (is_public = TRUE);

-- ---------------------------------------------------------------------------
-- workout_programs policies
-- ---------------------------------------------------------------------------
CREATE POLICY "Anyone can read public programs"
  ON workout_programs FOR SELECT
  USING (is_public = TRUE OR created_by = auth.uid());

CREATE POLICY "Users can create their own programs"
  ON workout_programs FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own programs"
  ON workout_programs FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own programs"
  ON workout_programs FOR DELETE
  USING (created_by = auth.uid());

-- ---------------------------------------------------------------------------
-- workout_days policies (follows program visibility)
-- ---------------------------------------------------------------------------
CREATE POLICY "Anyone can read days of public programs"
  ON workout_days FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_programs wp
      WHERE wp.id = program_id
        AND (wp.is_public = TRUE OR wp.created_by = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- workout_exercises policies (follows day visibility)
-- ---------------------------------------------------------------------------
CREATE POLICY "Anyone can read exercises of public program days"
  ON workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_days wd
      JOIN workout_programs wp ON wp.id = wd.program_id
      WHERE wd.id = workout_day_id
        AND (wp.is_public = TRUE OR wp.created_by = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- favorites policies
-- ---------------------------------------------------------------------------
CREATE POLICY "Users can read their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- workout_logs policies
-- ---------------------------------------------------------------------------
CREATE POLICY "Users can read their own logs"
  ON workout_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON workout_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON workout_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- workout_log_exercises policies (scoped to user via join)
-- ---------------------------------------------------------------------------
CREATE POLICY "Users can manage their own log exercises"
  ON workout_log_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_logs wl
      WHERE wl.id = workout_log_id AND wl.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- workout_log_sets policies (scoped to user via join)
-- ---------------------------------------------------------------------------
CREATE POLICY "Users can manage their own log sets"
  ON workout_log_sets FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM workout_log_exercises wle
      JOIN workout_logs wl ON wl.id = wle.workout_log_id
      WHERE wle.id = workout_log_exercise_id
        AND wl.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- user_progress policies
-- ---------------------------------------------------------------------------
CREATE POLICY "Users can read their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);
