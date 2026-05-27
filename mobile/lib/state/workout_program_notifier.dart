import 'package:flutter/foundation.dart';

import '../data/models/generated_workout.dart';
import '../data/models/user_profile.dart';
import '../domain/services/workout_generator.dart';

class WorkoutProgramNotifier extends ChangeNotifier {
  WorkoutProgramNotifier(this._generator);

  final WorkoutGenerator _generator;

  GeneratedWorkout? _program;
  bool _loading = false;
  String? _error;

  GeneratedWorkout? get program => _program;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> generate(UserProfile profile) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      _program = await _generator.generate(profile);
    } catch (e, st) {
      _error = e.toString();
      debugPrint('Workout generation failed: $e\n$st');
      _program = null;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
}
