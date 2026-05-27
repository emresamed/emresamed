export const radius = {
  sm: 10,
  md: 16,
  lg: 20,
  card: 24,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
