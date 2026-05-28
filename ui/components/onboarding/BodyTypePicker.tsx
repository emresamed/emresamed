import { BODY_TYPES, type BodyType } from "../../../src/domain/types.js";
import { spacing } from "../../theme/tokens.js";
import { Stack } from "../primitives/Stack.js";
import { ChoiceCard } from "./ChoiceCard.js";

export interface BodyTypePickerProps {
  readonly value: BodyType | undefined;
  readonly onChange: (value: BodyType) => void;
}

const BODY_TYPE_LABELS: Readonly<Record<BodyType, { title: string; description: string; accent: string }>> = {
  ectomorph: {
    title: "Ectomorph",
    description: "Lean build, harder to gain mass. Lower volume, longer rest.",
    accent: "#7AB6FF",
  },
  mesomorph: {
    title: "Mesomorph",
    description: "Athletic build, balanced response. Standard volume and density.",
    accent: "#7CFFB7",
  },
  endomorph: {
    title: "Endomorph",
    description: "Higher mass, strong recovery. Higher density and shorter rest.",
    accent: "#FFB347",
  },
};

export function BodyTypePicker({ value, onChange }: BodyTypePickerProps): JSX.Element {
  return (
    <Stack gap={spacing.sm} role="radiogroup" ariaLabel="Body type">
      {BODY_TYPES.map((bodyType) => {
        const meta = BODY_TYPE_LABELS[bodyType];
        return (
          <ChoiceCard
            key={bodyType}
            title={meta.title}
            description={meta.description}
            accent={meta.accent}
            selected={value === bodyType}
            onSelect={() => onChange(bodyType)}
          />
        );
      })}
    </Stack>
  );
}
