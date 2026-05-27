export const colors = {
  background: '#0A0A0B',
  surface: '#141416',
  surfaceElevated: '#1C1C1F',
  border: '#2A2A2E',
  primary: '#E85D04',
  primaryMuted: '#C44D03',
  accent: '#F48C06',
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
  muted: '#71717A',
  foreground: '#FAFAFA',
  foregroundSecondary: '#A1A1AA',
  tabBar: '#141416',
  tabBarBorder: '#2A2A2E',
} as const;

export type ThemeColors = typeof colors;
