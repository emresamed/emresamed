import 'package:flutter/material.dart';

import '../../core/enums.dart';
import '../../core/labels.dart';
import '../../core/theme/app_theme.dart';

class MuscleGroupCard extends StatelessWidget {
  const MuscleGroupCard({
    super.key,
    required this.muscle,
    required this.selected,
    required this.onTap,
  });

  final MuscleGroup muscle;
  final bool selected;
  final VoidCallback onTap;

  IconData get _icon => switch (muscle) {
        MuscleGroup.chest => Icons.fitness_center,
        MuscleGroup.back => Icons.accessibility_new,
        MuscleGroup.legs => Icons.directions_run,
        MuscleGroup.shoulders => Icons.sports_gymnastics,
        MuscleGroup.arms => Icons.pan_tool_alt,
        MuscleGroup.core => Icons.self_improvement,
      };

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeOutCubic,
      child: Material(
        color: selected ? AppColors.accent.withValues(alpha: 0.15) : AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: selected ? AppColors.accent : AppColors.surfaceHigh,
                width: selected ? 2 : 1,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _icon,
                  color: selected ? AppColors.accent : AppColors.textSecondary,
                  size: 28,
                ),
                const SizedBox(height: 8),
                Text(
                  labelMuscle(muscle),
                  style: TextStyle(
                    color: selected ? AppColors.accent : AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
