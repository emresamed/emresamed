import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { RestTimerState } from '../types';

interface RestTimerProps {
  timerState: RestTimerState;
  onTick: () => void;
  onSkip: () => void;
  onComplete?: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  timerState,
  onTick,
  onSkip,
  onComplete,
}) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressWidth = useSharedValue(1);
  const containerScale = useSharedValue(0.92);

  const { isRunning, remainingSeconds, durationSeconds } = timerState;

  // Animate progress bar
  useEffect(() => {
    if (!isRunning || durationSeconds === 0) return;
    const progress = remainingSeconds / durationSeconds;
    progressWidth.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.linear,
    });
  }, [remainingSeconds, durationSeconds, isRunning, progressWidth]);

  // Pop-in animation when timer activates
  useEffect(() => {
    if (isRunning) {
      containerScale.value = withSpring(1, { damping: 14 });
    } else {
      containerScale.value = withTiming(0.92, { duration: 200 });
    }
  }, [isRunning, containerScale]);

  // Tick interval — drives store state, not local state
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        onTick();
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onTick]);

  // Notify parent when timer reaches zero
  useEffect(() => {
    if (isRunning && remainingSeconds === 0 && onComplete) {
      onComplete();
    }
  }, [remainingSeconds, isRunning, onComplete]);

  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
    backgroundColor:
      progressWidth.value > 0.33 ? Colors.timerActive : Colors.timerComplete,
  }));

  if (!isRunning) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeLabel = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <Animated.View style={[styles.container, containerAnimStyle]}>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>

      <View style={styles.content}>
        <View>
          <Text style={[Typography.label, styles.label]}>Rest Timer</Text>
          <Text style={[Typography.number, styles.time]}>{timeLabel}</Text>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={[Typography.bodyMedium, styles.skipText]}>Skip</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardElevated,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.border,
    width: '100%',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  label: {
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  time: {
    color: Colors.timerActive,
  },
  skipButton: {
    backgroundColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  skipText: {
    color: Colors.textPrimary,
  },
});
