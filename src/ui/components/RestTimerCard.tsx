import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { darkTheme } from "../theme/darkTheme";

interface RestTimerCardProps {
  remainingSec: number;
  progress: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function RestTimerCard({
  remainingSec,
  progress,
  isRunning,
  onStart,
  onPause,
  onReset
}: RestTimerCardProps) {
  const progressWidth = `${Math.round(progress * 100)}%` as `${number}%`;

  return (
    <View style={styles.card} accessibilityRole="summary" accessible>
      <Text style={styles.heading}>Rest Timer</Text>
      <Text style={styles.time}>{remainingSec}s</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.actions}>
        {!isRunning ? (
          <Pressable
            onPress={onStart}
            style={styles.primaryButton}
            accessibilityRole="button"
            accessibilityLabel="Start rest timer"
          >
            <Text style={styles.primaryButtonText}>Start</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onPause}
            style={styles.secondaryButton}
            accessibilityRole="button"
            accessibilityLabel="Pause rest timer"
          >
            <Text style={styles.secondaryButtonText}>Pause</Text>
          </Pressable>
        )}

        <Pressable
          onPress={onReset}
          style={styles.secondaryButton}
          accessibilityRole="button"
          accessibilityLabel="Reset rest timer"
        >
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </Pressable>
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
  heading: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.body,
    fontWeight: "600"
  },
  time: {
    color: darkTheme.colors.textPrimary,
    fontSize: 32,
    fontWeight: "700"
  },
  progressTrack: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: 999,
    height: 8,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: darkTheme.colors.accent,
    height: "100%"
  },
  actions: {
    flexDirection: "row",
    gap: darkTheme.spacing.sm
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: darkTheme.colors.accent,
    borderRadius: darkTheme.radius.md,
    flex: 1,
    paddingVertical: darkTheme.spacing.sm
  },
  primaryButtonText: {
    color: darkTheme.colors.textPrimary,
    fontSize: darkTheme.typography.body,
    fontWeight: "700"
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: darkTheme.colors.surface,
    borderColor: darkTheme.colors.border,
    borderRadius: darkTheme.radius.md,
    borderWidth: 1,
    flex: 1,
    paddingVertical: darkTheme.spacing.sm
  },
  secondaryButtonText: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.body,
    fontWeight: "700"
  }
});
