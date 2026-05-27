// Dark-mode-first palette — FitForge design system

export const Colors = {
  // Backgrounds
  bg: '#0A0A0A',
  surface: '#141414',
  card: '#1C1C1C',
  cardElevated: '#242424',

  // Brand
  primary: '#FF6B35',
  primaryDim: '#FF6B3520',
  secondary: '#FF3D57',
  accent: '#6C63FF',

  // Status
  success: '#4CAF50',
  successDim: '#4CAF5020',
  warning: '#FFC107',
  error: '#F44336',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#505050',
  textInverse: '#0A0A0A',

  // UI
  border: '#2A2A2A',
  borderLight: '#363636',
  divider: '#1E1E1E',
  overlay: 'rgba(0,0,0,0.7)',

  // Rest timer
  timerActive: '#FF6B35',
  timerComplete: '#4CAF50',

  // Muscle group chips
  muscleChest: '#FF6B35',
  muscleBack: '#6C63FF',
  muscleLegs: '#4CAF50',
  muscleShoulders: '#FFC107',
  muscleArms: '#FF3D57',
  muscleCore: '#00BCD4',
} as const;

export type ColorKey = keyof typeof Colors;
