import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
    // Preserve any classes that might be computed dynamically by Dock:
    { pattern: /^dock-/ },
    { pattern: /^hover:/ },
    { pattern: /^active:/ },
    // If you use arbitrary values like w-[50px] or similar:
    { pattern: /^\[.*\]$/ },
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
