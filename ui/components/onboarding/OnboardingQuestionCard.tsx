import type { ReactNode } from "react";
import { palette, spacing, typography } from "../../theme/tokens.js";
import { Stack } from "../primitives/Stack.js";

export interface OnboardingQuestionCardProps {
  readonly stepLabel: string;
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

/**
 * Layout shell for each step of the onboarding flow. Presents a step counter,
 * a question, an optional supporting paragraph, and slots for the answer
 * controls and action footer.
 */
export function OnboardingQuestionCard({
  stepLabel,
  title,
  description,
  children,
  footer,
}: OnboardingQuestionCardProps): JSX.Element {
  return (
    <Stack gap={spacing.xl} grow>
      <Stack gap={spacing.sm} as="header">
        <span
          style={{
            color: palette.accent,
            fontSize: typography.label.fontSize,
            fontWeight: typography.label.fontWeight,
            letterSpacing: typography.label.letterSpacing,
            textTransform: typography.label.textTransform,
          }}
        >
          {stepLabel}
        </span>
        <h1
          style={{
            margin: 0,
            color: palette.textPrimary,
            fontSize: typography.display.fontSize,
            lineHeight: typography.display.lineHeight,
            letterSpacing: typography.display.letterSpacing,
            fontWeight: typography.display.fontWeight,
          }}
        >
          {title}
        </h1>
        {description !== undefined ? (
          <p
            style={{
              margin: 0,
              color: palette.textSecondary,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
            }}
          >
            {description}
          </p>
        ) : null}
      </Stack>

      <div className="mfa-fade-in" style={{ flex: 1 }}>
        {children}
      </div>

      {footer !== undefined ? <div>{footer}</div> : null}
    </Stack>
  );
}
