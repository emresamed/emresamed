/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0B',
        surface: '#141416',
        'surface-elevated': '#1C1C1F',
        border: '#2A2A2E',
        primary: '#E85D04',
        'primary-muted': '#C44D03',
        accent: '#F48C06',
        success: '#22C55E',
        warning: '#EAB308',
        error: '#EF4444',
        muted: '#71717A',
        foreground: '#FAFAFA',
        'foreground-secondary': '#A1A1AA',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
    },
  },
  plugins: [],
};
