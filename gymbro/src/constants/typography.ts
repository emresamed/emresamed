export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
  '4xl': 40,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const Typography = {
  h1: { fontSize: FontSize['3xl'], fontWeight: FontWeight.bold },
  h2: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold },
  h3: { fontSize: FontSize.xl, fontWeight: FontWeight.semibold },
  h4: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
  bodyLarge: { fontSize: FontSize.md, fontWeight: FontWeight.regular },
  body: { fontSize: FontSize.base, fontWeight: FontWeight.regular },
  bodySmall: { fontSize: FontSize.sm, fontWeight: FontWeight.regular },
  caption: { fontSize: FontSize.xs, fontWeight: FontWeight.regular },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  button: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
} as const;
