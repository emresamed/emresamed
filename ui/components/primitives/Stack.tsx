import type { CSSProperties, ReactNode } from "react";

export type StackDirection = "row" | "column";
export type StackAlign = "stretch" | "start" | "center" | "end" | "baseline";
export type StackJustify = "start" | "center" | "end" | "between" | "around";

export interface StackProps {
  readonly children: ReactNode;
  readonly direction?: StackDirection;
  readonly gap?: number;
  readonly align?: StackAlign;
  readonly justify?: StackJustify;
  readonly wrap?: boolean;
  readonly grow?: boolean;
  readonly style?: CSSProperties | undefined;
  readonly as?: "div" | "section" | "ul" | "li" | "nav" | "header" | "footer" | "main";
  readonly role?: string;
  readonly ariaLabel?: string;
}

const ALIGN_MAP: Record<StackAlign, CSSProperties["alignItems"]> = {
  stretch: "stretch",
  start: "flex-start",
  center: "center",
  end: "flex-end",
  baseline: "baseline",
};

const JUSTIFY_MAP: Record<StackJustify, CSSProperties["justifyContent"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

/** Lightweight flex layout primitive used throughout the UI. */
export function Stack({
  children,
  direction = "column",
  gap = 12,
  align = "stretch",
  justify = "start",
  wrap = false,
  grow = false,
  style,
  as: Component = "div",
  role,
  ariaLabel,
}: StackProps): JSX.Element {
  const composed: CSSProperties = {
    display: "flex",
    flexDirection: direction,
    gap,
    alignItems: ALIGN_MAP[align],
    justifyContent: JUSTIFY_MAP[justify],
    flexWrap: wrap ? "wrap" : "nowrap",
    flexGrow: grow ? 1 : 0,
    minWidth: 0,
    ...style,
  };
  return (
    <Component style={composed} role={role} aria-label={ariaLabel}>
      {children}
    </Component>
  );
}
