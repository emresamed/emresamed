import 'dart:convert';

import 'package:flutter/services.dart';

import '../../core/errors.dart';
import '../models/algorithm_config.dart';
import '../models/exercise.dart';
import '../models/split_template.dart';

class SeedDataSource {
  List<Exercise>? _exercises;
  List<SplitSessionTemplate>? _templates;
  AlgorithmConfig? _config;

  Future<List<Exercise>> loadExercises() async {
    if (_exercises != null) return _exercises!;
    try {
      final raw = await rootBundle.loadString('assets/data/exercises.seed.json');
      final json = jsonDecode(raw) as Map<String, dynamic>;
      final list = json['exercises'];
      if (list is! List || list.isEmpty) {
        throw SeedDataException('exercises.seed.json has no exercises');
      }
      _exercises = list
          .map((e) => Exercise.fromJson(e as Map<String, dynamic>))
          .toList();
      return _exercises!;
    } on SeedDataException {
      rethrow;
    } catch (e) {
      throw SeedDataException('Invalid exercises.seed.json', cause: e);
    }
  }

  Future<List<SplitSessionTemplate>> loadSplitTemplates() async {
    if (_templates != null) return _templates!;
    try {
      final raw =
          await rootBundle.loadString('assets/data/split_templates.seed.json');
      final json = jsonDecode(raw) as Map<String, dynamic>;
      final list = json['templates'];
      if (list is! List || list.isEmpty) {
        throw SeedDataException('split_templates.seed.json is empty');
      }
      _templates = list
          .map((e) => SplitSessionTemplate.fromJson(e as Map<String, dynamic>))
          .toList();
      return _templates!;
    } on SeedDataException {
      rethrow;
    } catch (e) {
      throw SeedDataException('Invalid split_templates.seed.json', cause: e);
    }
  }

  Future<AlgorithmConfig> loadAlgorithmConfig() async {
    if (_config != null) return _config!;
    try {
      final raw =
          await rootBundle.loadString('assets/data/algorithm_config.json');
      _config =
          AlgorithmConfig.fromJson(jsonDecode(raw) as Map<String, dynamic>);
      return _config!;
    } catch (e) {
      throw SeedDataException('Invalid algorithm_config.json', cause: e);
    }
  }

  Future<void> preloadAll() async {
    await Future.wait([
      loadExercises(),
      loadSplitTemplates(),
      loadAlgorithmConfig(),
    ]);
  }
}
