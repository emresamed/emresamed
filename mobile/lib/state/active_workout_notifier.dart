import 'dart:async';

import 'package:flutter/foundation.dart';

import '../data/models/session_exercise.dart';
import '../data/models/workout_session.dart';

class SetLog {
  SetLog({required this.setIndex, this.completed = false});

  final int setIndex;
  bool completed;
}

class ActiveWorkoutNotifier extends ChangeNotifier {
  WorkoutSession? _session;
  int _exerciseIndex = 0;
  final Map<String, List<SetLog>> _setLogs = {};
  Timer? _restTimer;
  int _restSecondsRemaining = 0;
  bool _isResting = false;

  WorkoutSession? get session => _session;
  int get exerciseIndex => _exerciseIndex;
  bool get isActive => _session != null;
  bool get isResting => _isResting;
  int get restSecondsRemaining => _restSecondsRemaining;

  SessionExercise? get currentExercise {
    if (_session == null || _exerciseIndex >= _session!.exercises.length) {
      return null;
    }
    return _session!.exercises[_exerciseIndex];
  }

  List<SetLog> logsFor(String exerciseId) =>
      _setLogs[exerciseId] ?? const [];

  void startSession(WorkoutSession session) {
    _restTimer?.cancel();
    _session = session;
    _exerciseIndex = 0;
    _setLogs.clear();
    _isResting = false;
    _restSecondsRemaining = 0;
    for (final ex in session.exercises) {
      _setLogs[ex.exercise.id] = List.generate(
        ex.prescription.sets,
        (i) => SetLog(setIndex: i + 1),
      );
    }
    notifyListeners();
  }

  void toggleSet(String exerciseId, int setIndex) {
    final logs = _setLogs[exerciseId];
    if (logs == null) return;
    final log = logs.firstWhere((l) => l.setIndex == setIndex);
    log.completed = !log.completed;
    notifyListeners();
    if (log.completed && currentExercise?.exercise.id == exerciseId) {
      startRest(currentExercise!.prescription.restSeconds);
    }
  }

  void startRest(int seconds) {
    _restTimer?.cancel();
    _restSecondsRemaining = seconds;
    _isResting = true;
    notifyListeners();
    _restTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_restSecondsRemaining <= 1) {
        timer.cancel();
        _isResting = false;
        _restSecondsRemaining = 0;
      } else {
        _restSecondsRemaining--;
      }
      notifyListeners();
    });
  }

  void skipRest() {
    _restTimer?.cancel();
    _isResting = false;
    _restSecondsRemaining = 0;
    notifyListeners();
  }

  void nextExercise() {
    if (_session == null) return;
    if (_exerciseIndex < _session!.exercises.length - 1) {
      _exerciseIndex++;
      _isResting = false;
      _restSecondsRemaining = 0;
      _restTimer?.cancel();
      notifyListeners();
    }
  }

  void previousExercise() {
    if (_exerciseIndex > 0) {
      _exerciseIndex--;
      notifyListeners();
    }
  }

  void endWorkout() {
    _restTimer?.cancel();
    _session = null;
    _exerciseIndex = 0;
    _setLogs.clear();
    _isResting = false;
    _restSecondsRemaining = 0;
    notifyListeners();
  }

  bool get isSessionComplete {
    if (_session == null) return false;
    return _exerciseIndex >= _session!.exercises.length - 1 &&
        (_setLogs[currentExercise?.exercise.id ?? '']?.every((l) => l.completed) ??
            false);
  }

  @override
  void dispose() {
    _restTimer?.cancel();
    super.dispose();
  }
}
