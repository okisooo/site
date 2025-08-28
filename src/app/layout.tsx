// src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import { Exo_2, Urbanist } from "next/font/google";
import SwipeContainer from '@/Components/SwipeContainer/SwipeContainer';
import DarkVeil from '@/Backgrounds/DarkVeil/DarkVeil';
import faviconPng from './favicon.png';
import "./globals.css";
import { staticReleases } from '@/data/releases';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display font for titles
const exo2 = Exo_2({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

// UI font for navbar/body
const urbanist = Urbanist({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "OKISO | Official Website - Vocaloid Artist and Music Producer",
  description: "OKISO - Official website of Vocaloid artist and music producer. Explore OKISO's music, releases, art, and connect via social media. Japanese vocaloid music featuring original compositions.",
  keywords: [
    "OKISO",
    "okiso",
    "オキソ",
    "vocaloid artist",
    "vocaloid producer",
    "music producer",
    "electronic music",
    "Japanese vocaloid",
    "OKISO official",
    "OKISO music"
  ],
  openGraph: {
    title: "オキソ | Vocaloid Artist",
    description:
      "Discover the work of Vocaloid Artist Okiso. Listen to music, explore art, and connect across social media.",
    url: "https://okiso.net",
    images: [
      {
        url: "https://i.imgur.com/pM8llz7.gif",
        width: 800,
        height: 600,
        alt: "Okiso Vocaloid Artist"
      }
    ],
    siteName: "オキソ Portfolio",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "オキソ | Vocaloid Artist",
    description:
      "Discover Vocaloid Artist Okiso's portfolio with music, art, and social media links.",
    images: ["https://i.imgur.com/pM8llz7.gif"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Build site-level JSON-LD objects on the server
  const siteUrl = 'https://okiso.net';

  const musicGroupLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "OKISO",
    "alternateName": "オキソ",
    "url": siteUrl,
    "image": "https://i.imgur.com/pM8llz7.gif",
    "description": "OKISO is a Vocaloid artist and music producer creating original electronic and Japanese vocaloid music.",
    "sameAs": [
      "https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm",
      "https://www.instagram.com/okisooo_/",
      "https://github.com/okisooo",
      "https://x.com/okisooo_",
      "https://www.youtube.com/@okiso7",
      "https://discord.gg/okiso",
      "https://okiso.bandcamp.com/"
    ]
  };

  const webSiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": siteUrl,
    "name": "OKISO",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": staticReleases.map((r, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${siteUrl}/releases/${r.slug || encodeURIComponent(r.title.toLowerCase().replace(/\s+/g, '-'))}`
    }))
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* Chrome/Android PWA meta (apple tag above can be deprecated in some contexts) */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://okiso.net" />

        {/* Script to prevent double navigation on touch devices */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window._navInProgress = false;

                // Helper to detect mobile devices
                window.isMobileDevice = function() {
                  return (
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Macintosh/.test(navigator.userAgent))
                  );
                };

                // Handle touch events consistently
                if (window.isMobileDevice()) {
                  document.addEventListener('touchstart', function(e) {
                    if (e.target && e.target.tagName === 'A') {
                      e.target._touchStarted = true;
                    }
                  }, { passive: true });
                }
              })();
            `
          }}
        />

        {/* MusicGroup JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupLd) }}
        />

        {/* Site-level JSON-LD: WebSite + ItemList (releases) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@graph": [webSiteLd, itemListLd] }) }}
        />

        {/* Favicon (PNG) and Apple touch icon wired from app/favicon.png */}
        <link rel="icon" type="image/png" sizes="any" href={faviconPng.src} />
        <link rel="apple-touch-icon" href={faviconPng.src} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${urbanist.variable} ${exo2.variable} antialiased`}>
        <div className="h-screen w-full relative" style={{ height: '100dvh' }}>
          <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100dvh', zIndex: 0, pointerEvents: 'none' }}>
            <DarkVeil hueShift={280} resolutionScale={1.5} warpAmount={0.12} />
          </div>
          <div className="relative z-[1]">
            <header className="sr-only">
              <h1>オキソ | Vocaloid Artist</h1>
              <nav>{/* Your navigation links */}</nav>
            </header>
            <main className="relative h-full">
              <SwipeContainer>
                {children}
              </SwipeContainer>
            </main>
            <footer className="sr-only">
              <p>© {new Date().getFullYear()} オキソ. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}