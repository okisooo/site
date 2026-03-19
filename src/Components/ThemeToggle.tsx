"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 group">
            <div className="absolute inset-0 bg-ba-pink dark:bg-white rounded-full blur-[20px] opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-pulse pointer-events-none" />
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative p-4 rounded-full bg-white dark:bg-[#111] shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-2 border-black/5 dark:border-white/10 text-black dark:text-white hover:border-ba-pink dark:hover:border-ba-pink hover:text-ba-pink dark:hover:text-ba-pink transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center isolate"
                aria-label="Toggle Dark Mode"
            >
                {theme === "dark" ? <FaSun size={24} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-500 group-hover:rotate-180" /> : <FaMoon size={24} className="transition-all duration-500 group-hover:-rotate-12" />}
            </button>
        </div>
    );
}
