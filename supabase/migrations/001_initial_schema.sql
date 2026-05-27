-- GymBro initial schema
-- Run via Supabase CLI: supabase db push
-- Or paste into Supabase SQL Editor

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.difficulty_level AS ENUM (
  'beginner',
  'intermediate',
  'advanced'
);

CREATE TYPE public.progress_metric AS ENUM (
  'weight',
  'reps',
  'body_weight',
  'one_rep_max'
);

-- ---------------------------------------------------------------------------
-- Utility: updated_at trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- users (extends Supabase auth.users)
-- ---------------------------------------------------------------------------

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_users_email ON public.users (email);

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- muscle_groups
-- ---------------------------------------------------------------------------

CREATE TABLE public.muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_muscle_groups_slug ON public.muscle_groups (slug);

-- ---------------------------------------------------------------------------
-- exercises
-- ---------------------------------------------------------------------------

CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  muscle_group_id UUID NOT NULL REFERENCES public.muscle_groups (id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  instructions TEXT,
  equipment TEXT,
  difficulty public.difficulty_level NOT NULL DEFAULT 'beginner',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER exercises_set_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_exercises_muscle_group_id ON public.exercises (muscle_group_id);
CREATE INDEX idx_exercises_slug ON public.exercises (slug);
CREATE INDEX idx_exercises_difficulty ON public.exercises (difficulty);

-- ---------------------------------------------------------------------------
-- workout_programs
-- ---------------------------------------------------------------------------

CREATE TABLE public.workout_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.users (id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  difficulty public.difficulty_level NOT NULL DEFAULT 'intermediate',
  duration_weeks SMALLINT CHECK (duration_weeks IS NULL OR duration_weeks > 0),
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER workout_programs_set_updated_at
  BEFORE UPDATE ON public.workout_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_workout_programs_created_by ON public.workout_programs (created_by);
CREATE INDEX idx_workout_programs_slug ON public.workout_programs (slug);
CREATE INDEX idx_workout_programs_is_public ON public.workout_programs (is_public);

-- ---------------------------------------------------------------------------
-- workout_days
-- ---------------------------------------------------------------------------

CREATE TABLE public.workout_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.workout_programs (id) ON DELETE CASCADE,
  day_number SMALLINT NOT NULL CHECK (day_number > 0),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (program_id, day_number)
);

CREATE INDEX idx_workout_days_program_id ON public.workout_days (program_id);

-- ---------------------------------------------------------------------------
-- workout_exercises (exercises assigned to a workout day)
-- ---------------------------------------------------------------------------

CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_day_id UUID NOT NULL REFERENCES public.workout_days (id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises (id) ON DELETE RESTRICT,
  order_index SMALLINT NOT NULL DEFAULT 1 CHECK (order_index > 0),
  target_sets SMALLINT NOT NULL DEFAULT 3 CHECK (target_sets > 0),
  target_reps TEXT NOT NULL DEFAULT '8-12',
  rest_seconds SMALLINT NOT NULL DEFAULT 90 CHECK (rest_seconds >= 0),
  notes TEXT,
  UNIQUE (workout_day_id, exercise_id),
  UNIQUE (workout_day_id, order_index)
);

CREATE INDEX idx_workout_exercises_workout_day_id ON public.workout_exercises (workout_day_id);
CREATE INDEX idx_workout_exercises_exercise_id ON public.workout_exercises (exercise_id);

-- ---------------------------------------------------------------------------
-- workout_logs (completed or in-progress workout sessions)
-- ---------------------------------------------------------------------------

CREATE TABLE public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.workout_programs (id) ON DELETE SET NULL,
  workout_day_id UUID REFERENCES public.workout_days (id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workout_logs_user_id ON public.workout_logs (user_id);
CREATE INDEX idx_workout_logs_program_id ON public.workout_logs (program_id);
CREATE INDEX idx_workout_logs_workout_day_id ON public.workout_logs (workout_day_id);
CREATE INDEX idx_workout_logs_started_at ON public.workout_logs (started_at DESC);
CREATE INDEX idx_workout_logs_user_started_at ON public.workout_logs (user_id, started_at DESC);

-- ---------------------------------------------------------------------------
-- workout_log_sets (individual sets logged during a session)
-- ---------------------------------------------------------------------------

CREATE TABLE public.workout_log_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID NOT NULL REFERENCES public.workout_logs (id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises (id) ON DELETE RESTRICT,
  set_number SMALLINT NOT NULL CHECK (set_number > 0),
  reps SMALLINT CHECK (reps IS NULL OR reps >= 0),
  weight_kg NUMERIC(6, 2) CHECK (weight_kg IS NULL OR weight_kg >= 0),
  is_completed BOOLEAN NOT NULL DEFAULT TRUE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workout_log_id, exercise_id, set_number)
);

CREATE INDEX idx_workout_log_sets_workout_log_id ON public.workout_log_sets (workout_log_id);
CREATE INDEX idx_workout_log_sets_exercise_id ON public.workout_log_sets (exercise_id);

-- ---------------------------------------------------------------------------
-- favorites
-- ---------------------------------------------------------------------------

CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, exercise_id)
);

CREATE INDEX idx_favorites_user_id ON public.favorites (user_id);
CREATE INDEX idx_favorites_exercise_id ON public.favorites (exercise_id);

-- ---------------------------------------------------------------------------
-- user_progress (personal records and tracked metrics)
-- ---------------------------------------------------------------------------

CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises (id) ON DELETE SET NULL,
  workout_log_id UUID REFERENCES public.workout_logs (id) ON DELETE SET NULL,
  metric public.progress_metric NOT NULL,
  value NUMERIC(10, 2) NOT NULL CHECK (value >= 0),
  unit TEXT NOT NULL DEFAULT 'kg',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_progress_user_id ON public.user_progress (user_id);
CREATE INDEX idx_user_progress_exercise_id ON public.user_progress (exercise_id);
CREATE INDEX idx_user_progress_metric ON public.user_progress (metric);
CREATE INDEX idx_user_progress_recorded_at ON public.user_progress (recorded_at DESC);
CREATE INDEX idx_user_progress_user_exercise_metric ON public.user_progress (user_id, exercise_id, metric, recorded_at DESC);
