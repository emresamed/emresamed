enum BodyType { ectomorph, mesomorph, endomorph }

enum FitnessGoal { strength, hypertrophy, fatLoss, endurance }

enum MuscleGroup { chest, back, legs, shoulders, arms, core }

enum MovementMechanics { compound, isolation }

enum Equipment {
  barbell,
  dumbbell,
  cable,
  machine,
  bodyweight,
  kettlebell,
  resistanceBand,
  smithMachine,
  ezBar,
}

enum Difficulty { beginner, intermediate, advanced }

enum SplitType { pushPullLegs, upperLower, fullBody }

enum ExperienceLevel { beginner, intermediate, advanced }

extension BodyTypeJson on BodyType {
  String get jsonValue => name;

  static BodyType fromJson(String value) =>
      BodyType.values.firstWhere((e) => e.name == value);
}

extension FitnessGoalJson on FitnessGoal {
  String get jsonValue =>
      this == FitnessGoal.fatLoss ? 'fat_loss' : name;

  static FitnessGoal fromJson(String value) => switch (value) {
        'fat_loss' => FitnessGoal.fatLoss,
        _ => FitnessGoal.values.firstWhere((e) => e.name == value),
      };
}

extension MuscleGroupJson on MuscleGroup {
  String get jsonValue => name;

  static MuscleGroup fromJson(String value) =>
      MuscleGroup.values.firstWhere((e) => e.name == value);
}

extension MovementMechanicsJson on MovementMechanics {
  String get jsonValue => name;

  static MovementMechanics fromJson(String value) =>
      MovementMechanics.values.firstWhere((e) => e.name == value);
}

extension EquipmentJson on Equipment {
  String get jsonValue => switch (this) {
        Equipment.resistanceBand => 'resistance_band',
        Equipment.smithMachine => 'smith_machine',
        Equipment.ezBar => 'ez_bar',
        _ => name,
      };

  static Equipment fromJson(String value) => switch (value) {
        'resistance_band' => Equipment.resistanceBand,
        'smith_machine' => Equipment.smithMachine,
        'ez_bar' => Equipment.ezBar,
        _ => Equipment.values.firstWhere((e) => e.name == value),
      };
}

extension DifficultyJson on Difficulty {
  String get jsonValue => name;

  static Difficulty fromJson(String value) =>
      Difficulty.values.firstWhere((e) => e.name == value);
}

extension SplitTypeJson on SplitType {
  String get jsonValue => switch (this) {
        SplitType.pushPullLegs => 'push_pull_legs',
        SplitType.upperLower => 'upper_lower',
        SplitType.fullBody => 'full_body',
      };

  static SplitType fromJson(String value) => switch (value) {
        'push_pull_legs' => SplitType.pushPullLegs,
        'upper_lower' => SplitType.upperLower,
        'full_body' => SplitType.fullBody,
        _ => throw ArgumentError('Unknown split: $value'),
      };
}

extension ExperienceLevelJson on ExperienceLevel {
  String get jsonValue => name;

  static ExperienceLevel fromJson(String value) =>
      ExperienceLevel.values.firstWhere((e) => e.name == value);
}

int difficultyRank(Difficulty d) => switch (d) {
      Difficulty.beginner => 0,
      Difficulty.intermediate => 1,
      Difficulty.advanced => 2,
    };
