import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/enums.dart';
import '../../core/labels.dart';
import '../../core/theme/app_theme.dart';
import '../../state/onboarding_notifier.dart';
import '../widgets/muscle_group_card.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageController = PageController();
  int _page = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final onboarding = context.watch<OnboardingNotifier>();

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Text(
                    'FitForge',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.accent,
                        ),
                  ),
                  const Spacer(),
                  Text('${_page + 1}/4'),
                ],
              ),
            ),
            Expanded(
              child: PageView(
                controller: _pageController,
                onPageChanged: (i) => setState(() => _page = i),
                children: [
                  _bodyTypePage(onboarding),
                  _goalPage(onboarding),
                  _equipmentPage(onboarding),
                  _schedulePage(onboarding),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  if (_page > 0)
                    TextButton(
                      onPressed: () => _pageController.previousPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeOut,
                      ),
                      child: const Text('Back'),
                    ),
                  const Spacer(),
                  ElevatedButton(
                    onPressed: () => _onNext(onboarding),
                    child: Text(_page == 3 ? 'Finish' : 'Next'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _onNext(OnboardingNotifier onboarding) async {
    if (_page < 3) {
      await _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
      return;
    }
    if (!onboarding.canFinish) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please complete all steps')),
      );
      return;
    }
    await onboarding.saveProfile();
    if (mounted) Navigator.of(context).pushReplacementNamed('/home');
  }

  Widget _bodyTypePage(OnboardingNotifier o) {
    return _stepShell(
      title: 'Body type',
      subtitle: 'We tune volume and rest for your metabolism.',
      child: Column(
        children: BodyType.values.map((bt) {
          final selected = o.bodyType == bt;
          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              tileColor: selected
                  ? AppColors.accent.withValues(alpha: 0.12)
                  : AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
                side: BorderSide(
                  color: selected ? AppColors.accent : AppColors.surfaceHigh,
                ),
              ),
              title: Text(labelBodyType(bt)),
              trailing: selected
                  ? const Icon(Icons.check_circle, color: AppColors.accent)
                  : null,
              onTap: () => o.setBodyType(bt),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _goalPage(OnboardingNotifier o) {
    return _stepShell(
      title: 'Training goal',
      subtitle: 'Sets, reps, and intensity follow your goal.',
      child: Wrap(
        spacing: 10,
        runSpacing: 10,
        children: FitnessGoal.values.map((g) {
          final selected = o.fitnessGoal == g;
          return ChoiceChip(
            label: Text(labelGoal(g)),
            selected: selected,
            onSelected: (_) => o.setFitnessGoal(g),
            selectedColor: AppColors.accent.withValues(alpha: 0.25),
            labelStyle: TextStyle(
              color: selected ? AppColors.accent : AppColors.textPrimary,
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _equipmentPage(OnboardingNotifier o) {
    return _stepShell(
      title: 'Available equipment',
      subtitle: 'Only exercises you can perform will appear.',
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: Equipment.values.map((e) {
          final selected = o.equipment.contains(e);
          return FilterChip(
            label: Text(labelEquipment(e)),
            selected: selected,
            onSelected: (_) => o.toggleEquipment(e),
            selectedColor: AppColors.accent.withValues(alpha: 0.25),
          );
        }).toList(),
      ),
    );
  }

  Widget _schedulePage(OnboardingNotifier o) {
    return _stepShell(
      title: 'Schedule & experience',
      subtitle: 'Split is auto-selected; override if you prefer.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Days per week: ${o.daysPerWeek}',
              style: const TextStyle(fontWeight: FontWeight.w600)),
          Slider(
            value: o.daysPerWeek.toDouble(),
            min: 2,
            max: 6,
            divisions: 4,
            label: '${o.daysPerWeek}',
            onChanged: (v) => o.setDaysPerWeek(v.round()),
          ),
          const SizedBox(height: 16),
          Text('Experience', style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 8),
          SegmentedButton<ExperienceLevel>(
            segments: ExperienceLevel.values
                .map((l) => ButtonSegment(
                      value: l,
                      label: Text(labelExperience(l),
                          style: const TextStyle(fontSize: 11)),
                    ))
                .toList(),
            selected: {o.experienceLevel},
            onSelectionChanged: (s) => o.setExperienceLevel(s.first),
          ),
          const SizedBox(height: 20),
          Text('Focus preview', style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 8),
          SizedBox(
            height: 100,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: MuscleGroup.values
                  .map(
                    (m) => SizedBox(
                      width: 100,
                      child: MuscleGroupCard(
                        muscle: m,
                        selected: false,
                        onTap: () {},
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _stepShell({
    required String title,
    required String subtitle,
    required Widget child,
  }) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          Text(subtitle, style: const TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          child,
        ],
      ),
    );
  }
}
