import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Blue Archive inspired palette
        "ba-sky": "#7CC8F8",
        "ba-sky-light": "#B8E2FF",
        "ba-sky-deep": "#3B9CEA",
        "ba-pink": "#FF7EB3",
        "ba-pink-light": "#FFB8D4",
        "ba-pink-deep": "#E84F8A",
        "ba-yellow": "#FFD166",
        "ba-yellow-light": "#FFE5A0",
        "ba-lavender": "#C4B5FD",
        "ba-lavender-light": "#DDD6FE",
        "ba-mint": "#6EE7B7",
        "ba-mint-light": "#A7F3D0",
        "ba-coral": "#FB923C",
        "ba-white": "#FAFBFF",
        "ba-cream": "#FFF8F0",
        "ba-card": "rgba(255, 255, 255, 0.85)",
        "ba-dark": "#2D3047",
        "ba-dark-soft": "#4A4E6A",
        "ba-muted": "#8B95A5",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        ui: ["var(--font-ui)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "ba-gradient-sky": "linear-gradient(180deg, #B8E2FF 0%, #FAFBFF 50%, #FFF8F0 100%)",
        "ba-gradient-sunset": "linear-gradient(135deg, #FFB8D4 0%, #FFD166 50%, #B8E2FF 100%)",
        "ba-gradient-hero": "linear-gradient(180deg, #7CC8F8 0%, #B8E2FF 40%, #FAFBFF 100%)",
        "ba-gradient-card": "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,251,255,0.8) 100%)",
        "dots-pattern": "radial-gradient(circle, #C4B5FD 1px, transparent 1px)",
      },
      backgroundSize: {
        "dots": "24px 24px",
      },
      borderRadius: {
        "ba": "16px",
        "ba-lg": "24px",
        "ba-pill": "9999px",
      },
      boxShadow: {
        "ba-soft": "0 4px 20px rgba(124, 200, 248, 0.15), 0 2px 8px rgba(0,0,0,0.05)",
        "ba-card": "0 8px 32px rgba(124, 200, 248, 0.2), 0 2px 8px rgba(0,0,0,0.04)",
        "ba-glow-pink": "0 0 20px rgba(255, 126, 179, 0.4)",
        "ba-glow-sky": "0 0 20px rgba(124, 200, 248, 0.4)",
        "ba-glow-yellow": "0 0 20px rgba(255, 209, 102, 0.4)",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "sparkle": {
          "0%, 100%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1) rotate(180deg)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        "pop-in": "pop-in 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        "sparkle": "sparkle 2s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "shimmer": "shimmer 3s linear infinite",
        marquee: "marquee 20s linear infinite",
        "marquee-reverse": "marquee-reverse 20s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
