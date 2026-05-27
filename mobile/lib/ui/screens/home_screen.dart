import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/labels.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/workout_session.dart';
import '../../state/active_workout_notifier.dart';
import '../../state/onboarding_notifier.dart';
import '../../state/workout_program_notifier.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadProgram());
  }

  Future<void> _loadProgram() async {
    final profile = context.read<OnboardingNotifier>().savedProfile;
    if (profile != null) {
      await context.read<WorkoutProgramNotifier>().generate(profile);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = context.watch<OnboardingNotifier>().savedProfile;
    final program = context.watch<WorkoutProgramNotifier>();

    if (profile == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('FitForge'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: program.loading ? null : _loadProgram,
          ),
        ],
      ),
      body: program.loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.accent))
          : program.error != null
              ? _errorView(program.error!)
              : _programView(profile.bodyType.name, program.sessions),
    );
  }

  Widget _errorView(String error) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Text(error, textAlign: TextAlign.center),
      ),
    );
  }

  Widget _programView(String bodyType, List<WorkoutSession> sessions) {
    final program = context.read<WorkoutProgramNotifier>().program!;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  labelSplit(program.splitType),
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 4),
                Text(
                  'Body: $bodyType · ${sessions.length} sessions / week',
                  style: const TextStyle(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        ...sessions.map((session) => _sessionCard(session)),
      ],
    );
  }

  Widget _sessionCard(WorkoutSession session) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        title: Text(
          session.sessionName,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(
          '${session.exercises.length} exercises'
          '${session.conditioningMinutes > 0 ? ' · ${session.conditioningMinutes} min cardio' : ''}',
        ),
        trailing: const Icon(Icons.play_arrow_rounded, color: AppColors.accent, size: 32),
        onTap: () {
          context.read<ActiveWorkoutNotifier>().startSession(session);
          Navigator.of(context).pushNamed('/workout');
        },
      ),
    );
  }
}

extension on WorkoutProgramNotifier {
  List<WorkoutSession> get sessions => program?.sessions ?? [];
}
