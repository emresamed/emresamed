import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList, OnboardingStackParamList } from '../types';
import { useUserProfileStore } from '../store/userProfileStore';
import { Colors } from '../theme/colors';

// Onboarding screens
import { BodyTypeScreen } from '../screens/Onboarding/BodyTypeScreen';
import { GoalScreen } from '../screens/Onboarding/GoalScreen';
import { EquipmentScreen } from '../screens/Onboarding/EquipmentScreen';
import { DaysPerWeekScreen } from '../screens/Onboarding/DaysPerWeekScreen';

// App screens
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ActiveWorkoutScreen } from '../screens/Workout/ActiveWorkoutScreen';
import { WorkoutSummaryScreen } from '../screens/Workout/WorkoutSummaryScreen';

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const sharedScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: Colors.bg },
  animation: 'slide_from_right' as const,
};

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={sharedScreenOptions}>
      <OnboardingStack.Screen name="BodyType" component={BodyTypeScreen} />
      <OnboardingStack.Screen name="Goal" component={GoalScreen} />
      <OnboardingStack.Screen name="Equipment" component={EquipmentScreen} />
      <OnboardingStack.Screen name="DaysPerWeek" component={DaysPerWeekScreen} />
    </OnboardingStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <AppStack.Navigator screenOptions={sharedScreenOptions}>
      <AppStack.Screen name="Home" component={HomeScreen} />
      <AppStack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
      <AppStack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
    </AppStack.Navigator>
  );
}

export function AppNavigator() {
  const isOnboarded = useUserProfileStore((s) => s.isOnboarded);

  return (
    <NavigationContainer>
      {isOnboarded ? <MainNavigator /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}
