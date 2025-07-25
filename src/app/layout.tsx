// src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import WavesWrapper from '@/Components/WavesWrapper';
import SwipeContainer from '@/Components/SwipeContainer/SwipeContainer';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              "name": "OKISO",
              "alternateName": "オキソ",
              "url": "https://okiso.net",
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
              ],
              "makesOffer": {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "MusicAlbum",
                  "name": "FANTASIA & ETUDE",
                  "byArtist": {
                    "@type": "MusicGroup",
                    "name": "OKISO"
                  }
                }
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen w-full relative">
          <WavesWrapper />
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