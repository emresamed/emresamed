import type { CSSProperties, ReactNode } from "react";
import { palette, motion } from "../../theme/tokens.js";

export interface ProgressRingProps {
  readonly progress: number;
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly color?: string;
  readonly trackColor?: string;
  readonly children?: ReactNode;
  readonly ariaLabel?: string;
  readonly style?: CSSProperties | undefined;
  readonly animated?: boolean;
}

/**
 * Accessible circular progress indicator. The progress value is clamped to
 * [0, 1] and exposed via `role="progressbar"` for screen readers.
 */
export function ProgressRing({
  progress,
  size = 168,
  strokeWidth = 10,
  color = palette.accent,
  trackColor = palette.surfaceHover,
  children,
  ariaLabel,
  style,
  animated = true,
}: ProgressRingProps): JSX.Element {
  const clamped = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  const composed: CSSProperties = {
    position: "relative",
    width: size,
    height: size,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  return (
    <div
      style={composed}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", display: "block" }}
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated
              ? `stroke-dashoffset ${motion.durationSlow}ms ${motion.easeStandard}`
              : "none",
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
