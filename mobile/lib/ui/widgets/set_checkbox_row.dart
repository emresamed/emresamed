import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../state/active_workout_notifier.dart';

class SetCheckboxRow extends StatelessWidget {
  const SetCheckboxRow({
    super.key,
    required this.setIndex,
    required this.completed,
    required this.repRange,
    required this.onChanged,
  });

  final int setIndex;
  final bool completed;
  final String repRange;
  final ValueChanged<bool?> onChanged;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: completed
            ? AppColors.accent.withValues(alpha: 0.12)
            : AppColors.surfaceHigh,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: completed ? AppColors.accent : Colors.transparent,
        ),
      ),
      child: Row(
        children: [
          Checkbox(
            value: completed,
            onChanged: onChanged,
            activeColor: AppColors.accent,
            checkColor: AppColors.background,
          ),
          Text(
            'Set $setIndex',
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          const Spacer(),
          Text(
            repRange,
            style: const TextStyle(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}

List<Widget> buildSetRows({
  required List<SetLog> logs,
  required String repRange,
  required void Function(int setIndex) onToggle,
}) {
  return logs
      .map(
        (log) => SetCheckboxRow(
          setIndex: log.setIndex,
          completed: log.completed,
          repRange: repRange,
          onChanged: (_) => onToggle(log.setIndex),
        ),
      )
      .toList();
}
