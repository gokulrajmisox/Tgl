import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // TGL brand palette
        forest: {
          DEFAULT: "#073B32",
          950: "#052A24",
          900: "#073B32",
          800: "#0B4A40",
          700: "#0F5B4E",
          100: "#DCEDE8",
          50: "#EFF7F4",
        },
        emerald: {
          DEFAULT: "#20C982",
          600: "#1AAE70",
          500: "#20C982",
          100: "#D7F5E7",
          50: "#EDFBF4",
        },
        charcoal: {
          DEFAULT: "#15191E",
          900: "#15191E",
          700: "#2A3138",
          500: "#5A636D",
          400: "#7A848E",
        },
        paper: "#FDFCF9", // warm white page background
        mist: "#F4F4F1", // subtle light-gray surface
        line: "#E7E7E2", // thin borders
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(21, 25, 30, 0.04), 0 4px 16px rgba(21, 25, 30, 0.06)",
        lift: "0 2px 4px rgba(21, 25, 30, 0.05), 0 12px 32px rgba(21, 25, 30, 0.10)",
        glow: "0 0 0 4px rgba(32, 201, 130, 0.16)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "50%": { transform: "translateX(4px)" },
          "75%": { transform: "translateX(-2px)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "shake-once": "shake 0.32s ease-in-out 1",
      },
    },
  },
  plugins: [],
};

export default config;
