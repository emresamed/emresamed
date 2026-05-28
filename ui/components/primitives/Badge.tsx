import type { CSSProperties, ReactNode } from "react";
import { palette, radii, spacing, typography } from "../../theme/tokens.js";

export interface BadgeProps {
  readonly children: ReactNode;
  readonly color?: string;
  readonly background?: string;
  readonly variant?: "solid" | "soft" | "outline";
  readonly style?: CSSProperties | undefined;
}

/** Small label used for rep ranges, RPE, mechanics tags, etc. */
export function Badge({
  children,
  color = palette.textPrimary,
  background = palette.surfaceMuted,
  variant = "soft",
  style,
}: BadgeProps): JSX.Element {
  const composed: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: spacing.xs,
    padding: `${spacing.xs}px ${spacing.sm}px`,
    borderRadius: radii.pill,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    letterSpacing: typography.label.letterSpacing,
    textTransform: typography.label.textTransform,
    color,
    background:
      variant === "solid"
        ? color
        : variant === "outline"
          ? "transparent"
          : background,
    border:
      variant === "outline"
        ? `1px solid ${color}`
        : variant === "soft"
          ? `1px solid ${palette.border}`
          : "none",
    ...style,
  };
  return <span style={composed}>{children}</span>;
}
