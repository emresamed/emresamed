import 'package:uuid/uuid.dart';

import '../../core/enums.dart';
import '../../core/errors.dart';
import '../../core/validation/profile_validator.dart';
import '../../data/models/algorithm_config.dart';
import '../../data/models/exercise.dart';
import '../../data/models/generated_workout.dart';
import '../../data/models/session_exercise.dart';
import '../../data/models/split_template.dart';
import '../../data/models/user_profile.dart';
import '../../data/models/workout_session.dart';
import '../../data/repositories/exercise_repository.dart';
import 'prescription_engine.dart';
import 'split_selector.dart';

class WorkoutGenerator {
  WorkoutGenerator(
    this._repository,
    this._splitSelector,
    this._prescriptionEngine, {
    ProfileValidator? validator,
  }) : _validator = validator ?? ProfileValidator();

  final ExerciseRepository _repository;
  final SplitSelector _splitSelector;
  final PrescriptionEngine _prescriptionEngine;
  final ProfileValidator _validator;
  final _uuid = const Uuid();

  Future<GeneratedWorkout> generate(
    UserProfile profile, {
    Set<String> recentlyUsedExerciseIds = const {},
  }) async {
    _validator.validate(profile);

    final config = await _repository.getAlgorithmConfig();
    final templates = await _repository.getSplitTemplates();
    final allExercises = await _repository.getAllExercises();
    final split = _splitSelector.resolve(profile);

    final sessionTemplates = _pickSessionTemplates(
      templates,
      profile,
      split,
    );

    final sessions = <WorkoutSession>[];
    for (final template in sessionTemplates) {
      final picks = _fillSession(
        template,
        profile,
        config,
        allExercises,
        recentlyUsedExerciseIds,
      );
      if (picks.isEmpty) {
        throw WorkoutGenerationException(
          'No exercises found for ${template.sessionName}. '
          'Add more equipment or lower difficulty.',
        );
      }
      sessions.add(
        WorkoutSession(
          dayIndex: template.dayIndex,
          sessionName: template.sessionName,
          exercises: picks,
          conditioningMinutes: template.conditioningMinutes,
        ),
      );
    }

    if (sessions.isEmpty) {
      throw WorkoutGenerationException('No sessions could be built.');
    }

    return GeneratedWorkout(
      programId: _uuid.v4(),
      userId: profile.id,
      splitType: split,
      sessions: sessions,
    );
  }

  List<SplitSessionTemplate> _pickSessionTemplates(
    List<SplitSessionTemplate> all,
    UserProfile profile,
    SplitType split,
  ) {
    final matching = all
        .where(
          (t) => t.bodyType == profile.bodyType && t.splitType == split,
        )
        .toList();

    if (matching.isEmpty) {
      throw WorkoutGenerationException(
        'No split templates for ${profile.bodyType.name} / ${split.name}',
      );
    }

    final byDays = matching
        .where((t) => t.recommendedDaysPerWeek == profile.daysPerWeek)
        .toList();
    final pool = byDays.isNotEmpty ? byDays : matching;

    final uniqueDays = pool.map((t) => t.dayIndex).toSet().toList()..sort();
    final maxDays = profile.daysPerWeek.clamp(2, 6);
    final selectedDayIndexes = uniqueDays.take(maxDays).toList();

    return pool.where((t) => selectedDayIndexes.contains(t.dayIndex)).toList()
      ..sort((a, b) => a.dayIndex.compareTo(b.dayIndex));
  }

