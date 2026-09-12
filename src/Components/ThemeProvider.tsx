"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { usesEditorialDesign } from "@/lib/siteDesign";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  return <NextThemesProvider {...props} forcedTheme={usesEditorialDesign(pathname) ? "light" : props.forcedTheme}>{children}</NextThemesProvider>;
}
