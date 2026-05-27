import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { MuscleGroup } from '../types';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface MuscleGroupCardProps {
  muscle: MuscleGroup;
  setCount: number;
  isActive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const MUSCLE_CONFIG: Record<MuscleGroup, { emoji: string; color: string; label: string }> = {
  CHEST: { emoji: '🏋️', color: Colors.muscleChest, label: 'Chest' },
  BACK: { emoji: '🔙', color: Colors.muscleBack, label: 'Back' },
  LEGS: { emoji: '🦵', color: Colors.muscleLegs, label: 'Legs' },
  SHOULDERS: { emoji: '🏔️', color: Colors.muscleShoulders, label: 'Shoulders' },
  ARMS: { emoji: '💪', color: Colors.muscleArms, label: 'Arms' },
  CORE: { emoji: '⚡', color: Colors.muscleCore, label: 'Core' },
};

export const MuscleGroupCard: React.FC<MuscleGroupCardProps> = ({
  muscle,
  setCount,
  isActive = false,
  onPress,
  style,
}) => {
  const config = MUSCLE_CONFIG[muscle];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const content = (
    <Animated.View
      style={[
        styles.card,
        isActive && { borderColor: config.color, borderWidth: 1.5 },
        animatedStyle,
        style,
      ]}
    >
      <View style={[styles.iconBadge, { backgroundColor: `${config.color}20` }]}>
        <Text style={styles.emoji}>{config.emoji}</Text>
      </View>
      <Text style={[Typography.bodyMedium, styles.label]}>{config.label}</Text>
      <Text style={[Typography.captionBold, { color: config.color }]}>
        {setCount} sets
      </Text>
    </Animated.View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
});
