/**
 * Typography scale — referenced by the Text primitive.
 * Sizes are in pixels; line-heights are unitless multipliers.
 */
export const typography = {
  display: { size: 36, lineHeight: 1.1, weight: '700' as const },
  h1: { size: 28, lineHeight: 1.2, weight: '700' as const },
  h2: { size: 22, lineHeight: 1.25, weight: '600' as const },
  h3: { size: 18, lineHeight: 1.3, weight: '600' as const },
  body: { size: 15, lineHeight: 1.45, weight: '400' as const },
  bodyStrong: { size: 15, lineHeight: 1.45, weight: '600' as const },
  caption: { size: 13, lineHeight: 1.4, weight: '500' as const },
  micro: { size: 11, lineHeight: 1.3, weight: '500' as const },
} as const;

export type TypographyVariant = keyof typeof typography;
