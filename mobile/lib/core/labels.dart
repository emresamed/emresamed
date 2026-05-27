import 'enums.dart';

String labelBodyType(BodyType t) => switch (t) {
      BodyType.ectomorph => 'Ectomorph',
      BodyType.mesomorph => 'Mesomorph',
      BodyType.endomorph => 'Endomorph',
    };

String labelGoal(FitnessGoal g) => switch (g) {
      FitnessGoal.strength => 'Strength',
      FitnessGoal.hypertrophy => 'Hypertrophy',
      FitnessGoal.fatLoss => 'Fat Loss',
      FitnessGoal.endurance => 'Endurance',
    };

String labelMuscle(MuscleGroup m) => switch (m) {
      MuscleGroup.chest => 'Chest',
      MuscleGroup.back => 'Back',
      MuscleGroup.legs => 'Legs',
      MuscleGroup.shoulders => 'Shoulders',
      MuscleGroup.arms => 'Arms',
      MuscleGroup.core => 'Core',
    };

String labelEquipment(Equipment e) => switch (e) {
      Equipment.barbell => 'Barbell',
      Equipment.dumbbell => 'Dumbbell',
      Equipment.cable => 'Cable',
      Equipment.machine => 'Machine',
      Equipment.bodyweight => 'Bodyweight',
      Equipment.kettlebell => 'Kettlebell',
      Equipment.resistanceBand => 'Band',
      Equipment.smithMachine => 'Smith',
      Equipment.ezBar => 'EZ Bar',
    };

String labelSplit(SplitType s) => switch (s) {
      SplitType.pushPullLegs => 'Push / Pull / Legs',
      SplitType.upperLower => 'Upper / Lower',
      SplitType.fullBody => 'Full Body',
    };

String labelExperience(ExperienceLevel l) => switch (l) {
      ExperienceLevel.beginner => 'Beginner',
      ExperienceLevel.intermediate => 'Intermediate',
      ExperienceLevel.advanced => 'Advanced',
    };
