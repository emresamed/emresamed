import '../../core/enums.dart';

class UserProfile {
  const UserProfile({
    required this.id,
    required this.bodyType,
    required this.fitnessGoal,
    required this.availableEquipment,
    required this.daysPerWeek,
    required this.experienceLevel,
    this.splitOverride,
    this.weightKg,
    this.heightCm,
    this.age,
  });

  final String id;
  final BodyType bodyType;
  final FitnessGoal fitnessGoal;
  final Set<Equipment> availableEquipment;
  final int daysPerWeek;
  final ExperienceLevel experienceLevel;
  final SplitType? splitOverride;
  final double? weightKg;
  final double? heightCm;
  final int? age;

  Map<String, dynamic> toJson() => {
        'id': id,
        'bodyType': bodyType.jsonValue,
        'fitnessGoal': fitnessGoal.jsonValue,
        'availableEquipment':
            availableEquipment.map((e) => e.jsonValue).toList(),
        'daysPerWeek': daysPerWeek,
        'experienceLevel': experienceLevel.jsonValue,
        if (splitOverride != null) 'splitOverride': splitOverride!.jsonValue,
        if (weightKg != null) 'weightKg': weightKg,
        if (heightCm != null) 'heightCm': heightCm,
        if (age != null) 'age': age,
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        id: json['id'] as String,
        bodyType: BodyTypeJson.fromJson(json['bodyType'] as String),
        fitnessGoal: FitnessGoalJson.fromJson(json['fitnessGoal'] as String),
        availableEquipment: (json['availableEquipment'] as List<dynamic>)
            .map((e) => EquipmentJson.fromJson(e as String))
            .toSet(),
        daysPerWeek: json['daysPerWeek'] as int,
        experienceLevel:
            ExperienceLevelJson.fromJson(json['experienceLevel'] as String),
        splitOverride: json['splitOverride'] != null
            ? SplitTypeJson.fromJson(json['splitOverride'] as String)
            : null,
        weightKg: (json['weightKg'] as num?)?.toDouble(),
        heightCm: (json['heightCm'] as num?)?.toDouble(),
        age: json['age'] as int?,
      );

  UserProfile copyWith({
    String? id,
    BodyType? bodyType,
    FitnessGoal? fitnessGoal,
    Set<Equipment>? availableEquipment,
    int? daysPerWeek,
    ExperienceLevel? experienceLevel,
    SplitType? splitOverride,
    double? weightKg,
    double? heightCm,
    int? age,
  }) =>
      UserProfile(
        id: id ?? this.id,
        bodyType: bodyType ?? this.bodyType,
        fitnessGoal: fitnessGoal ?? this.fitnessGoal,
        availableEquipment: availableEquipment ?? this.availableEquipment,
        daysPerWeek: daysPerWeek ?? this.daysPerWeek,
        experienceLevel: experienceLevel ?? this.experienceLevel,
        splitOverride: splitOverride ?? this.splitOverride,
        weightKg: weightKg ?? this.weightKg,
        heightCm: heightCm ?? this.heightCm,
        age: age ?? this.age,
      );
}
