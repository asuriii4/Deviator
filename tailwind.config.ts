import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        card: {
          DEFAULT: "rgba(24, 24, 27, 0.6)",
          foreground: "#fafafa",
        },
        border: "#27272a",
        input: "#27272a",
        ring: "#06b6d4",
        muted: {
          DEFAULT: "#18181b",
          foreground: "#a1a1aa",
        },
        neon: {
          cyan: "#06b6d4",
          purple: "#a855f7",
          emerald: "#10b981",
          crimson: "#ef4444",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "glow-cyan": "0 0 20px -2px rgba(6, 182, 212, 0.45)",
        "glow-purple": "0 0 20px -2px rgba(168, 85, 247, 0.45)",
        "glow-emerald": "0 0 24px -2px rgba(16, 185, 129, 0.5)",
        "glow-crimson": "0 0 24px -2px rgba(239, 68, 68, 0.5)",
        "glow-gold": "0 0 28px -2px rgba(245, 158, 11, 0.5)",
      },
      keyframes: {
        "pulse-danger": {
          "0%, 100%": { backgroundColor: "rgba(239, 68, 68, 0.12)" },
          "50%": { backgroundColor: "rgba(239, 68, 68, 0.32)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        "pulse-danger": "pulse-danger 1s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        blink: "blink 1.2s ease-in-out infinite",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
