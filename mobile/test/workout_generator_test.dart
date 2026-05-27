import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fitforge/core/enums.dart';
import 'package:fitforge/core/errors.dart';
import 'package:fitforge/data/datasources/seed_data_source.dart';
import 'package:fitforge/data/models/user_profile.dart';
import 'package:fitforge/data/repositories/exercise_repository.dart';
import 'package:fitforge/domain/services/prescription_engine.dart';
import 'package:fitforge/domain/services/split_selector.dart';
import 'package:fitforge/domain/services/workout_generator.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late WorkoutGenerator generator;

  final fullEquipment = {
    Equipment.barbell,
    Equipment.dumbbell,
    Equipment.cable,
    Equipment.machine,
    Equipment.bodyweight,
  };

  setUpAll(() async {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(
      const MethodChannel('plugins.flutter.io/shared_preferences'),
      (call) async => null,
    );

    final source = SeedDataSource();
    generator = WorkoutGenerator(
      ExerciseRepository(source),
      SplitSelector(),
      PrescriptionEngine(),
    );
    await source.preloadAll();
  });

  Future<void> assertValidProgram(UserProfile profile) async {
    final program = await generator.generate(profile);
    expect(program.sessions, isNotEmpty);
    expect(program.userId, profile.id);
    for (final session in program.sessions) {
      expect(session.exercises, isNotEmpty);
      for (final item in session.exercises) {
        expect(item.prescription.sets, inInclusiveRange(2, 6));
        expect(item.prescription.repRangeMin, lessThanOrEqualTo(item.prescription.repRangeMax));
        expect(
          item.exercise.matchesEquipment(profile.availableEquipment),
          isTrue,
        );
      }
    }
  }

  group('all body type × goal combinations', () {
    for (final bodyType in BodyType.values) {
      for (final goal in FitnessGoal.values) {
        test('$bodyType + $goal', () async {
          await assertValidProgram(
            UserProfile(
              id: 'test-$bodyType-$goal',
              bodyType: bodyType,
              fitnessGoal: goal,
              availableEquipment: fullEquipment,
              daysPerWeek: 4,
              experienceLevel: ExperienceLevel.intermediate,
            ),
          );
        });
      }
    }
  });

  group('days per week / split coverage', () {
    for (final days in [2, 3, 4, 5, 6]) {
      test('$days days produces sessions', () async {
        final program = await generator.generate(
          UserProfile(
            id: 'days-$days',
            bodyType: BodyType.mesomorph,
            fitnessGoal: FitnessGoal.hypertrophy,
            availableEquipment: fullEquipment,
            daysPerWeek: days,
            experienceLevel: ExperienceLevel.intermediate,
          ),
        );
        expect(program.sessions.length, greaterThanOrEqualTo(2));
        expect(program.sessions.length, lessThanOrEqualTo(days));
      });
    }
  });

  test('strength goal favors compounds in first session', () async {
    final program = await generator.generate(
      UserProfile(
        id: 'strength-test',
        bodyType: BodyType.mesomorph,
        fitnessGoal: FitnessGoal.strength,
        availableEquipment: {Equipment.barbell, Equipment.dumbbell},
        daysPerWeek: 5,
        experienceLevel: ExperienceLevel.advanced,
      ),
    );
    final compounds = program.sessions.first.exercises
        .where((e) => e.exercise.mechanics == MovementMechanics.compound)
        .length;
    expect(compounds, greaterThanOrEqualTo(2));
  });

  test('bodyweight-only still generates program', () async {
    await assertValidProgram(
      UserProfile(
        id: 'bw-only',
        bodyType: BodyType.ectomorph,
        fitnessGoal: FitnessGoal.fatLoss,
        availableEquipment: {Equipment.bodyweight, Equipment.resistanceBand},
        daysPerWeek: 3,
        experienceLevel: ExperienceLevel.beginner,
      ),
    );
  });

  test('rejects empty equipment', () async {
    expect(
      () => generator.generate(
        UserProfile(
          id: 'no-eq',
          bodyType: BodyType.mesomorph,
          fitnessGoal: FitnessGoal.hypertrophy,
          availableEquipment: {},
          daysPerWeek: 4,
          experienceLevel: ExperienceLevel.beginner,
        ),
      ),
      throwsA(isA<WorkoutGenerationException>()),
    );
  });

  test('recently used exercises are deprioritized', () async {
    final profile = UserProfile(
      id: 'recent',
      bodyType: BodyType.mesomorph,
      fitnessGoal: FitnessGoal.hypertrophy,
      availableEquipment: fullEquipment,
      daysPerWeek: 4,
      experienceLevel: ExperienceLevel.intermediate,
    );
    final first = await generator.generate(profile);
    final usedIds =
        first.sessions.expand((s) => s.exercises).map((e) => e.exercise.id).toSet();
    final second = await generator.generate(profile, recentlyUsedExerciseIds: usedIds);
    expect(second.sessions, isNotEmpty);
  });
}
