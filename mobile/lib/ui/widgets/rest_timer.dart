import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class RestTimer extends StatelessWidget {
  const RestTimer({
    super.key,
    required this.secondsRemaining,
    required this.totalSeconds,
    required this.onSkip,
  });

  final int secondsRemaining;
  final int totalSeconds;
  final VoidCallback onSkip;

  @override
  Widget build(BuildContext context) {
    final progress = totalSeconds > 0
        ? 1 - (secondsRemaining / totalSeconds)
        : 1.0;

    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceHigh,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.accent.withValues(alpha: 0.4)),
      ),
      child: Column(
        children: [
          Text(
            'Rest',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: AppColors.textSecondary,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            _format(secondsRemaining),
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
                  color: AppColors.accent,
                  fontWeight: FontWeight.bold,
                  fontFeatures: const [FontFeature.tabularFigures()],
                ),
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress.clamp(0, 1),
              minHeight: 8,
              backgroundColor: AppColors.surface,
              color: AppColors.accent,
            ),
          ),
          const SizedBox(height: 12),
          TextButton(onPressed: onSkip, child: const Text('Skip rest')),
        ],
      ),
    );
  }

  String _format(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }
}
