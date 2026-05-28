import { palette, radii, spacing, typography } from "../../theme/tokens.js";
import { Card } from "../primitives/Card.js";

export interface EquipmentPickerProps {
  readonly value: ReadonlySet<string>;
  readonly onChange: (next: ReadonlySet<string>) => void;
}

interface EquipmentOption {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
}

const EQUIPMENT_OPTIONS: readonly EquipmentOption[] = [
  { id: "bodyweight", label: "Bodyweight", hint: "Always available" },
  { id: "dumbbells", label: "Dumbbells", hint: "Adjustable or fixed" },
  { id: "barbell", label: "Barbell", hint: "With plates and rack" },
  { id: "kettlebell", label: "Kettlebell", hint: "One or more sizes" },
  { id: "cable", label: "Cable machine", hint: "Single or dual stack" },
  { id: "machine", label: "Selectorized machines", hint: "Plate-loaded or pin" },
  { id: "bench", label: "Bench", hint: "Flat / incline" },
  { id: "pull_up_bar", label: "Pull-up bar", hint: "Doorway or wall mount" },
  { id: "bands", label: "Resistance bands", hint: "Loop or tube" },
  { id: "trx", label: "TRX / suspension", hint: "Anchored straps" },
];

/**
 * Multi-select grid of available equipment. The user must select at least one
 * option for the program generator to run, mirroring `validateForCompletion`.
 */
export function EquipmentPicker({ value, onChange }: EquipmentPickerProps): JSX.Element {
  const handleToggle = (id: string): void => {
    const next = new Set(value);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onChange(next);
  };

  return (
    <div
      role="group"
      aria-label="Available equipment"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: spacing.sm,
      }}
    >
      {EQUIPMENT_OPTIONS.map((option) => {
        const selected = value.has(option.id);
        return (
          <Card
            key={option.id}
            interactive
            selected={selected}
            onClick={() => handleToggle(option.id)}
            ariaLabel={option.label}
            ariaPressed={selected}
            role="checkbox"
            padding={spacing.md}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: spacing.sm,
                }}
              >
                <span
                  style={{
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: palette.textPrimary,
                  }}
                >
                  {option.label}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: radii.xs,
                    border: `2px solid ${selected ? palette.accent : palette.borderStrong}`,
                    background: selected ? palette.accent : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 160ms ease",
                  }}
                >
                  {selected ? (
                    <svg width={10} height={10} viewBox="0 0 12 12" aria-hidden="true">
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
                </span>
              </div>
              <span style={{ fontSize: typography.caption.fontSize, color: palette.textSecondary }}>
                {option.hint}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
