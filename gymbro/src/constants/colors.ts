export const Colors = {
  // Primary brand palette
  primary: '#E94560',
  primaryDark: '#C73652',
  primaryLight: '#FF6B86',

  // Background layers (dark theme)
  background: '#0F0F13',
  surface: '#1A1A22',
  surfaceElevated: '#222230',
  surfaceBorder: '#2C2C3E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#5A5A72',
  textInverse: '#0F0F13',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Accent
  accent: '#7C3AED',
  accentLight: '#A78BFA',

  // Muscle group tags (for visual distinction)
  tagChest: '#E94560',
  tagBack: '#3B82F6',
  tagLegs: '#22C55E',
  tagShoulders: '#F59E0B',
  tagArms: '#7C3AED',
  tagCore: '#EC4899',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.6)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
