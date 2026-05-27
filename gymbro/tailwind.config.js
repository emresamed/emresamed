/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E94560',
          dark: '#C73652',
          light: '#FF6B86',
        },
        background: '#0F0F13',
        surface: {
          DEFAULT: '#1A1A22',
          elevated: '#222230',
          border: '#2C2C3E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0B0',
          muted: '#5A5A72',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        accent: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
