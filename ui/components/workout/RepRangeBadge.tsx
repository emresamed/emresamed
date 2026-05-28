import type { Range } from "../../../src/domain/types.js";
import { palette, radii, spacing, typography } from "../../theme/tokens.js";

export interface RepRangeBadgeProps {
  readonly label: string;
  readonly range: Range<number>;
  readonly suffix?: string;
  readonly accent?: string;
  readonly highlight?: boolean;
}

/**
 * Badge showing the prescribed range for reps, RPE, or rest. The optional
 * `highlight` mode is used when the user is currently working within this
 * range so it draws extra attention.
 */
export function RepRangeBadge({
  label,
  range,
  suffix,
  accent = palette.accent,
  highlight = false,
}: RepRangeBadgeProps): JSX.Element {
  const formatted = range.min === range.max ? `${range.min}` : `${range.min}-${range.max}`;
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        padding: `${spacing.sm}px ${spacing.md}px`,
        borderRadius: radii.md,
        background: highlight ? `${accent}1F` : palette.surfaceMuted,
        border: `1px solid ${highlight ? accent : palette.border}`,
        color: palette.textPrimary,
        minWidth: 84,
      }}
    >
      <span
        style={{
          fontSize: typography.label.fontSize,
          fontWeight: typography.label.fontWeight,
          letterSpacing: typography.label.letterSpacing,
          textTransform: typography.label.textTransform,
          color: highlight ? accent : palette.textMuted,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 20,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatted}
        {suffix !== undefined ? (
          <span style={{ fontSize: 11, color: palette.textSecondary, marginLeft: 4 }}>
            {suffix}
          </span>
        ) : null}
      </span>
    </div>
  );
}
