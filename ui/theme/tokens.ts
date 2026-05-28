/**
 * Design tokens for the dark-mode-first mobile fitness UI.
 *
 * Tokens are intentionally minimal and explicit so that components can be
 * styled inline (no CSS pre-processor required) while remaining consistent.
 * Color values are tuned for WCAG AA contrast on the canvas color and for
 * accents that read well alongside the data-dense workout screens.
 */

export const palette = {
  canvas: "#06070B",
  surface: "#0E1016",
  surfaceElevated: "#161A23",
  surfaceMuted: "#1C2030",
  surfaceHover: "#222738",

  border: "#262B3A",
  borderStrong: "#363D52",

  textPrimary: "#F4F6FB",
  textSecondary: "#A6ADBE",
  textMuted: "#6E7488",
  textInverse: "#0B0D14",

  accent: "#7CFFB7",
  accentBright: "#A8FFCB",
  accentDim: "#34624C",
  accentSoft: "rgba(124, 255, 183, 0.12)",

  warning: "#FFB347",
  danger: "#FF5C7A",
  success: "#52E0A1",
  info: "#7AB6FF",

  shadow: "rgba(0, 0, 0, 0.6)",
} as const;

export const muscleAccents: Readonly<Record<string, string>> = {
  chest: "#FF7A8A",
  back: "#7AB6FF",
  legs: "#7CFFB7",
  shoulders: "#FFB347",
  arms: "#C58CFF",
  core: "#FFE066",
};

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 1.1,
    letterSpacing: -0.5,
    fontWeight: 700,
  },
  h1: {
    fontSize: 24,
    lineHeight: 1.2,
    letterSpacing: -0.3,
    fontWeight: 700,
  },
  h2: {
    fontSize: 18,
    lineHeight: 1.3,
    letterSpacing: -0.2,
    fontWeight: 600,
  },
  body: {
    fontSize: 15,
    lineHeight: 1.45,
    fontWeight: 500,
  },
  caption: {
    fontSize: 13,
    lineHeight: 1.4,
    fontWeight: 500,
  },
  label: {
    fontSize: 11,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
  },
  metric: {
    fontSize: 40,
    lineHeight: 1,
    letterSpacing: -1,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums" as const,
  },
} as const;

export const motion = {
  durationFast: 120,
  durationBase: 200,
  durationSlow: 320,
  easeStandard: "cubic-bezier(0.2, 0, 0, 1)",
  easeEnter: "cubic-bezier(0, 0, 0.2, 1)",
  easeExit: "cubic-bezier(0.4, 0, 1, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const layout = {
  maxContentWidth: 480,
  safeAreaInsetTop: "env(safe-area-inset-top, 0px)",
  safeAreaInsetBottom: "env(safe-area-inset-bottom, 0px)",
} as const;

export type Tokens = {
  readonly palette: typeof palette;
  readonly muscleAccents: typeof muscleAccents;
  readonly radii: typeof radii;
  readonly spacing: typeof spacing;
  readonly typography: typeof typography;
  readonly motion: typeof motion;
  readonly layout: typeof layout;
};

export const tokens: Tokens = {
  palette,
  muscleAccents,
  radii,
  spacing,
  typography,
  motion,
  layout,
};
