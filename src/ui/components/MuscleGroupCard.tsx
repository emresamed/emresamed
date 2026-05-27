import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MuscleGroup } from "../../domain/types";
import { darkTheme } from "../theme/darkTheme";

interface MuscleGroupCardProps {
  muscleGroup: MuscleGroup;
  selected: boolean;
  onPress: () => void;
}

const labels: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  legs: "Legs",
  shoulders: "Shoulders",
  arms: "Arms",
  core: "Core"
};

export const MuscleGroupCard = memo(function MuscleGroupCard({
  muscleGroup,
  selected,
  onPress
}: MuscleGroupCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected && styles.selectedCard]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${labels[muscleGroup]} muscle group`}
    >
      <View style={[styles.dot, selected && styles.dotSelected]} />
      <Text style={styles.label}>{labels[muscleGroup]}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: darkTheme.colors.surface,
    borderColor: darkTheme.colors.border,
    borderRadius: darkTheme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: darkTheme.spacing.sm,
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm
  },
  selectedCard: {
    borderColor: darkTheme.colors.accent,
    shadowColor: darkTheme.colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 8
  },
  dot: {
    backgroundColor: darkTheme.colors.border,
    borderRadius: 99,
    height: 10,
    width: 10
  },
  dotSelected: {
    backgroundColor: darkTheme.colors.accent
  },
  label: {
    color: darkTheme.colors.textPrimary,
    fontSize: darkTheme.typography.body,
    fontWeight: "600"
  }
});
