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
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-ba-white shadow-ba-card border-2 border-ba-red/20 text-ba-red-deep hover:bg-ba-red hover:text-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
            aria-label="Toggle Dark Mode"
        >
            {theme === "dark" ? <FaSun size={24} /> : <FaMoon size={24} />}
        </button>
    );
}
