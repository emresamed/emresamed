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
  int _restTotalSeconds = 0;
  bool _isResting = false;

  WorkoutSession? get session => _session;
  int get exerciseIndex => _exerciseIndex;
  bool get isActive => _session != null;
  bool get isResting => _isResting;
  int get restSecondsRemaining => _restSecondsRemaining;
  int get restTotalSeconds => _restTotalSeconds;

  SessionExercise? get currentExercise {
    final s = _session;
    if (s == null || s.exercises.isEmpty) return null;
    if (_exerciseIndex < 0 || _exerciseIndex >= s.exercises.length) return null;
    return s.exercises[_exerciseIndex];
  }

  List<SetLog> logsFor(String exerciseId) =>
      _setLogs[exerciseId] ?? const [];

  void startSession(WorkoutSession session) {
    _cancelRestTimer();
    if (session.exercises.isEmpty) {
      debugPrint('ActiveWorkout: cannot start empty session');
      return;
    }
    _session = session;
    _exerciseIndex = 0;
    _setLogs.clear();
    for (final ex in session.exercises) {
      final sets = ex.prescription.sets.clamp(1, 6);
      _setLogs[ex.exercise.id] =
          List.generate(sets, (i) => SetLog(setIndex: i + 1));
    }
    notifyListeners();
  }

  void toggleSet(String exerciseId, int setIndex) {
    final logs = _setLogs[exerciseId];
    if (logs == null) return;

    final index = logs.indexWhere((l) => l.setIndex == setIndex);
    if (index < 0) return;

    final log = logs[index];
    final wasCompleted = log.completed;
    log.completed = !log.completed;
    notifyListeners();

    if (!log.completed && wasCompleted) {
      if (_isResting) skipRest();
      return;
    }

    if (log.completed &&
        currentExercise?.exercise.id == exerciseId &&
        _exerciseIndex < (_session?.exercises.length ?? 0)) {
      final rest = currentExercise!.prescription.restSeconds;
      startRest(rest);
    }
  }

  void startRest(int seconds) {
    _cancelRestTimer();
    if (seconds <= 0) return;

    _restTotalSeconds = seconds;
    _restSecondsRemaining = seconds;
    _isResting = true;
    notifyListeners();

    _restTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_restSecondsRemaining <= 1) {
        _finishRest();
        timer.cancel();
      } else {
        _restSecondsRemaining--;
        notifyListeners();
      }
    });
  }

  void skipRest() => _finishRest();

  void _finishRest() {
    _cancelRestTimer();
    _isResting = false;
    _restSecondsRemaining = 0;
    notifyListeners();
  }

  void _cancelRestTimer() {
    _restTimer?.cancel();
    _restTimer = null;
  }

  void nextExercise() {
    final s = _session;
    if (s == null) return;
    if (_exerciseIndex < s.exercises.length - 1) {
      _exerciseIndex++;
      _finishRest();
    }
  }

  void previousExercise() {
    if (_exerciseIndex > 0) {
      _exerciseIndex--;
      _finishRest();
    }
  }

  void endWorkout() {
    _cancelRestTimer();
    _session = null;
    _exerciseIndex = 0;
    _setLogs.clear();
    _isResting = false;
    _restSecondsRemaining = 0;
    _restTotalSeconds = 0;
    notifyListeners();
  }

  bool get isSessionComplete {
    final s = _session;
    final current = currentExercise;
    if (s == null || current == null) return false;
    final logs = _setLogs[current.exercise.id];
    if (logs == null || logs.isEmpty) return false;
    return _exerciseIndex >= s.exercises.length - 1 &&
        logs.every((l) => l.completed);
  }

  @override
  void dispose() {
    _finishRest();
    super.dispose();
  }
}
