-- GymBro Row Level Security policies

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muscle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_log_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- muscle_groups (public read)
-- ---------------------------------------------------------------------------

CREATE POLICY "Anyone can view muscle groups"
  ON public.muscle_groups FOR SELECT
  USING (TRUE);

-- ---------------------------------------------------------------------------
-- exercises (public read)
-- ---------------------------------------------------------------------------

CREATE POLICY "Anyone can view active exercises"
  ON public.exercises FOR SELECT
  USING (is_active = TRUE);

-- ---------------------------------------------------------------------------
-- workout_programs
-- ---------------------------------------------------------------------------

CREATE POLICY "Anyone can view public programs"
  ON public.workout_programs FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Creators can view own private programs"
  ON public.workout_programs FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create programs"
  ON public.workout_programs FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update own programs"
  ON public.workout_programs FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can delete own programs"
  ON public.workout_programs FOR DELETE
  USING (auth.uid() = created_by);

-- ---------------------------------------------------------------------------
-- workout_days (readable if program is accessible)
-- ---------------------------------------------------------------------------

CREATE POLICY "Anyone can view days of public programs"
  ON public.workout_days FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.workout_programs wp
      WHERE wp.id = workout_days.program_id
        AND (wp.is_public = TRUE OR wp.created_by = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- workout_exercises (readable if day is accessible)
-- ---------------------------------------------------------------------------

CREATE POLICY "Anyone can view exercises of accessible days"
  ON public.workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.workout_days wd
      JOIN public.workout_programs wp ON wp.id = wd.program_id
      WHERE wd.id = workout_exercises.workout_day_id
        AND (wp.is_public = TRUE OR wp.created_by = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- workout_logs (user-owned)
-- ---------------------------------------------------------------------------

CREATE POLICY "Users can view own workout logs"
  ON public.workout_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workout logs"
  ON public.workout_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout logs"
  ON public.workout_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout logs"
  ON public.workout_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- workout_log_sets (via workout log ownership)
-- ---------------------------------------------------------------------------

CREATE POLICY "Users can view own workout log sets"
  ON public.workout_log_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.workout_logs wl
      WHERE wl.id = workout_log_sets.workout_log_id
        AND wl.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own workout log sets"
  ON public.workout_log_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.workout_logs wl
      WHERE wl.id = workout_log_sets.workout_log_id
        AND wl.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout log sets"
  ON public.workout_log_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.workout_logs wl
      WHERE wl.id = workout_log_sets.workout_log_id
        AND wl.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.workout_logs wl
      WHERE wl.id = workout_log_sets.workout_log_id
        AND wl.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout log sets"
  ON public.workout_log_sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.workout_logs wl
      WHERE wl.id = workout_log_sets.workout_log_id
        AND wl.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- favorites (user-owned)
-- ---------------------------------------------------------------------------

CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- user_progress (user-owned)
-- ---------------------------------------------------------------------------

CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);
