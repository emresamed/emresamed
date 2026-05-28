import { useEffect, useMemo, useRef, useState } from "react";
import type { RestTimerState } from "../../state/workoutSessionStore.js";
import { palette, spacing, typography } from "../../theme/tokens.js";
import { useInterval } from "../../hooks/useInterval.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import { Button } from "../primitives/Button.js";
import { ProgressRing } from "../primitives/ProgressRing.js";

export interface RestTimerProps {
  readonly timer: RestTimerState;
  readonly onTick: (nowMs: number) => void;
  readonly onSkip: () => void;
  readonly onAdjust?: (deltaSeconds: number) => void;
  readonly accent?: string;
}

function formatSeconds(remaining: number): string {
  const safe = Math.max(0, Math.floor(remaining));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Dynamic rest-timer component.
 *
 * Drives ticks via `useInterval` and proxies them back to the workout session
 * store so the reducer keeps the source of truth. Plays a subtle haptic /
 * audio cue when the timer finishes (gracefully no-ops if not supported).
 */
export function RestTimer({
  timer,
  onTick,
  onSkip,
  onAdjust,
  accent = palette.accent,
}: RestTimerProps): JSX.Element | null {
  const reduceMotion = useReducedMotion();
  const remaining = Math.max(0, timer.durationSeconds - timer.elapsedSeconds);
  const progress = timer.durationSeconds === 0 ? 0 : timer.elapsedSeconds / timer.durationSeconds;
  const isFinished = !timer.isActive && timer.elapsedSeconds >= timer.durationSeconds && timer.durationSeconds > 0;
  const completedRecentlyRef = useRef(false);
  const [isPulsing, setPulsing] = useState(false);

  useInterval(
    () => {
      onTick(Date.now());
    },
    timer.isActive ? 250 : null,
  );

  const ringColor = useMemo(() => {
    if (remaining <= 5) return palette.warning;
    if (remaining <= 15) return palette.info;
    return accent;
  }, [accent, remaining]);

  useEffect(() => {
    if (isFinished && !completedRecentlyRef.current) {
      completedRecentlyRef.current = true;
      setPulsing(true);
      try {
        if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
          navigator.vibrate([40, 60, 80]);
        }
      } catch {
        // navigator.vibrate may be blocked in some contexts; safe to ignore.
      }
      const id = window.setTimeout(() => setPulsing(false), 1200);
      return () => window.clearTimeout(id);
    }
    if (!isFinished) {
      completedRecentlyRef.current = false;
    }
    return undefined;
  }, [isFinished]);

  if (timer.durationSeconds === 0) {
    return null;
  }

  return (
    <div
      role="timer"
      aria-label={`Rest timer, ${remaining} seconds remaining`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing.lg,
        padding: spacing.lg,
        background: palette.surfaceElevated,
        border: `1px solid ${palette.border}`,
        borderRadius: 24,
      }}
    >
      <div
        style={{
          transform: isPulsing && !reduceMotion ? "scale(1.04)" : "scale(1)",
          transition: "transform 320ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <ProgressRing
          progress={1 - progress}
          color={ringColor}
          size={196}
          strokeWidth={12}
          ariaLabel="Rest progress"
          animated={!reduceMotion}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span
              style={{
                fontSize: 12,
                color: palette.textMuted,
                letterSpacing: typography.label.letterSpacing,
                textTransform: typography.label.textTransform,
                fontWeight: typography.label.fontWeight,
              }}
            >
              {isFinished ? "Rest complete" : "Resting"}
            </span>
            <span
              style={{
                fontSize: typography.metric.fontSize,
                lineHeight: typography.metric.lineHeight,
                fontWeight: typography.metric.fontWeight,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: typography.metric.letterSpacing,
                color: palette.textPrimary,
              }}
            >
              {formatSeconds(remaining)}
            </span>
            <span style={{ fontSize: 12, color: palette.textMuted }}>
              of {formatSeconds(timer.durationSeconds)}
            </span>
          </div>
        </ProgressRing>
      </div>

      <div style={{ display: "flex", gap: spacing.sm, justifyContent: "center", flexWrap: "wrap" }}>
        {onAdjust ? (
          <Button variant="secondary" size="sm" onClick={() => onAdjust(-15)} ariaLabel="Subtract 15 seconds">
            -15s
          </Button>
        ) : null}
        <Button
          variant="primary"
          size="md"
          onClick={onSkip}
          ariaLabel={isFinished ? "Continue to next set" : "Skip rest"}
        >
          {isFinished ? "Continue" : "Skip rest"}
        </Button>
        {onAdjust ? (
          <Button variant="secondary" size="sm" onClick={() => onAdjust(15)} ariaLabel="Add 15 seconds">
            +15s
          </Button>
        ) : null}
      </div>
    </div>
  );
}
