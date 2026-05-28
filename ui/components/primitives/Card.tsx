import { useState, type CSSProperties, type ReactNode } from "react";
import { palette, radii, motion, spacing } from "../../theme/tokens.js";

export type CardVariant = "surface" | "elevated" | "muted" | "outline";

export interface CardProps {
  readonly children: ReactNode;
  readonly variant?: CardVariant;
  readonly interactive?: boolean;
  readonly selected?: boolean;
  readonly accentColor?: string;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
  readonly ariaLabel?: string;
  readonly ariaPressed?: boolean;
  readonly ariaSelected?: boolean;
  readonly role?: string;
  readonly style?: CSSProperties | undefined;
  readonly padding?: number;
  readonly fullWidth?: boolean;
}

const VARIANT_BG: Record<CardVariant, string> = {
  surface: palette.surface,
  elevated: palette.surfaceElevated,
  muted: palette.surfaceMuted,
  outline: "transparent",
};

/**
 * Premium dark-mode card surface used for all content blocks.
 *
 * When `interactive`, the card exposes a button role with hover/press
 * affordances and respects `prefers-reduced-motion` via the global stylesheet.
 */
export function Card({
  children,
  variant = "surface",
  interactive = false,
  selected = false,
  accentColor,
  disabled = false,
  onClick,
  ariaLabel,
  ariaPressed,
  ariaSelected,
  role,
  style,
  padding = spacing.lg,
  fullWidth = true,
}: CardProps): JSX.Element {
  const [isHover, setHover] = useState(false);
  const [isActive, setActive] = useState(false);

  const baseBg = VARIANT_BG[variant];
  const borderColor = selected
    ? accentColor ?? palette.accent
    : variant === "outline"
      ? palette.border
      : palette.border;

  const composed: CSSProperties = {
    background: selected
      ? `linear-gradient(180deg, ${accentColor ?? palette.accent}14 0%, ${baseBg} 80%)`
      : isHover && interactive && !disabled
        ? palette.surfaceHover
        : baseBg,
    color: palette.textPrimary,
    border: `1px solid ${borderColor}`,
    borderRadius: radii.lg,
    padding,
    transition: `transform ${motion.durationBase}ms ${motion.easeStandard}, background ${motion.durationFast}ms ${motion.easeStandard}, border-color ${motion.durationBase}ms ${motion.easeStandard}, box-shadow ${motion.durationBase}ms ${motion.easeStandard}`,
    transform: interactive && isActive && !disabled ? "scale(0.985)" : "scale(1)",
    boxShadow: selected
      ? `0 0 0 1px ${accentColor ?? palette.accent}, 0 12px 32px -16px ${accentColor ?? palette.accent}80`
      : variant === "elevated"
        ? "0 12px 28px -16px rgba(0,0,0,0.6)"
        : "none",
    width: fullWidth ? "100%" : undefined,
    textAlign: "left",
    cursor: interactive && !disabled ? "pointer" : "default",
    opacity: disabled ? 0.5 : 1,
    outline: "none",
    ...style,
  };

  if (!interactive) {
    return (
      <div role={role} aria-label={ariaLabel} style={composed}>
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setActive(false)}
      onTouchCancel={() => setActive(false)}
      onBlur={() => setActive(false)}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-selected={ariaSelected}
      role={role}
      style={composed}
    >
      {children}
    </button>
  );
}
