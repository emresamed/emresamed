import type { CSSProperties } from "react";
import type { MuscleGroup } from "../../../src/domain/types.js";
import { muscleAccents, palette, radii, spacing, typography } from "../../theme/tokens.js";
import { Card } from "../primitives/Card.js";

export interface MuscleGroupCardProps {
  readonly muscle: MuscleGroup;
  readonly label: string;
  readonly description?: string;
  readonly weeklySetsTarget?: number;
  readonly selected: boolean;
  readonly disabled?: boolean;
  readonly onToggle: (muscle: MuscleGroup) => void;
  readonly style?: CSSProperties;
}

const FALLBACK_ACCENT = palette.accent;

const MUSCLE_ICON: Readonly<Record<MuscleGroup, string>> = {
  chest: "M12 4c4 0 7 2.5 7 5.5 0 2-1.4 3.6-3.4 4.5-1.6.7-2 1.5-2 2.5v1c0 1.4-1.1 2.5-2.5 2.5h-2.2c-1.4 0-2.5-1.1-2.5-2.5V16.5c0-1-.4-1.8-2-2.5C2.4 13.1 1 11.5 1 9.5 1 6.5 4 4 8 4z",
  back: "M5 5h14v3H5zM5 10h14v3H5zM5 15h14v4a1 1 0 01-1 1H6a1 1 0 01-1-1z",
  legs: "M9 3h6l1 8-1 10h-2l-1-7-1 7H9L8 11z",
  shoulders: "M3 10c2-3 5-5 9-5s7 2 9 5l-2 3c-1.5-2-4-3.5-7-3.5S5.5 11 4 13z",
  arms: "M5 6l4 1 3 5 3-5 4-1v3l-3 1-3 6v6h-2v-6l-3-6-3-1z",
  core: "M7 5h10v4H7zM6 11h12v3H6zM7 16h10v4H7z",
};

/**
 * Visual card used for selecting a muscle group as a focus or priority.
 *
 * The card uses a per-muscle accent color so the selection grid feels
 * editorially distinct rather than a flat list of checkboxes.
 */
export function MuscleGroupCard({
  muscle,
  label,
  description,
  weeklySetsTarget,
  selected,
  disabled = false,
  onToggle,
  style,
}: MuscleGroupCardProps): JSX.Element {
  const accent = muscleAccents[muscle] ?? FALLBACK_ACCENT;
  const iconPath = MUSCLE_ICON[muscle];

  return (
    <Card
      interactive
      selected={selected}
      accentColor={accent}
      disabled={disabled}
      onClick={() => onToggle(muscle)}
      ariaLabel={`${label}${selected ? ", selected" : ""}`}
      ariaPressed={selected}
      role="checkbox"
      padding={spacing.lg}
      style={style}
    >
      <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: radii.md,
            background: `${accent}1F`,
            border: `1px solid ${accent}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "transform 240ms cubic-bezier(0.34,1.56,0.64,1)",
            transform: selected ? "rotate(-3deg) scale(1.05)" : "rotate(0) scale(1)",
          }}
          aria-hidden="true"
        >
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
            <path d={iconPath} fill={accent} />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
              color: palette.textPrimary,
              marginBottom: 2,
            }}
          >
            {label}
          </div>
          {description !== undefined ? (
            <div
              style={{
                fontSize: typography.caption.fontSize,
                color: palette.textSecondary,
                lineHeight: typography.caption.lineHeight,
              }}
            >
              {description}
            </div>
          ) : null}
        </div>
        {weeklySetsTarget !== undefined ? (
          <div
            style={{
              padding: `${spacing.xs}px ${spacing.sm}px`,
              borderRadius: radii.pill,
              background: `${accent}1F`,
              color: accent,
              fontSize: typography.label.fontSize,
              fontWeight: typography.label.fontWeight,
              letterSpacing: typography.label.letterSpacing,
              textTransform: typography.label.textTransform,
              flexShrink: 0,
            }}
          >
            {weeklySetsTarget}+ sets
          </div>
        ) : null}
      </div>
    </Card>
  );
}
