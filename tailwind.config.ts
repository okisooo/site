import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        ring: "var(--ring)",

        // ── FRAMEWORK L2 semantics (docs/FRAMEWORK.md §1) ──
        // Channel triplets, so `/alpha` composition keeps working:
        // bg-surface-0/70 → rgb(var(--surface-0) / 0.7)
        surface: {
          0: "rgb(var(--surface-0) / <alpha-value>)",
          1: "rgb(var(--surface-1) / <alpha-value>)",
          2: "rgb(var(--surface-2) / <alpha-value>)",
        },
        ink: {
          1: "rgb(var(--ink-1) / <alpha-value>)",
          2: "rgb(var(--ink-2) / <alpha-value>)",
          3: "rgb(var(--ink-3) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--line-1) / <alpha-value>)",
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          ink: "rgb(var(--accent-ink) / <alpha-value>)",
          2: "rgb(var(--accent-2) / <alpha-value>)",
        },
        danger: "rgb(var(--danger) / <alpha-value>)",

        // ── FRAMEWORK L3 shadcn bridge (for pasted 21st.dev/shadcn parts) ──
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        input: "rgb(var(--input) / <alpha-value>)",
        // Blue Archive inspired palette (Red/White focus)
        "ba-red": "#FF4D4D",
        "ba-red-light": "#FFB3B3",
        "ba-red-deep": "#CC0000",
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
        "ba-gradient-red": "linear-gradient(180deg, var(--ba-red-light) 0%, var(--ba-white) 50%, var(--ba-cream) 100%)",
        "ba-gradient-sunset": "linear-gradient(135deg, var(--ba-pink-light) 0%, var(--ba-yellow) 50%, var(--ba-red-light) 100%)",
        "ba-gradient-hero": "linear-gradient(180deg, var(--ba-red) 0%, var(--ba-red-light) 40%, var(--ba-white) 100%)",
        "ba-gradient-card": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(250,251,255,0.05) 100%)",
        "dots-pattern": "radial-gradient(circle, var(--ba-lavender) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dots": "24px 24px",
      },
      borderRadius: {
        "ba": "16px",
        "ba-lg": "24px",
        "ba-pill": "9999px",
        // ── FRAMEWORK radii (docs/FRAMEWORK.md §1) ──
        // Deliberately NOT named sm/md/lg/xl: those are Tailwind defaults and
        // re-pointing them would silently restyle 17 existing call sites
        // (rounded-lg 8px → 24px). Semantic names collide with nothing.
        "chip": "var(--radius-sm)",
        "card": "var(--radius-md)",
        "panel": "var(--radius-lg)",
        "hero": "var(--radius-xl)",
        "pill": "var(--radius-pill)",
      },
      // ── FRAMEWORK fluid type steps ──
      fontSize: {
        "step--1": "var(--step--1)",
        "step-0": "var(--step-0)",
        "step-1": "var(--step-1)",
        "step-2": "var(--step-2)",
        "step-3": "var(--step-3)",
        "step-4": "var(--step-4)",
        "step-5": "var(--step-5)",
        "step-hero": "var(--step-hero)",
      },
      // ── FRAMEWORK z scale: one source of truth, no more magic z-[51] ──
      zIndex: {
        base: "var(--z-base)",
        raised: "var(--z-raised)",
        sticky: "var(--z-sticky)",
        chrome: "var(--z-chrome)",
        player: "var(--z-player)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
        entry: "var(--z-entry)",
      },
      transitionTimingFunction: {
        "out-expo": "var(--ease-out-expo)",
        "in-out-expo": "var(--ease-in-out-expo)",
        spring: "var(--ease-spring)",
      },
      boxShadow: {
        "ba-soft": "0 4px 20px rgba(255, 77, 77, 0.15), 0 2px 8px rgba(0,0,0,0.05)",
        "ba-card": "0 8px 32px rgba(255, 77, 77, 0.2), 0 2px 8px rgba(0,0,0,0.04)",
        "ba-glow-pink": "0 0 20px rgba(255, 126, 179, 0.4)",
        "ba-glow-red": "0 0 20px rgba(255, 77, 77, 0.4)",
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
        marquee: "marquee 10s linear infinite",
        "marquee-reverse": "marquee-reverse 10s linear infinite",
        "marquee-fast": "marquee 3s linear infinite",
        "marquee-reverse-fast": "marquee-reverse 3s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
