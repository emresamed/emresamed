import type { ReactNode } from "react";
import { palette, layout, spacing } from "./theme/tokens.js";

export interface AppShellProps {
  readonly children: ReactNode;
}

/**
 * Mobile-first viewport container that adds safe-area padding, max-width
 * constraints for tablet/desktop, and the canvas background.
 */
export function AppShell({ children }: AppShellProps): JSX.Element {
  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        background: palette.canvas,
        color: palette.textPrimary,
        paddingTop: `calc(${spacing.lg}px + ${layout.safeAreaInsetTop})`,
        paddingBottom: `calc(${spacing.xxxl}px + ${layout.safeAreaInsetBottom})`,
      }}
    >
      <main
        style={{
          width: "100%",
          maxWidth: layout.maxContentWidth,
          padding: `0 ${spacing.lg}px`,
          display: "flex",
          flexDirection: "column",
          gap: spacing.xl,
        }}
      >
        {children}
      </main>
    </div>
  );
}
