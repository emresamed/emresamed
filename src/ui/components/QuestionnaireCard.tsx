import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { darkTheme } from "../theme/darkTheme";

interface QuestionOption<T extends string> {
  label: string;
  value: T;
}

interface QuestionnaireCardProps<T extends string> {
  title: string;
  description: string;
  options: QuestionOption<T>[];
  selectedValue: T | undefined;
  onSelect: (value: T) => void;
}

export function QuestionnaireCard<T extends string>({
  title,
  description,
  options,
  selectedValue,
  onSelect
}: QuestionnaireCardProps<T>) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.optionList}>
        {options.map((option) => {
          const selected = selectedValue === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[styles.option, selected && styles.optionSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${option.label} option`}
            >
              <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

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
  description: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.body
  },
  optionList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: darkTheme.spacing.sm
  },
  option: {
    backgroundColor: darkTheme.colors.surface,
    borderColor: darkTheme.colors.border,
    borderRadius: darkTheme.radius.md,
    borderWidth: 1,
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.sm
  },
  optionSelected: {
    backgroundColor: darkTheme.colors.accent
  },
  optionLabel: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.body,
    fontWeight: "600"
  },
  optionLabelSelected: {
    color: darkTheme.colors.textPrimary
  }
});
