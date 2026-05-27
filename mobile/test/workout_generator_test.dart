import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fitforge/core/enums.dart';
import 'package:fitforge/data/datasources/seed_data_source.dart';
import 'package:fitforge/data/models/user_profile.dart';
import 'package:fitforge/data/repositories/exercise_repository.dart';
import 'package:fitforge/domain/services/prescription_engine.dart';
import 'package:fitforge/domain/services/split_selector.dart';
import 'package:fitforge/domain/services/workout_generator.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late WorkoutGenerator generator;

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
    for (final session in program.sessions) {
      expect(session.exercises, isNotEmpty);
      for (final item in session.exercises) {
        expect(item.prescription.sets, inInclusiveRange(2, 6));
        expect(
          item.exercise.matchesEquipment(profile.availableEquipment),
          isTrue,
        );
      }
    }
  }

  group('WorkoutGenerator all body types', () {
    for (final bodyType in BodyType.values) {
      test('generates valid workout for $bodyType', () async {
        await assertValidProgram(
          UserProfile(
            id: 'test-$bodyType',
            bodyType: bodyType,
            fitnessGoal: FitnessGoal.hypertrophy,
            availableEquipment: {
              Equipment.barbell,
              Equipment.dumbbell,
              Equipment.cable,
              Equipment.machine,
              Equipment.bodyweight,
            },
            daysPerWeek: 4,
            experienceLevel: ExperienceLevel.intermediate,
          ),
        );
      });
    }
  });

  test('strength goal favors compounds in first slots', () async {
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
    final firstSession = program.sessions.first;
    final compounds = firstSession.exercises
        .where((e) => e.exercise.mechanics == MovementMechanics.compound)
        .length;
    expect(compounds, greaterThanOrEqualTo(2));
  });
}
