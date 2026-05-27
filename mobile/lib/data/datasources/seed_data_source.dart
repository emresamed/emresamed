import 'dart:convert';

import 'package:flutter/services.dart';

import '../models/algorithm_config.dart';
import '../models/exercise.dart';
import '../models/split_template.dart';

class SeedDataSource {
  List<Exercise>? _exercises;
  List<SplitSessionTemplate>? _templates;
  AlgorithmConfig? _config;

  Future<List<Exercise>> loadExercises() async {
    if (_exercises != null) return _exercises!;
    final raw = await rootBundle.loadString('assets/data/exercises.seed.json');
    final json = jsonDecode(raw) as Map<String, dynamic>;
    _exercises = (json['exercises'] as List<dynamic>)
        .map((e) => Exercise.fromJson(e as Map<String, dynamic>))
        .toList();
    return _exercises!;
  }

  Future<List<SplitSessionTemplate>> loadSplitTemplates() async {
    if (_templates != null) return _templates!;
    final raw =
        await rootBundle.loadString('assets/data/split_templates.seed.json');
    final json = jsonDecode(raw) as Map<String, dynamic>;
    _templates = (json['templates'] as List<dynamic>)
        .map((e) => SplitSessionTemplate.fromJson(e as Map<String, dynamic>))
        .toList();
    return _templates!;
  }

  Future<AlgorithmConfig> loadAlgorithmConfig() async {
    if (_config != null) return _config!;
    final raw =
        await rootBundle.loadString('assets/data/algorithm_config.json');
    _config = AlgorithmConfig.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    return _config!;
  }

  Future<void> preloadAll() async {
    await Future.wait([
      loadExercises(),
      loadSplitTemplates(),
      loadAlgorithmConfig(),
    ]);
  }
}
