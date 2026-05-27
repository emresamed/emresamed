export const darkTheme = {
  colors: {
    background: "#0B0D12",
    surface: "#141826",
    card: "#1B2133",
    textPrimary: "#F5F7FF",
    textSecondary: "#A6B0CF",
    accent: "#6D7DFF",
    success: "#3ED598",
    warning: "#FFB85C",
    danger: "#FF6B6B",
    border: "#2A3350"
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16
  },
  typography: {
    title: 22,
    heading: 18,
    body: 14,
    caption: 12
  }
} as const;

export type DarkTheme = typeof darkTheme;
