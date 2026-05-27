import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface OnboardingOptionCardProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const OnboardingOptionCard: React.FC<OnboardingOptionCardProps> = ({
  title,
  subtitle,
  emoji,
  isSelected,
  onPress,
  style,
  testID,
}) => {
  const scale = useSharedValue(1);
  const borderOpacity = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    borderOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, borderOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: `rgba(255, 107, 53, ${borderOpacity.value})`,
    borderWidth: 2,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.card,
          isSelected && styles.selectedCard,
          animatedStyle,
          style,
        ]}
      >
        {emoji && (
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[Typography.h3, styles.title]}>{title}</Text>
          {subtitle && (
            <Text style={[Typography.body, styles.subtitle]}>{subtitle}</Text>
          )}
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: Colors.primaryDim,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.textPrimary,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
});
