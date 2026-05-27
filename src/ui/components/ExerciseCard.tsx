import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { WorkoutExercise } from "../../domain/types";
import { darkTheme } from "../theme/darkTheme";

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  title: string;
  checkedSetKeys: Set<string>;
  onToggleSet: (setIndex: number) => void;
}

export const ExerciseCard = memo(function ExerciseCard({
  exercise,
  title,
  checkedSetKeys,
  onToggleSet
}: ExerciseCardProps) {
  return (
    <View style={styles.card} accessibilityRole="summary" accessible>
      <Text style={styles.title}>{title}</Text>
      {exercise.sets.map((setEntry, index) => {
        const setKey = `${exercise.exerciseId}-${index}`;
        const isChecked = checkedSetKeys.has(setKey);

        return (
          <Pressable
            key={setKey}
            onPress={() => onToggleSet(index)}
            style={[styles.setRow, isChecked && styles.setRowChecked]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked }}
            accessibilityLabel={`Set ${index + 1}, ${setEntry.repsMin} to ${setEntry.repsMax} reps`}
          >
            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]} />
            <View style={styles.setMeta}>
              <Text style={styles.setPrimary}>
                Set {index + 1}: {setEntry.repsMin}-{setEntry.repsMax} reps
              </Text>
              <Text style={styles.setSecondary}>
                Target RPE {setEntry.targetRPE} • Rest {setEntry.restSec}s
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: darkTheme.colors.card,
    borderColor: darkTheme.colors.border,
    borderRadius: darkTheme.radius.lg,
    borderWidth: 1,
    gap: darkTheme.spacing.sm,
    padding: darkTheme.spacing.md
  },
  title: {
    color: darkTheme.colors.textPrimary,
    fontSize: darkTheme.typography.heading,
    fontWeight: "700"
  },
  setRow: {
    alignItems: "center",
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.radius.md,
    flexDirection: "row",
    gap: darkTheme.spacing.sm,
    padding: darkTheme.spacing.sm
  },
  setRowChecked: {
    borderColor: darkTheme.colors.success,
    borderWidth: 1
  },
  checkbox: {
    backgroundColor: "transparent",
    borderColor: darkTheme.colors.textSecondary,
    borderRadius: darkTheme.radius.sm,
    borderWidth: 2,
    height: 20,
    width: 20
  },
  checkboxChecked: {
    backgroundColor: darkTheme.colors.success,
    borderColor: darkTheme.colors.success
  },
  setMeta: {
    flex: 1,
    gap: darkTheme.spacing.xxs
  },
  setPrimary: {
    color: darkTheme.colors.textPrimary,
    fontSize: darkTheme.typography.body,
    fontWeight: "600"
  },
  setSecondary: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.caption
  }
});
