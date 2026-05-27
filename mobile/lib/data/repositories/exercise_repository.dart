import '../../core/enums.dart';
import '../datasources/seed_data_source.dart';
import '../models/algorithm_config.dart';
import '../models/exercise.dart';
import '../models/split_template.dart';

class ExerciseRepository {
  ExerciseRepository(this._source);

  final SeedDataSource _source;

  Future<List<Exercise>> getAllExercises() => _source.loadExercises();

  Future<List<SplitSessionTemplate>> getSplitTemplates() =>
      _source.loadSplitTemplates();

  Future<AlgorithmConfig> getAlgorithmConfig() =>
      _source.loadAlgorithmConfig();

  /// Synchronous filter — caller should pass a preloaded exercise list.
  List<Exercise> filterFromCache(
    List<Exercise> all, {
    required Set<Equipment> availableEquipment,
    MuscleGroup? primaryMuscle,
    Iterable<String>? targetZones,
    MovementMechanics? mechanics,
    required ExperienceLevel userLevel,
    bool strictTargetZones = true,
  }) {
    return all.where((ex) {
      if (!ex.matchesEquipment(availableEquipment)) return false;
      if (primaryMuscle != null && ex.primaryMuscle != primaryMuscle) {
        return false;
      }
      if (strictTargetZones &&
          targetZones != null &&
          targetZones.isNotEmpty &&
          !targetZones.contains(ex.targetZone)) {
        return false;
      }
      if (mechanics != null && ex.mechanics != mechanics) return false;
      if (difficultyRank(ex.difficulty) >
          difficultyRank(_mapLevel(userLevel))) {
        return false;
      }
      return true;
    }).toList();
  }

  Future<List<Exercise>> filterExercises({
    required Set<Equipment> availableEquipment,
    MuscleGroup? primaryMuscle,
    Iterable<String>? targetZones,
    MovementMechanics? mechanics,
    required ExperienceLevel userLevel,
    bool strictTargetZones = true,
  }) async {
    final all = await getAllExercises();
    return filterFromCache(
      all,
      availableEquipment: availableEquipment,
      primaryMuscle: primaryMuscle,
      targetZones: targetZones,
      mechanics: mechanics,
      userLevel: userLevel,
      strictTargetZones: strictTargetZones,
    );
  }

  Difficulty _mapLevel(ExperienceLevel level) => switch (level) {
        ExperienceLevel.beginner => Difficulty.beginner,
        ExperienceLevel.intermediate => Difficulty.intermediate,
        ExperienceLevel.advanced => Difficulty.advanced,
      };
}
