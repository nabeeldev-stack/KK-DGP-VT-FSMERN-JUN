/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0a0a0b",
          100: "#111113",
          200: "#18181b",
          300: "#1f1f23",
          400: "#27272a",
        },
        brand: {
          DEFAULT: "#ef4444",
          light: "#f87171",
          dark: "#b91c1c",
          glow: "rgba(239,68,68,0.35)",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "fade-up": "fadeSlideUp 0.6s ease-out forwards",
        "fade-down": "fadeSlideDown 0.5s ease-out forwards",
        "gradient-move": "gradientMove 8s ease infinite",
        "spin-slow": "spin 20s linear infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-18px) rotate(1deg)" },
          "66%": { transform: "translateY(8px) rotate(-1deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotateY(0deg)" },
          "50%": { transform: "translateY(-25px) rotateY(8deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.08)" },
        },
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeSlideDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xl: "24px",
      },
      blur: {
        "3xl": "64px",
      },
    },
  },
  plugins: [],
};

