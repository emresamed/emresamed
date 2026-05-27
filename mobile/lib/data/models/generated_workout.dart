import '../../core/enums.dart';
import 'workout_session.dart';

class GeneratedWorkout {
  const GeneratedWorkout({
    required this.programId,
    required this.userId,
    required this.splitType,
    required this.sessions,
    this.mesocycleWeeks = 6,
  });

  final String programId;
  final String userId;
  final SplitType splitType;
  final List<WorkoutSession> sessions;
  final int mesocycleWeeks;
}
