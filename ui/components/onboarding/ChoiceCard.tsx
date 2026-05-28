import type { ReactNode } from "react";
import { palette, radii, spacing, typography } from "../../theme/tokens.js";
import { Card } from "../primitives/Card.js";

export interface ChoiceCardProps {
  readonly title: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly accent?: string;
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly ariaLabel?: string;
  readonly compact?: boolean;
}

/** Smaller selection card used by body type, goal, and difficulty pickers. */
export function ChoiceCard({
  title,
  description,
  icon,
  accent = palette.accent,
  selected,
  onSelect,
  ariaLabel,
  compact = false,
}: ChoiceCardProps): JSX.Element {
  return (
    <Card
      interactive
      selected={selected}
      accentColor={accent}
      onClick={onSelect}
      ariaLabel={ariaLabel ?? title}
      ariaSelected={selected}
      role="radio"
      padding={compact ? spacing.md : spacing.lg}
    >
      <div style={{ display: "flex", gap: spacing.md, alignItems: "center" }}>
        {icon !== undefined ? (
          <div
            style={{
              width: compact ? 36 : 44,
              height: compact ? 36 : 44,
              borderRadius: radii.md,
              background: `${accent}1F`,
              border: `1px solid ${accent}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: accent,
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: compact ? typography.body.fontSize : typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
              color: palette.textPrimary,
              marginBottom: description !== undefined ? 2 : 0,
            }}
          >
            {title}
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
        <div
          aria-hidden="true"
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            background: selected ? accent : "transparent",
            border: `2px solid ${selected ? accent : palette.borderStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 160ms ease, border-color 160ms ease",
          }}
        >
          {selected ? (
            <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M2 6.5l2.6 2.6L10 3.5"
                stroke={palette.textInverse}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
