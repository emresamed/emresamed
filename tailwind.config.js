/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#070A0F",
        surface: "#111827",
        "surface-soft": "#1F2937",
        border: "#273244",
        primary: "#F97316",
        "primary-soft": "#FDBA74",
        success: "#22C55E",
        warning: "#FACC15",
        danger: "#EF4444"
      },
      borderRadius: {
        card: "24px",
        button: "18px"
      }
    }
  },
  plugins: []
};
