import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '@/constants';

interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  if (!label) {
    return <View style={styles.line} />;
  }

  return (
    <View style={styles.row}>
      <View style={styles.flex} />
      <Text style={styles.text}>{label}</Text>
      <View style={styles.flex} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceBorder,
  },
  text: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
});
