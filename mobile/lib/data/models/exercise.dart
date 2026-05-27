import '../../core/enums.dart';

class Exercise {
  const Exercise({
    required this.id,
    required this.name,
    required this.primaryMuscle,
    required this.secondaryMuscles,
    required this.targetZone,
    required this.mechanics,
    required this.equipment,
    required this.difficulty,
    required this.movementPattern,
    this.instructions,
  });

  final String id;
  final String name;
  final MuscleGroup primaryMuscle;
  final List<MuscleGroup> secondaryMuscles;
  final String targetZone;
  final MovementMechanics mechanics;
  final List<Equipment> equipment;
  final Difficulty difficulty;
  final String movementPattern;
  final String? instructions;

  factory Exercise.fromJson(Map<String, dynamic> json) => Exercise(
        id: json['id'] as String,
        name: json['name'] as String,
        primaryMuscle: MuscleGroupJson.fromJson(json['primaryMuscle'] as String),
        secondaryMuscles: (json['secondaryMuscles'] as List<dynamic>)
            .map((e) => MuscleGroupJson.fromJson(e as String))
            .toList(),
        targetZone: json['targetZone'] as String,
        mechanics:
            MovementMechanicsJson.fromJson(json['mechanics'] as String),
        equipment: (json['equipment'] as List<dynamic>)
            .map((e) => EquipmentJson.fromJson(e as String))
            .toList(),
        difficulty: DifficultyJson.fromJson(json['difficulty'] as String),
        movementPattern: json['movementPattern'] as String,
        instructions: json['instructions'] as String?,
      );

  bool matchesEquipment(Set<Equipment> available) =>
      equipment.any(available.contains);
}
