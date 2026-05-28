import { useState, type CSSProperties } from "react";
import type { Range } from "../../../src/domain/types.js";
import type { SetLog } from "../../state/workoutSessionStore.js";
import { palette, radii, motion, spacing, typography } from "../../theme/tokens.js";

export interface SetCheckboxProps {
  readonly setIndex: number;
  readonly log: SetLog;
  readonly repRange: Range<number>;
  readonly accent?: string;
  readonly disabled?: boolean;
  readonly onComplete: (setIndex: number, reps: number) => void;
  readonly onUncomplete: (setIndex: number) => void;
  readonly onLogReps: (setIndex: number, reps: number) => void;
  readonly onLogWeight: (setIndex: number, weightKg: number) => void;
}

const NUMERIC_INPUT_STYLE: CSSProperties = {
  width: 56,
  padding: `${spacing.xs}px ${spacing.sm}px`,
  background: palette.surfaceMuted,
  border: `1px solid ${palette.border}`,
  borderRadius: radii.sm,
  color: palette.textPrimary,
  fontSize: typography.body.fontSize,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
  textAlign: "center",
  appearance: "textfield",
  MozAppearance: "textfield",
};

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Interactive set tracker row. Combines a tap-to-complete checkbox with
 * inline reps and weight inputs. Tapping the checkbox without entering reps
 * commits the prescribed mid-range value.
 */
export function SetCheckbox({
  setIndex,
  log,
  repRange,
  accent = palette.accent,
  disabled = false,
  onComplete,
  onUncomplete,
  onLogReps,
  onLogWeight,
}: SetCheckboxProps): JSX.Element {
  const [pressing, setPressing] = useState(false);
  const inRange = log.reps !== undefined && log.reps >= repRange.min && log.reps <= repRange.max;

  const handleToggle = (): void => {
    if (disabled) {
      return;
    }
    if (log.completed) {
      onUncomplete(setIndex);
      return;
    }
    const reps = log.reps ?? Math.round((repRange.min + repRange.max) / 2);
    onComplete(setIndex, reps);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing.md,
        padding: `${spacing.sm}px ${spacing.md}px`,
        borderRadius: radii.md,
        background: log.completed ? `${accent}14` : palette.surfaceMuted,
        border: `1px solid ${log.completed ? `${accent}66` : palette.border}`,
        transition: `background ${motion.durationFast}ms ${motion.easeStandard}, border-color ${motion.durationFast}ms ${motion.easeStandard}`,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <button
        type="button"
        onClick={handleToggle}
        onMouseDown={() => setPressing(true)}
        onMouseUp={() => setPressing(false)}
        onMouseLeave={() => setPressing(false)}
        onTouchStart={() => setPressing(true)}
        onTouchEnd={() => setPressing(false)}
        disabled={disabled}
        aria-label={log.completed ? `Uncheck set ${setIndex + 1}` : `Complete set ${setIndex + 1}`}
        aria-pressed={log.completed}
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          border: `2px solid ${log.completed ? accent : palette.borderStrong}`,
          background: log.completed ? accent : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: pressing && !disabled ? "scale(0.92)" : "scale(1)",
          transition: `all ${motion.durationFast}ms ${motion.easeStandard}`,
        }}
      >
        {log.completed ? (
          <svg width={16} height={16} viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M2 6.5l2.6 2.6L10 3.5"
              stroke={palette.textInverse}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span style={{ fontSize: 13, color: palette.textMuted, fontWeight: 700 }}>
            {setIndex + 1}
          </span>
        )}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.xs,
            color: palette.textMuted,
            fontSize: typography.label.fontSize,
            fontWeight: typography.label.fontWeight,
            letterSpacing: typography.label.letterSpacing,
            textTransform: typography.label.textTransform,
          }}
        >
          Set {setIndex + 1}
          {log.completed ? (
            <span style={{ color: inRange ? accent : palette.warning }}>
              {inRange ? "ON TARGET" : "OUT OF RANGE"}
            </span>
          ) : null}
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
        <span style={{ fontSize: typography.caption.fontSize, color: palette.textMuted }}>kg</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={0.5}
          aria-label={`Weight for set ${setIndex + 1}`}
          value={log.weightKg ?? ""}
          onChange={(event) => {
            const value = event.target.value === "" ? 0 : Number(event.target.value);
            if (Number.isFinite(value)) {
              onLogWeight(setIndex, Math.max(0, value));
            }
          }}
          disabled={disabled}
          style={NUMERIC_INPUT_STYLE}
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: spacing.xs }}>
        <span style={{ fontSize: typography.caption.fontSize, color: palette.textMuted }}>reps</span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={repRange.max + 5}
          aria-label={`Reps for set ${setIndex + 1}`}
          placeholder={`${repRange.min}-${repRange.max}`}
          value={log.reps ?? ""}
          onChange={(event) => {
            const value = event.target.value === "" ? 0 : Number(event.target.value);
            if (Number.isFinite(value) && value > 0) {
              onLogReps(setIndex, clamp(1, repRange.max + 10, Math.round(value)));
            }
          }}
          disabled={disabled}
          style={NUMERIC_INPUT_STYLE}
        />
      </label>
    </div>
  );
}
