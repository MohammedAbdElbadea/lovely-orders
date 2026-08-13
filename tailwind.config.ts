import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        deep: { black: "#FBF9F7" },
        premium: { black: "#FFFFFF" },
        surface: { elevated: "#F5F1EC" },
        gold: {
          DEFAULT: "#B8860B",
          hover: "#9A7209",
          muted: "#C9973B",
          tint: "#FDF8EF",
        },
        royal: {
          violet: "#B8860B",
          purple: "#9A7209",
          light: "#FDF8EF",
          accent: "#C9973B",
        },
        rose: {
          ruby: "#C2185B",
          pink: "#E91E63",
          soft: "#FFF0F3",
        },
        luxury: {
          white: "#2C2417",
          dark: "#FFFFFF",
          muted: "#7A6F63",
          border: "#E8E0D5",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        luxury: "8px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.4s ease-out",
        "shimmer": "shimmer 2.5s infinite linear",
        "pulse-subtle": "pulseSubtle 2s infinite ease-in-out",
        "badge-pop": "badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "float": "float 4s ease-in-out infinite",
        "float-slow": "float 7s ease-in-out infinite",
        "marquee": "marquee 25s linear infinite",
        "spin-slow": "spin 25s linear infinite",
        "glow-pulse": "glowPulse 3s infinite ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.03)" },
        },
        badgePop: {
          "0%": { transform: "scale(0.8)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
