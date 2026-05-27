import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  BODY_TYPES,
  BodyType,
  GOALS,
  Goal,
  MuscleGroup,
  TRAINING_AGES,
  TrainingAge,
  UserMetrics
} from "../../domain/types";
import { OnboardingStore } from "../../state/onboardingStore";
import { MuscleGroupCard } from "../components/MuscleGroupCard";
import { QuestionnaireCard } from "../components/QuestionnaireCard";
import { darkTheme } from "../theme/darkTheme";

interface OnboardingScreenProps {
  store: OnboardingStore;
  onCompleted: (metrics: UserMetrics, preferredMuscles: MuscleGroup[]) => void;
}

const availableEquipment = [
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "bodyweight",
  "kettlebell",
  "band"
] as const;

const muscleGroups: MuscleGroup[] = ["chest", "back", "legs", "shoulders", "arms", "core"];

export function OnboardingScreen({ store, onCompleted }: OnboardingScreenProps) {
  const [state, setState] = useState(store.getState());
  const [preferredMuscles, setPreferredMuscles] = useState<MuscleGroup[]>(["chest", "back"]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => store.subscribe(setState), [store]);

  const bodyTypeOptions = useMemo(
    () => BODY_TYPES.map((bodyType) => ({ label: bodyType, value: bodyType as BodyType })),
    []
  );
  const goalOptions = useMemo(
    () => GOALS.map((goal) => ({ label: goal, value: goal as Goal })),
    []
  );
  const trainingAgeOptions = useMemo(
    () =>
      TRAINING_AGES.map((trainingAge) => ({
        label: trainingAge,
        value: trainingAge as TrainingAge
      })),
    []
  );
  const daysOptions = useMemo(
    () =>
      [2, 3, 4, 5, 6].map((dayCount) => ({
        label: `${dayCount} days`,
        value: String(dayCount)
      })),
    []
  );

  const toggleEquipment = (equipment: string): void => {
    const current = state.draft.equipmentOwned;
    const next = current.includes(equipment)
      ? current.filter((item) => item !== equipment)
      : [...current, equipment];
    store.setEquipment(next);
  };

  const toggleMuscle = (muscle: MuscleGroup): void => {
    setPreferredMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((item) => item !== muscle) : [...prev, muscle]
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Build Your Personalized Plan</Text>
        <Text style={styles.headerSubtitle}>
          Select profile details and preferred focus muscles.
        </Text>
      </View>

      <QuestionnaireCard<BodyType>
        title="Body Type"
        description="Used for volume, intensity, and recovery adjustments."
        options={bodyTypeOptions}
        selectedValue={state.draft.bodyType}
        onSelect={(value) => store.setBodyType(value)}
      />

      <QuestionnaireCard<Goal>
        title="Primary Goal"
        description="Determines rep ranges and compound/isolation ratio."
        options={goalOptions}
        selectedValue={state.draft.goal}
        onSelect={(value) => store.setGoal(value)}
      />

      <QuestionnaireCard<TrainingAge>
        title="Training Experience"
        description="Matches exercise complexity with your skill level."
        options={trainingAgeOptions}
        selectedValue={state.draft.trainingAge}
        onSelect={(value) => store.setTrainingAge(value)}
      />

      <QuestionnaireCard<string>
        title="Training Days Per Week"
        description="Split templates are selected from this value."
        options={daysOptions}
        selectedValue={state.draft.daysPerWeek ? String(state.draft.daysPerWeek) : undefined}
        onSelect={(value) => store.setDaysPerWeek(Number(value))}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Equipment</Text>
        <View style={styles.equipmentWrap}>
          {availableEquipment.map((equipment) => {
            const selected = state.draft.equipmentOwned.includes(equipment);
            return (
              <Pressable
                key={equipment}
                onPress={() => toggleEquipment(equipment)}
                style={[styles.equipmentChip, selected && styles.equipmentChipSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${equipment} equipment`}
              >
                <Text style={[styles.equipmentChipLabel, selected && styles.equipmentChipLabelSelected]}>
                  {equipment}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Muscle Priority Cards</Text>
        <View style={styles.muscleWrap}>
          {muscleGroups.map((muscle) => (
            <MuscleGroupCard
              key={muscle}
              muscleGroup={muscle}
              selected={preferredMuscles.includes(muscle)}
              onPress={() => toggleMuscle(muscle)}
            />
          ))}
        </View>
      </View>

      {state.errors.length > 0 ? (
        <View style={styles.errorBox}>
          {state.errors.map((error) => (
            <Text key={error} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      ) : null}

      {submitError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>• {submitError}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => {
          try {
            setSubmitError(null);
            const metrics = store.complete();
            onCompleted(metrics, preferredMuscles);
          } catch (error) {
            setSubmitError(
              error instanceof Error ? error.message : "Unexpected onboarding error occurred"
            );
          }
        }}
        style={styles.cta}
        accessibilityRole="button"
        accessibilityLabel="Generate workout plan"
      >
        <Text style={styles.ctaLabel}>Generate Plan</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: darkTheme.colors.background,
    flex: 1
  },
  content: {
    gap: darkTheme.spacing.md,
    padding: darkTheme.spacing.md
  },
  header: {
    gap: darkTheme.spacing.xs
  },
  headerTitle: {
    color: darkTheme.colors.textPrimary,
    fontSize: darkTheme.typography.title,
    fontWeight: "700"
  },
  headerSubtitle: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.body
  },
  section: {
    backgroundColor: darkTheme.colors.card,
    borderColor: darkTheme.colors.border,
    borderRadius: darkTheme.radius.lg,
    borderWidth: 1,
    gap: darkTheme.spacing.sm,
    padding: darkTheme.spacing.md
  },
  sectionTitle: {
    color: darkTheme.colors.textPrimary,
    fontSize: darkTheme.typography.heading,
    fontWeight: "700"
  },
  equipmentWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: darkTheme.spacing.sm
  },
  equipmentChip: {
    backgroundColor: darkTheme.colors.surface,
    borderColor: darkTheme.colors.border,
    borderRadius: darkTheme.radius.md,
    borderWidth: 1,
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm
  },
  equipmentChipSelected: {
    backgroundColor: darkTheme.colors.accent
  },
  equipmentChipLabel: {
    color: darkTheme.colors.textSecondary,
    fontWeight: "600"
  },
  equipmentChipLabelSelected: {
    color: darkTheme.colors.textPrimary
  },
  muscleWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: darkTheme.spacing.sm
  },
  errorBox: {
    backgroundColor: "#2A1515",
    borderColor: darkTheme.colors.danger,
    borderRadius: darkTheme.radius.md,
    borderWidth: 1,
    gap: darkTheme.spacing.xs,
    padding: darkTheme.spacing.sm
  },
  errorText: {
    color: darkTheme.colors.danger,
    fontSize: darkTheme.typography.body
  },
  cta: {
    alignItems: "center",
    backgroundColor: darkTheme.colors.accent,
    borderRadius: darkTheme.radius.md,
    paddingVertical: darkTheme.spacing.md
  },
  ctaLabel: {
    color: darkTheme.colors.textPrimary,
    fontSize: darkTheme.typography.body,
    fontWeight: "700"
  }
});
