import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../state/active_workout_notifier.dart';
import '../widgets/rest_timer.dart';
import '../widgets/set_checkbox_row.dart';

class ActiveWorkoutScreen extends StatelessWidget {
  const ActiveWorkoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final workout = context.watch<ActiveWorkoutNotifier>();
    final current = workout.currentExercise;

    if (!workout.isActive || current == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Workout')),
        body: const Center(child: Text('No active session')),
      );
    }

    final ex = current.exercise;
    final rx = current.prescription;
    final logs = workout.logsFor(ex.id);
    final repRange = '${rx.repRangeMin}–${rx.repRangeMax} reps';
    final totalSets = rx.sets;
    final completedSets = logs.where((l) => l.completed).length;

    return Scaffold(
      appBar: AppBar(
        title: Text(workout.session?.sessionName ?? 'Workout'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => _confirmEnd(context, workout),
        ),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Text(
                '${workout.exerciseIndex + 1}/${workout.session!.exercises.length}',
                style: const TextStyle(color: AppColors.textSecondary),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          if (workout.isResting)
            RestTimer(
              secondsRemaining: workout.restSecondsRemaining,
              totalSeconds: rx.restSeconds,
              onSkip: workout.skipRest,
            ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    ex.name,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: [
                      _chip(ex.mechanics.name),
                      _chip(ex.primaryMuscle.name),
                      _chip('RPE ${rx.targetRPE}'),
                      _chip('${rx.intensityPercent1RM.round()}% 1RM'),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Sets',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      Text(
                        '$completedSets / $totalSets',
                        style: const TextStyle(color: AppColors.accent),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ...buildSetRows(
                    logs: logs,
                    repRange: repRange,
                    onToggle: (i) => workout.toggleSet(ex.id, i),
                  ),
                  if (ex.instructions != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      ex.instructions!,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        height: 1.4,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
          _bottomBar(context, workout),
        ],
      ),
    );
  }

  Widget _chip(String label) {
    return Chip(
      label: Text(label, style: const TextStyle(fontSize: 12)),
      backgroundColor: AppColors.surfaceHigh,
      side: BorderSide.none,
    );
  }

  Widget _bottomBar(BuildContext context, ActiveWorkoutNotifier workout) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.surfaceHigh)),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed:
                workout.exerciseIndex > 0 ? workout.previousExercise : null,
            icon: const Icon(Icons.chevron_left),
          ),
          Expanded(
            child: ElevatedButton(
              onPressed: () {
                if (workout.exerciseIndex <
                    workout.session!.exercises.length - 1) {
                  workout.nextExercise();
                } else {
                  workout.endWorkout();
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Workout complete!')),
                  );
                }
              },
              child: Text(
                workout.exerciseIndex < workout.session!.exercises.length - 1
                    ? 'Next exercise'
                    : 'Finish workout',
              ),
            ),
          ),
          IconButton(
            onPressed: workout.nextExercise,
            icon: const Icon(Icons.chevron_right),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmEnd(
    BuildContext context,
    ActiveWorkoutNotifier workout,
  ) async {
    final leave = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('End workout?'),
        content: const Text('Progress for this session will be lost.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Stay')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('End', style: TextStyle(color: AppColors.danger)),
          ),
        ],
      ),
    );
    if (leave == true && context.mounted) {
      workout.endWorkout();
      Navigator.of(context).pop();
    }
  }
}