  List<SessionExercise> _fillSession(
    SplitSessionTemplate template,
    UserProfile profile,
    AlgorithmConfig config,
    List<Exercise> allExercises,
    Set<String> recentIds,
  ) {
    final compoundsNeeded = template.slotRules.compoundCount;
    final isolationsNeeded = template.slotRules.isolationCount;
    final maxExercises = template.slotRules.maxExercises;
    final selected = <SessionExercise>[];
    final usedIds = <String>{};

    for (final target in template.muscleTargets) {
      var compounds = _repository.filterFromCache(
        allExercises,
        availableEquipment: profile.availableEquipment,
        primaryMuscle: target.muscleGroup,
        targetZones: target.targetZones,
        mechanics: MovementMechanics.compound,
        userLevel: profile.experienceLevel,
      );
      var isolations = _repository.filterFromCache(
        allExercises,
        availableEquipment: profile.availableEquipment,
        primaryMuscle: target.muscleGroup,
        targetZones: target.targetZones,
        mechanics: MovementMechanics.isolation,
        userLevel: profile.experienceLevel,
      );

      if (compounds.isEmpty && isolations.isEmpty) {
        compounds = _repository.filterFromCache(
          allExercises,
          availableEquipment: profile.availableEquipment,
          primaryMuscle: target.muscleGroup,
          mechanics: MovementMechanics.compound,
          userLevel: profile.experienceLevel,
          strictTargetZones: false,
        );
        isolations = _repository.filterFromCache(
          allExercises,
          availableEquipment: profile.availableEquipment,
          primaryMuscle: target.muscleGroup,
          mechanics: MovementMechanics.isolation,
          userLevel: profile.experienceLevel,
          strictTargetZones: false,
        );
      }

      final compoundSlots = _slotsForMuscle(
        compoundsNeeded,
        template.muscleTargets.length,
        selected
            .where((s) => s.exercise.mechanics == MovementMechanics.compound)
            .length,
        compoundsNeeded,
      );
      final isolationSlots = _slotsForMuscle(
        isolationsNeeded,
        template.muscleTargets.length,
        selected
            .where((s) => s.exercise.mechanics == MovementMechanics.isolation)
            .length,
        isolationsNeeded,
      );

      _pickTop(
        compounds,
        compoundSlots.clamp(0, 2),
        target,
        profile,
        config,
        recentIds,
        usedIds,
        selected,
        maxExercises,
      );
      _pickTop(
        isolations,
        isolationSlots.clamp(0, 1),
        target,
        profile,
        config,
        recentIds,
        usedIds,
        selected,
        maxExercises,
      );

      if (selected.length >= maxExercises) break;
    }

    return selected.take(maxExercises).toList();
  }

  int _slotsForMuscle(
    int totalNeeded,
    int muscleCount,
    int alreadySelected,
    int cap,
  ) {
    if (alreadySelected >= cap) return 0;
    return (totalNeeded / muscleCount).ceil().clamp(1, 2);
  }

  void _pickTop(
    List<Exercise> pool,
    int count,
    MuscleTarget target,
    UserProfile profile,
    AlgorithmConfig config,
    Set<String> recentIds,
    Set<String> usedIds,
    List<SessionExercise> out,
    int maxExercises,
  ) {
    if (count <= 0 || pool.isEmpty) return;

    final ranked = pool
        .where((e) => !usedIds.contains(e.id))
        .map(
          (e) => MapEntry(
            e,
            _score(e, target, profile, config, recentIds),
          ),
        )
        .toList()
      ..sort((a, b) {
        final byScore = b.value.compareTo(a.value);
        if (byScore != 0) return byScore;
        return difficultyRank(a.key.difficulty)
            .compareTo(difficultyRank(b.key.difficulty));
      });

    for (final entry in ranked.take(count)) {
      if (out.length >= maxExercises) break;
      final prescription = _prescriptionEngine.build(
        exerciseId: entry.key.id,
        profile: profile,
        config: config,
      );
      out.add(SessionExercise(exercise: entry.key, prescription: prescription));
      usedIds.add(entry.key.id);
    }
  }

  int _score(
    Exercise exercise,
    MuscleTarget target,
    UserProfile profile,
    AlgorithmConfig config,
    Set<String> recentIds,
  ) {
    var score = 0;
    if (exercise.primaryMuscle == target.muscleGroup) score += 10;
    if (target.targetZones.contains(exercise.targetZone)) score += 5;
    if (exercise.mechanics == MovementMechanics.compound) {
      score += switch (profile.fitnessGoal) {
        FitnessGoal.strength => 8,
        FitnessGoal.hypertrophy => 5,
        FitnessGoal.fatLoss => 6,
        FitnessGoal.endurance => 4,
      };
    }
    if (exercise.matchesEquipment(profile.availableEquipment)) score += 3;
    if (recentIds.contains(exercise.id)) {
      score -= config.recentUsePenaltyScore;
    }
    return score;
  }
}
