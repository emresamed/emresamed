import 'package:flutter_test/flutter_test.dart';
import 'package:fitforge/core/enums.dart';
import 'package:fitforge/data/models/exercise.dart';
import 'package:fitforge/data/models/prescription.dart';
import 'package:fitforge/data/models/session_exercise.dart';
import 'package:fitforge/data/models/workout_session.dart';
import 'package:fitforge/state/active_workout_notifier.dart';

WorkoutSession _sampleSession() {
  const exercise = Exercise(
    id: 'ex_test',
    name: 'Test Press',
    primaryMuscle: MuscleGroup.chest,
    secondaryMuscles: [],
    targetZone: 'mid_chest',
    mechanics: MovementMechanics.compound,
    equipment: [Equipment.barbell],
    difficulty: Difficulty.beginner,
    movementPattern: 'horizontal_push',
  );
  return WorkoutSession(
    dayIndex: 0,
    sessionName: 'Push',
    exercises: [
      SessionExercise(
        exercise: exercise,
        prescription: const Prescription(
          exerciseId: 'ex_test',
          sets: 3,
          repRangeMin: 8,
          repRangeMax: 12,
          targetRPE: 7.5,
          restSeconds: 2,
          intensityPercent1RM: 70,
        ),
      ),
    ],
  );
}

void main() {
  test('toggleSet starts rest only when completing a set', () {
    final notifier = ActiveWorkoutNotifier();
    notifier.startSession(_sampleSession());
    expect(notifier.isResting, isFalse);

    notifier.toggleSet('ex_test', 1);
    expect(notifier.isResting, isTrue);
    expect(notifier.restSecondsRemaining, 2);

    notifier.skipRest();
    notifier.toggleSet('ex_test', 1);
    expect(notifier.isResting, isFalse);
  });

  test('nextExercise cancels active rest timer', () {
    final notifier = ActiveWorkoutNotifier();
    final session = WorkoutSession(
      dayIndex: 0,
      sessionName: 'Test',
      exercises: [
        ..._sampleSession().exercises,
        SessionExercise(
          exercise: _sampleSession().exercises.first.exercise.copyWith(
                id: 'ex_test_2',
                name: 'Row',
                primaryMuscle: MuscleGroup.back,
                targetZone: 'lats',
              ),
          prescription: _sampleSession().exercises.first.prescription,
        ),
      ],
    );
    notifier.startSession(session);
    notifier.toggleSet('ex_test', 1);
    expect(notifier.isResting, isTrue);
    notifier.nextExercise();
    expect(notifier.isResting, isFalse);
    expect(notifier.currentExercise?.exercise.id, 'ex_test_2');
  });

  test('empty session does not start', () {
    final notifier = ActiveWorkoutNotifier();
    notifier.startSession(
      const WorkoutSession(dayIndex: 0, sessionName: 'Empty', exercises: []),
    );
    expect(notifier.isActive, isFalse);
  });

  test('dispose cancels timer without throwing', () {
    final notifier = ActiveWorkoutNotifier();
    notifier.startSession(_sampleSession());
    notifier.toggleSet('ex_test', 1);
    expect(notifier.isResting, isTrue);
    expect(() => notifier.dispose(), returnsNormally);
  });
}

extension on Exercise {
  Exercise copyWith({
    String? id,
    String? name,
    MuscleGroup? primaryMuscle,
    String? targetZone,
  }) =>
      Exercise(
        id: id ?? this.id,
        name: name ?? this.name,
        primaryMuscle: primaryMuscle ?? this.primaryMuscle,
        secondaryMuscles: secondaryMuscles,
        targetZone: targetZone ?? this.targetZone,
        mechanics: mechanics,
        equipment: equipment,
        difficulty: difficulty,
        movementPattern: movementPattern,
      );
}
