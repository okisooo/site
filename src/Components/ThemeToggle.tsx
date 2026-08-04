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
        <div data-okiso-chrome="theme-toggle" className="fixed bottom-6 right-6 z-50">
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-3.5 bg-[#eceae5] dark:bg-[#0c0c0e] border border-[rgb(16_16_20_/_0.22)] dark:border-[rgb(240_240_237_/_0.18)] text-[#101014] dark:text-[#f0f0ed] hover:border-[#e6112b] hover:text-[#e6112b] transition-colors flex items-center justify-center font-mono text-xs"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
                {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
        </div>
    );
}
