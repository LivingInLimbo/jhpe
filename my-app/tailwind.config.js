/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      zIndex: {
        8: 8,
        9: 9,
        15: 15,
        60: 60,
        9001: 9001,
      },
    },
    colors: {
      transparent: "transparent",
      white: "white",
      black: "black",
      blue: {
        500: "#3b82f6",
        700: "#1d4ed8",
      },
      green: {
        // emerald
        500: "#10b981",
        700: "#047857",
      },
      red: {
        // rose
        500: "#f43f5e",
        600: "#e11d48",
      },
      yellow: {
        // amber
        600: "#d97706",
      },
      gray: {
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        700: "#374151",
      },
    },
  },
  plugins: [],
};
