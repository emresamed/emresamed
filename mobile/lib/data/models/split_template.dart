import '../../core/enums.dart';

class MuscleTarget {
  const MuscleTarget({
    required this.muscleGroup,
    required this.targetZones,
    required this.weeklySetBudget,
  });

  final MuscleGroup muscleGroup;
  final List<String> targetZones;
  final int weeklySetBudget;

  factory MuscleTarget.fromJson(Map<String, dynamic> json) => MuscleTarget(
        muscleGroup:
            MuscleGroupJson.fromJson(json['muscleGroup'] as String),
        targetZones: (json['targetZones'] as List<dynamic>).cast<String>(),
        weeklySetBudget: json['weeklySetBudget'] as int,
      );
}

class SlotRules {
  const SlotRules({
    required this.compoundCount,
    required this.isolationCount,
    required this.maxExercises,
  });

  final int compoundCount;
  final int isolationCount;
  final int maxExercises;

  factory SlotRules.fromJson(Map<String, dynamic> json) => SlotRules(
        compoundCount: json['compoundCount'] as int,
        isolationCount: json['isolationCount'] as int,
        maxExercises: json['maxExercises'] as int,
      );
}

class SplitSessionTemplate {
  const SplitSessionTemplate({
    required this.splitType,
    required this.bodyType,
    required this.recommendedDaysPerWeek,
    required this.dayIndex,
    required this.sessionName,
    required this.muscleTargets,
    required this.slotRules,
    this.conditioningMinutes = 0,
  });

  final SplitType splitType;
  final BodyType bodyType;
  final int recommendedDaysPerWeek;
  final int dayIndex;
  final String sessionName;
  final List<MuscleTarget> muscleTargets;
  final SlotRules slotRules;
  final int conditioningMinutes;

  factory SplitSessionTemplate.fromJson(Map<String, dynamic> json) =>
      SplitSessionTemplate(
        splitType: SplitTypeJson.fromJson(json['splitType'] as String),
        bodyType: BodyTypeJson.fromJson(json['bodyType'] as String),
        recommendedDaysPerWeek: json['recommendedDaysPerWeek'] as int,
        dayIndex: json['dayIndex'] as int,
        sessionName: json['sessionName'] as String,
        muscleTargets: (json['muscleTargets'] as List<dynamic>)
            .map((e) => MuscleTarget.fromJson(e as Map<String, dynamic>))
            .toList(),
        slotRules:
            SlotRules.fromJson(json['slotRules'] as Map<String, dynamic>),
        conditioningMinutes: json['conditioningMinutes'] as int? ?? 0,
      );
}
