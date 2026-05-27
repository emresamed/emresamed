/**
 * Raw color tokens — shared between Tailwind (JS) and runtime TS code.
 * Keep this file dependency-free and CommonJS so tailwind.config.js can require it.
 */
const colors = {
  bg: {
    DEFAULT: '#0A0A0B',
    elevated: '#141416',
    muted: '#1C1C20',
  },
  surface: {
    DEFAULT: '#17171A',
    hover: '#1F1F23',
  },
  border: {
    DEFAULT: '#26262B',
    strong: '#33333A',
  },
  text: {
    DEFAULT: '#F5F5F7',
    muted: '#9A9AA3',
    subtle: '#62626B',
    inverse: '#0A0A0B',
  },
  brand: {
    DEFAULT: '#E0FE10',
    hover: '#CFEC0E',
    pressed: '#B8D40C',
  },
  accent: {
    DEFAULT: '#FF4D4D',
    success: '#3FCF8E',
    warning: '#FFB020',
    info: '#3B82F6',
  },
};

module.exports = { colors };
