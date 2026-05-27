import '../../core/enums.dart';

class BodyTypeMultiplier {
  const BodyTypeMultiplier({
    required this.volume,
    required this.rest,
    required this.intensityOffset,
  });

  final double volume;
  final double rest;
  final double intensityOffset;

  factory BodyTypeMultiplier.fromJson(Map<String, dynamic> json) =>
      BodyTypeMultiplier(
        volume: (json['volume'] as num).toDouble(),
        rest: (json['rest'] as num).toDouble(),
        intensityOffset: (json['intensityOffset'] as num).toDouble(),
      );
}

class GoalPreset {
  const GoalPreset({
    required this.sets,
    required this.reps,
    required this.rpe,
    required this.rest,
    required this.intensity,
  });

  final List<int> sets;
  final List<int> reps;
  final List<int> rpe;
  final List<int> rest;
  final List<int> intensity;

  factory GoalPreset.fromJson(Map<String, dynamic> json) => GoalPreset(
        sets: (json['sets'] as List<dynamic>).cast<int>(),
        reps: (json['reps'] as List<dynamic>).cast<int>(),
        rpe: (json['rpe'] as List<dynamic>).cast<int>(),
        rest: (json['rest'] as List<dynamic>).cast<int>(),
        intensity: (json['intensity'] as List<dynamic>).cast<int>(),
      );
}

class AlgorithmConfig {
  const AlgorithmConfig({
    required this.bodyTypeMultipliers,
    required this.goalPresets,
    required this.weeklyVolumeBase,
    required this.daysPerWeekFactor,
    required this.recentUsePenaltyScore,
  });

  final Map<BodyType, BodyTypeMultiplier> bodyTypeMultipliers;
  final Map<FitnessGoal, GoalPreset> goalPresets;
  final Map<MuscleGroup, int> weeklyVolumeBase;
  final Map<int, double> daysPerWeekFactor;
  final int recentUsePenaltyScore;

  factory AlgorithmConfig.fromJson(Map<String, dynamic> json) {
    final btRaw = json['bodyTypeMultipliers'] as Map<String, dynamic>;
    final gpRaw = json['goalPresets'] as Map<String, dynamic>;
    final wvRaw = json['weeklyVolumeBase'] as Map<String, dynamic>;
    final dpRaw = json['daysPerWeekFactor'] as Map<String, dynamic>;
    final selection = json['selectionRules'] as Map<String, dynamic>;

    return AlgorithmConfig(
      bodyTypeMultipliers: {
        for (final e in BodyType.values)
          e: BodyTypeMultiplier.fromJson(
            btRaw[e.jsonValue] as Map<String, dynamic>,
          ),
      },
      goalPresets: {
        for (final entry in gpRaw.entries)
          FitnessGoalJson.fromJson(entry.key):
              GoalPreset.fromJson(entry.value as Map<String, dynamic>),
      },
      weeklyVolumeBase: {
        for (final entry in wvRaw.entries)
          MuscleGroupJson.fromJson(entry.key): entry.value as int,
      },
      daysPerWeekFactor: {
        for (final entry in dpRaw.entries)
          int.parse(entry.key): (entry.value as num).toDouble(),
      },
      recentUsePenaltyScore: selection['recentUsePenaltyScore'] as int,
    );
  }
}
