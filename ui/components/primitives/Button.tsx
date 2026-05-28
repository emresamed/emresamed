import { useState, type CSSProperties, type ReactNode } from "react";
import { palette, radii, motion, spacing, typography } from "../../theme/tokens.js";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly fullWidth?: boolean;
  readonly onClick?: () => void;
  readonly ariaLabel?: string;
  readonly leadingIcon?: ReactNode;
  readonly trailingIcon?: ReactNode;
  readonly type?: "button" | "submit" | "reset";
  readonly style?: CSSProperties | undefined;
}

const SIZE_PADDING: Record<ButtonSize, string> = {
  sm: `${spacing.sm}px ${spacing.md}px`,
  md: `${spacing.md}px ${spacing.lg}px`,
  lg: `${spacing.lg}px ${spacing.xl}px`,
};

const SIZE_FONT: Record<ButtonSize, number> = {
  sm: 13,
  md: 15,
  lg: 16,
};

function variantStyles(variant: ButtonVariant, isHover: boolean, disabled: boolean): CSSProperties {
  if (disabled) {
    return {
      background: palette.surfaceMuted,
      color: palette.textMuted,
      border: `1px solid ${palette.border}`,
    };
  }
  switch (variant) {
    case "primary":
      return {
        background: isHover ? palette.accentBright : palette.accent,
        color: palette.textInverse,
        border: `1px solid ${palette.accent}`,
        boxShadow: isHover
          ? `0 12px 28px -10px ${palette.accent}80`
          : `0 8px 20px -12px ${palette.accent}80`,
      };
    case "secondary":
      return {
        background: isHover ? palette.surfaceHover : palette.surfaceElevated,
        color: palette.textPrimary,
        border: `1px solid ${palette.borderStrong}`,
      };
    case "ghost":
      return {
        background: isHover ? palette.surfaceMuted : "transparent",
        color: palette.textPrimary,
        border: `1px solid transparent`,
      };
    case "danger":
      return {
        background: isHover ? palette.danger : `${palette.danger}D9`,
        color: palette.textPrimary,
        border: `1px solid ${palette.danger}`,
      };
  }
}

/** Standard button used for primary CTAs and secondary actions. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  ariaLabel,
  leadingIcon,
  trailingIcon,
  type = "button",
  style,
}: ButtonProps): JSX.Element {
  const [isHover, setHover] = useState(false);
  const [isActive, setActive] = useState(false);
  const isDisabled = disabled || loading;

  const composed: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: SIZE_PADDING[size],
    borderRadius: radii.pill,
    fontSize: SIZE_FONT[size],
    fontWeight: typography.h2.fontWeight,
    letterSpacing: 0.1,
    transition: `transform ${motion.durationFast}ms ${motion.easeStandard}, background ${motion.durationFast}ms ${motion.easeStandard}, color ${motion.durationFast}ms ${motion.easeStandard}, border-color ${motion.durationFast}ms ${motion.easeStandard}, box-shadow ${motion.durationFast}ms ${motion.easeStandard}`,
    transform: isActive && !isDisabled ? "scale(0.97)" : "scale(1)",
    width: fullWidth ? "100%" : undefined,
    ...variantStyles(variant, isHover, isDisabled),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
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
      style={composed}
    >
      {leadingIcon}
      <span>{loading ? "Loading..." : children}</span>
      {trailingIcon}
    </button>
  );
}
