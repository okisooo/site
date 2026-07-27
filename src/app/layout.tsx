import { Nunito, Quicksand, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/Components/ThemeProvider";
import { ThemeToggle } from "@/Components/ThemeToggle";
import { cn } from "@/lib/utils";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import { MusicPlayer } from "@/Components/MusicPlayer";
import { TitleAnimator } from "@/Components/TitleAnimator";
import AnimatedGrid from "@/Components/Backgrounds/AnimatedGrid";
import { SmoothScrollProvider } from "@/motion/SmoothScrollProvider";

// Technical mono for HUD labels / metadata annotation (docs/FRAMEWORK.md §5 step 2).
// tailwind.config mapped `font-mono` to `var(--font-geist-mono)`, which was defined
// nowhere — so all 28 font-mono call sites silently fell back to system monospace.
// (The previous Geist *sans* here was downloaded on every page and never rendered:
// fontFamily.sans was never extended, so `font-sans` resolved to the system stack.)
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const quicksand = Quicksand({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const metadata = {
  metadataBase: new URL('https://okiso.net'),
  title: "OKISO ✦ Official Site | VOCALOID Producer & VTuber",
  description: "OKISO, at your command! ✦ VTuber, VOCALOID producer, and virtual artist making hyperpop and electronic music. New releases, live streams, and every link in one place.",
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
    description: "OKISO, at your command! ✦ VTuber, VOCALOID producer, and virtual artist making hyperpop and electronic music. New releases, live streams, and every link in one place.",
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
    description: "OKISO, at your command! ✦ VTuber, VOCALOID producer, and virtual artist making hyperpop and electronic music. New releases, live streams, and every link in one place.",
    images: ["https://okiso.net/og_image.png"]
  }
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
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        {/* Pinch-zoom stays enabled. `maximum-scale=1.0, user-scalable=no` was a
            WCAG 1.4.4 failure and blocked zooming into artwork and release covers.
            If iOS input auto-zoom shows up, fix it with 16px form fonts, not by
            locking the viewport. */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#7CC8F8" />

        <link rel="icon" type="image/png" sizes="48x48 96x96 192x192 512x512" href="/icon.png?v=20260626" />
        <link rel="apple-touch-icon" href="/icon.png?v=20260626" />
      </head>
      <body suppressHydrationWarning className={`${nunito.variable} ${quicksand.variable} antialiased bg-white text-black dark:bg-black dark:text-white transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="okiso-theme"
        >
          <TitleAnimator />
          {/* z-0: paints above the body background, below the z-[1] content wrapper. */}
          <AnimatedGrid />
          <MusicPlayerProvider>
            <MusicPlayer />

          <SmoothScrollProvider>
            <div className="relative z-[1] min-h-screen flex flex-col overflow-x-clip">
              <header className="sr-only">
                <h1>OKISO オキソ | VOCALOID Producer / VTuber</h1>
                <nav>{/* Navigation links */}</nav>
              </header>

              <main className="flex-grow relative w-full flex flex-col">
                {children}
              </main>

              <footer className="sr-only">
                <p>© {new Date().getFullYear()} オキソ. All rights reserved.</p>
              </footer>
            </div>
          </SmoothScrollProvider>
          <ThemeToggle />
          </MusicPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
