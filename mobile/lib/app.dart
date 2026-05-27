import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/theme/app_theme.dart';
import 'data/datasources/seed_data_source.dart';
import 'data/repositories/exercise_repository.dart';
import 'domain/services/prescription_engine.dart';
import 'domain/services/split_selector.dart';
import 'domain/services/workout_generator.dart';
import 'state/active_workout_notifier.dart';
import 'state/onboarding_notifier.dart';
import 'state/workout_program_notifier.dart';
import 'ui/screens/active_workout_screen.dart';
import 'ui/screens/home_screen.dart';
import 'ui/screens/onboarding_screen.dart';

class FitForgeApp extends StatelessWidget {
  const FitForgeApp({super.key});

  @override
  Widget build(BuildContext context) {
    final seedSource = SeedDataSource();
    final repository = ExerciseRepository(seedSource);
    final generator = WorkoutGenerator(
      repository,
      SplitSelector(),
      PrescriptionEngine(),
    );

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => OnboardingNotifier()..load()),
        ChangeNotifierProvider(
          create: (_) => WorkoutProgramNotifier(generator),
        ),
        ChangeNotifierProvider(create: (_) => ActiveWorkoutNotifier()),
      ],
      child: MaterialApp(
        title: 'FitForge',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.dark,
        home: const _RootGate(),
        routes: {
          '/onboarding': (_) => const OnboardingScreen(),
          '/home': (_) => const HomeScreen(),
          '/workout': (_) => const ActiveWorkoutScreen(),
        },
      ),
    );
  }
}

class _RootGate extends StatelessWidget {
  const _RootGate();

  @override
  Widget build(BuildContext context) {
    final onboarding = context.watch<OnboardingNotifier>();
    if (onboarding.isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: AppColors.accent)),
      );
    }
    return onboarding.isComplete
        ? const HomeScreen()
        : const OnboardingScreen();
  }
}
