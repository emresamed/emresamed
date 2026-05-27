/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#14141C",
        "surface-muted": "#1D1D29",
        border: "#2A2A38",
        primary: "#F97316",
        "primary-soft": "#FDBA74",
        accent: "#38BDF8",
        success: "#22C55E",
        warning: "#FACC15",
        danger: "#EF4444",
        muted: "#9CA3AF",
        foreground: "#F8FAFC"
      },
      fontFamily: {
        sans: ["System"]
      },
      borderRadius: {
        card: "24px"
      }
    }
  },
  plugins: []
};
