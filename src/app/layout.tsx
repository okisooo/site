import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/editorial.css";
import "@/styles/editorial-motion.css";
import "@/styles/gallery.css";
import "@/styles/editorial-ambient.css";
import SiteFrame from "@/Components/Editorial/SiteFrame";
import { ThemeProvider } from "@/Components/ThemeProvider";
import { cn } from "@/lib/utils";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import { SmoothScrollProvider } from "@/motion/SmoothScrollProvider";
import { getLocalPlaylist } from "@/lib/localPlaylist";
import { pageMetadata } from "@/lib/seo";

// Technical mono for HUD labels / metadata annotation (docs/FRAMEWORK.md §5 step 2).
// tailwind.config mapped `font-mono` to `var(--font-geist-mono)`, which was defined
// nowhere — so all 28 font-mono call sites silently fell back to system monospace.
// (The previous Geist *sans* here was downloaded on every page and never rendered:
// fontFamily.sans was never extended, so `font-sans` resolved to the system stack.)
const geistMono = localFont({ src: "../assets/fonts/geist-mono-latin.woff2", weight: "100 900", variable: "--font-geist-mono", display: "swap" });
const editorial = localFont({ src: "../assets/fonts/archivo-latin.woff2", weight: "100 900", variable: "--font-editorial", display: "swap" });

const nunito = localFont({
  src: "../assets/fonts/nunito-latin.woff2",
  preload: false,
  variable: "--font-display",
  weight: "200 1000",
  display: "swap",
});

// Keep the existing standalone-page font without the failing remote CSS loader.
const quicksand = localFont({
  src: "../assets/fonts/quicksand-latin.woff2",
  preload: false,
  variable: "--font-ui",
  weight: "300 700",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL('https://okiso.net'),
  ...pageMetadata(
    "OKISO — music, art & more",
    "VTuber, virtual artist and VOCALOID producer. Listen to my music, browse the art gallery and explore the vault.",
    "",
  ),
  keywords: [
    "OKISO",
    "okiso",
    "オキソ",
    "virtual artist",
    "music producer",
    "electronic music",
    "hyperpop",
    "vocaloid",
    "vtuber",
    "OKISO official",
    "OKISO music"
  ],
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: "OKISO",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geistMono.variable)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.okiso.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.okiso.net" />

        {/* Small resizes of the 512px icon, which stays for the manifest and external links. */}
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png?v=20260626" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png?v=20260626" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png?v=20260626" />
      </head>
      <body suppressHydrationWarning className={`${editorial.variable} ${nunito.variable} ${quicksand.variable} antialiased overflow-x-hidden bg-white text-black dark:bg-black dark:text-white transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="okiso-theme"
        >
          <a href="#main-content" className="ed-skip-link sr-only">skip to content</a>
          <MusicPlayerProvider playlist={getLocalPlaylist()}>
          <SmoothScrollProvider>
            <SiteFrame>{children}</SiteFrame>
          </SmoothScrollProvider>
          </MusicPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
