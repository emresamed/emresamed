import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { SetLog } from '../types';

interface SetRowProps {
  setNumber: number;
  targetReps: number;
  repRangeLow: number;
  repRangeHigh: number;
  log: SetLog | undefined;
  onToggle: () => void;
  onRestStart?: () => void;
  testID?: string;
}

export const SetRow: React.FC<SetRowProps> = ({
  setNumber,
  targetReps,
  repRangeLow,
  repRangeHigh,
  log,
  onToggle,
  onRestStart,
  testID,
}) => {
  const isCompleted = log?.isCompleted ?? false;
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(isCompleted ? 1 : 0);

  React.useEffect(() => {
    bgOpacity.value = withTiming(isCompleted ? 1 : 0, { duration: 250 });
  }, [isCompleted, bgOpacity]);

  const handlePress = () => {
    scale.value = withSpring(0.94, { damping: 12 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    onToggle();
    if (!isCompleted && onRestStart) {
      // Trigger rest timer when a set is being marked complete
      onRestStart();
    }
  };

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: `rgba(255, 107, 53, ${bgOpacity.value * 0.08})`,
  }));

  const checkboxStyle = useAnimatedStyle(() => ({
    backgroundColor: isCompleted
      ? withTiming(Colors.primary, { duration: 200 })
      : withTiming('transparent', { duration: 200 }),
    borderColor: isCompleted
      ? withTiming(Colors.primary, { duration: 200 })
      : withTiming(Colors.border, { duration: 200 }),
  }));

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} testID={testID}>
      <Animated.View style={[styles.row, rowStyle]}>
        {/* Set number */}
        <View style={styles.setNumberContainer}>
          <Text style={[Typography.bodyMedium, styles.setNumber]}>
            {setNumber}
          </Text>
        </View>

        {/* Rep range */}
        <View style={styles.repRange}>
          <Text style={[Typography.bodyMedium, styles.repText]}>
            {repRangeLow}–{repRangeHigh}
          </Text>
          <Text style={[Typography.caption, styles.repLabel]}>reps</Text>
        </View>

        {/* Actual reps logged */}
        <View style={styles.actualReps}>
          {log?.actualReps !== undefined ? (
            <Text style={[Typography.bodyMedium, styles.actualRepText]}>
              {log.actualReps}
            </Text>
          ) : (
            <Text style={[Typography.body, styles.placeholder]}>—</Text>
          )}
        </View>

        {/* Load */}
        <View style={styles.load}>
          {log?.loadKg !== undefined ? (
            <Text style={[Typography.body, styles.loadText]}>
              {log.loadKg} kg
            </Text>
          ) : (
            <Text style={[Typography.body, styles.placeholder]}>— kg</Text>
          )}
        </View>

        {/* Completion checkbox */}
        <Animated.View style={[styles.checkbox, checkboxStyle]}>
          {isCompleted && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  setNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  setNumber: {
    color: Colors.textSecondary,
  },
  repRange: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  repText: {
    color: Colors.textPrimary,
  },
  repLabel: {
    color: Colors.textMuted,
  },
  actualReps: {
    width: 48,
    alignItems: 'center',
  },
  actualRepText: {
    color: Colors.primary,
  },
  load: {
    width: 64,
    alignItems: 'flex-end',
    marginRight: Spacing.md,
  },
  loadText: {
    color: Colors.textSecondary,
  },
  placeholder: {
    color: Colors.textMuted,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
});
