/**
 * Tailwind config — consumes design tokens from src/theme.
 * Keep colors/spacing/radii defined in code (src/theme) and mirror them here.
 * That way the theme is the single source of truth for both JS and Tailwind.
 */
const { colors } = require('./src/theme/colors.tokens.js');
const { spacing } = require('./src/theme/spacing.tokens.js');
const { radii } = require('./src/theme/radii.tokens.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius: radii,
      fontFamily: {
        sans: ['Inter', 'System'],
      },
    },
  },
  plugins: [],
};
