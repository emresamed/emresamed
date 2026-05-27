export const colors = {
  background: "#0A0A0F",
  surface: "#14141C",
  surfaceMuted: "#1D1D29",
  border: "#2A2A38",
  foreground: "#F8FAFC",
  foregroundMuted: "#9CA3AF",
  primary: "#F97316",
  primarySoft: "#FDBA74",
  accent: "#38BDF8",
  success: "#22C55E",
  warning: "#FACC15",
  danger: "#EF4444",
} as const;

export type ColorToken = keyof typeof colors;
