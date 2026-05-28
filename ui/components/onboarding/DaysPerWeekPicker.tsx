import { palette, radii, spacing, typography } from "../../theme/tokens.js";

export interface DaysPerWeekPickerProps {
  readonly value: number | undefined;
  readonly onChange: (value: number) => void;
}

const DAYS = [2, 3, 4, 5, 6] as const;

/** Compact horizontal selector for training days per week (matches store rules of 2-6). */
export function DaysPerWeekPicker({ value, onChange }: DaysPerWeekPickerProps): JSX.Element {
  return (
    <div
      role="radiogroup"
      aria-label="Training days per week"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: spacing.sm,
      }}
    >
      {DAYS.map((day) => {
        const selected = value === day;
        return (
          <button
            key={day}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(day)}
            style={{
              padding: `${spacing.lg}px 0`,
              borderRadius: radii.lg,
              background: selected ? palette.accentSoft : palette.surfaceElevated,
              border: `1px solid ${selected ? palette.accent : palette.border}`,
              color: selected ? palette.accent : palette.textPrimary,
              fontSize: typography.metric.fontSize - 8,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              transition: "all 160ms ease",
              boxShadow: selected ? `0 8px 24px -16px ${palette.accent}` : "none",
            }}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}
