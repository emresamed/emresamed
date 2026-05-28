import type { CSSProperties } from "react";
import { palette, radii, motion } from "../../theme/tokens.js";

export interface ProgressBarProps {
  readonly progress: number;
  readonly color?: string;
  readonly trackColor?: string;
  readonly height?: number;
  readonly ariaLabel?: string;
  readonly style?: CSSProperties | undefined;
}

export function ProgressBar({
  progress,
  color = palette.accent,
  trackColor = palette.surfaceMuted,
  height = 6,
  ariaLabel,
  style,
}: ProgressBarProps): JSX.Element {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      style={{
        background: trackColor,
        borderRadius: radii.pill,
        height,
        width: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          width: `${clamped * 100}%`,
          height: "100%",
          background: color,
          borderRadius: radii.pill,
          transition: `width ${motion.durationSlow}ms ${motion.easeStandard}`,
          boxShadow: `0 0 12px -2px ${color}80`,
        }}
      />
    </div>
  );
}
