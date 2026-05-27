import { colors } from "@/constants/colors";
import { radii, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export const theme = {
  colors,
  radii,
  spacing,
  typography
} as const;

export type AppTheme = typeof theme;
