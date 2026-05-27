import 'session_exercise.dart';

class WorkoutSession {
  const WorkoutSession({
    required this.dayIndex,
    required this.sessionName,
    required this.exercises,
    this.conditioningMinutes = 0,
  });

  final int dayIndex;
  final String sessionName;
  final List<SessionExercise> exercises;
  final int conditioningMinutes;
}
