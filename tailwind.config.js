/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0B0F14",
        surface: "#121826",
        surfaceElevated: "#1B2433",
        primary: "#22D3EE",
        accent: "#A3E635",
        muted: "#94A3B8",
        text: "#F8FAFC",
        border: "#243041",
        danger: "#F87171"
      },
      borderRadius: {
        card: "20px"
      }
    }
  },
  plugins: []
};
