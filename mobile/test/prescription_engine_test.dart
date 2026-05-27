import 'package:flutter_test/flutter_test.dart';
import 'package:fitforge/core/enums.dart';
import 'package:fitforge/data/datasources/seed_data_source.dart';
import 'package:fitforge/data/models/algorithm_config.dart';
import 'package:fitforge/data/models/user_profile.dart';
import 'package:fitforge/domain/services/prescription_engine.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late PrescriptionEngine engine;
  late AlgorithmConfig config;

  setUpAll(() async {
    engine = PrescriptionEngine();
    config = await SeedDataSource().loadAlgorithmConfig();
  });

  test('ectomorph has fewer sets and longer rest than mesomorph', () {
    final ecto = engine.build(
      exerciseId: 'ex_test',
      profile: UserProfile(
        id: '1',
        bodyType: BodyType.ectomorph,
        fitnessGoal: FitnessGoal.hypertrophy,
        availableEquipment: {Equipment.bodyweight},
        daysPerWeek: 4,
        experienceLevel: ExperienceLevel.beginner,
      ),
      config: config,
    );
    final meso = engine.build(
      exerciseId: 'ex_test',
      profile: UserProfile(
        id: '2',
        bodyType: BodyType.mesomorph,
        fitnessGoal: FitnessGoal.hypertrophy,
        availableEquipment: {Equipment.bodyweight},
        daysPerWeek: 4,
        experienceLevel: ExperienceLevel.beginner,
      ),
      config: config,
    );
    expect(ecto.sets, lessThanOrEqualTo(meso.sets));
    expect(ecto.restSeconds, greaterThanOrEqualTo(meso.restSeconds));
  });

  test('strength goal uses lower rep range than endurance', () {
    final strength = engine.build(
      exerciseId: 'ex_test',
      profile: UserProfile(
        id: '1',
        bodyType: BodyType.mesomorph,
        fitnessGoal: FitnessGoal.strength,
        availableEquipment: {Equipment.barbell},
        daysPerWeek: 4,
        experienceLevel: ExperienceLevel.intermediate,
      ),
      config: config,
    );
    final endurance = engine.build(
      exerciseId: 'ex_test',
      profile: UserProfile(
        id: '2',
        bodyType: BodyType.mesomorph,
        fitnessGoal: FitnessGoal.endurance,
        availableEquipment: {Equipment.bodyweight},
        daysPerWeek: 3,
        experienceLevel: ExperienceLevel.beginner,
      ),
      config: config,
    );
    expect(strength.repRangeMax, lessThan(endurance.repRangeMin));
    expect(strength.intensityPercent1RM, greaterThan(endurance.intensityPercent1RM));
  });
}
