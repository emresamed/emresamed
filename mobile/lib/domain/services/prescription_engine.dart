import '../../core/enums.dart';
import '../../data/models/algorithm_config.dart';
import '../../data/models/prescription.dart';
import '../../data/models/user_profile.dart';

class PrescriptionEngine {
  Prescription build({
    required String exerciseId,
    required UserProfile profile,
    required AlgorithmConfig config,
  }) {
    final preset = config.goalPresets[profile.fitnessGoal]!;
    final multiplier = config.bodyTypeMultipliers[profile.bodyType]!;

    final baseSets = _avg(preset.sets);
    final sets = baseSets.clamp(2, 6);
    final adjustedSets =
        (sets * multiplier.volume).round().clamp(2, 6);

    final intensityMid = _avgD(preset.intensity) + multiplier.intensityOffset;
    final restMid = (_avg(preset.rest) * multiplier.rest).round();

    return Prescription(
      exerciseId: exerciseId,
      sets: adjustedSets,
      repRangeMin: preset.reps.first,
      repRangeMax: preset.reps.last,
      targetRPE: _avgD(preset.rpe),
      restSeconds: restMid.clamp(30, 240),
      intensityPercent1RM: intensityMid.clamp(40, 95),
      notes: _noteForGoal(profile.fitnessGoal),
    );
  }

  int _avg(List<int> values) =>
      (values.reduce((a, b) => a + b) / values.length).round();

  double _avgD(List<int> values) =>
      values.reduce((a, b) => a + b) / values.length;

  String? _noteForGoal(FitnessGoal goal) => switch (goal) {
        FitnessGoal.strength => 'Focus on bar speed and full rest.',
        FitnessGoal.hypertrophy => 'Stop 1-2 reps before failure.',
        FitnessGoal.fatLoss => 'Keep rest short; control tempo.',
        FitnessGoal.endurance => 'Use steady breathing; lighter load.',
      };
}
