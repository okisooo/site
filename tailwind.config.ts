import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "text-white",
    "hover:text-white/80",
    "transition-colors",
    "absolute",
    "relative",
    "bottom-2",
    "left-1/2",
    "transform",
    "-translate-x-1/2",
    "flex",
    "items-end",
    "w-fit",
    "gap-4",
    "rounded-2xl",
    "border-neutral-700",
    "border-2",
    "pb-2",
    "px-4",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "urban-black": "#111111",
        "urban-dark": "#0a0a0a",
        "urban-yellow": "#DFFF00",
        "urban-pink": "#FF0055",
        "urban-cyan": "#00F0FF",
        "urban-white": "#F0F0F0",
        "neon-cyan": "#00F0FF",
        "neon-magenta": "#FF0055",
        "neon-orange": "#FF5F00",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        ui: ["var(--font-ui)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "halftone": "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
        "stripe-pattern": "repeating-linear-gradient(45deg, #000, #000 10px, #DFFF00 10px, #DFFF00 20px)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        "marquee-reverse": "marquee-reverse 20s linear infinite",
        glitch: "glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
