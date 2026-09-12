import { Archivo, Nunito, Quicksand, Geist_Mono } from "next/font/google";
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

// Technical mono for HUD labels / metadata annotation (docs/FRAMEWORK.md §5 step 2).
// tailwind.config mapped `font-mono` to `var(--font-geist-mono)`, which was defined
// nowhere — so all 28 font-mono call sites silently fell back to system monospace.
// (The previous Geist *sans* here was downloaded on every page and never rendered:
// fontFamily.sans was never extended, so `font-sans` resolved to the system stack.)
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const editorial = Archivo({ subsets: ["latin"], variable: "--font-editorial", display: "swap" });

const nunito = Nunito({
  preload: false,
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const quicksand = Quicksand({
  preload: false,
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://okiso.net'),
  title: "OKISO ✦ Official Site | VOCALOID Producer & VTuber",
  description: "OKISO is a virtual artist and VOCALOID producer creating hyperpop and electronic music. Explore releases, live streams, videos, and the full archive.",
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
  alternates: {
    canonical: 'https://okiso.net'
  },
  openGraph: {
    title: "OKISO ✦ Official Site | VOCALOID Producer & VTuber",
    description: "OKISO is a virtual artist and VOCALOID producer creating hyperpop and electronic music. Explore releases, live streams, videos, and the full archive.",
    url: "https://okiso.net",
    images: [
      {
        url: "https://okiso.net/og_image.png",
        alt: "OKISO Official Site"
      }
    ],
    siteName: "OKISO",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "OKISO ✦ Official Site | VOCALOID Producer & VTuber",
    description: "OKISO is a virtual artist and VOCALOID producer creating hyperpop and electronic music. Explore releases, live streams, videos, and the full archive.",
    images: ["https://okiso.net/og_image.png"]
  },
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

        <link rel="icon" type="image/png" sizes="48x48 96x96 192x192 512x512" href="/icon.png?v=20260626" />
        <link rel="apple-touch-icon" href="/icon.png?v=20260626" />
      </head>
      <body suppressHydrationWarning className={`${editorial.variable} ${nunito.variable} ${quicksand.variable} antialiased overflow-x-hidden bg-white text-black dark:bg-black dark:text-white transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="okiso-theme"
        >
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:p-4">Skip to content</a>
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
