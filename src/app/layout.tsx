import { Geist, Geist_Mono } from "next/font/google";
import { Exo_2, Urbanist } from "next/font/google";
import HalftoneWave from '@/Components/Urban/HalftoneWave';
import CRTOverlay from '@/Components/Urban/CRTOverlay';
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
  alternates: {
    canonical: 'https://okiso.net'
  },
  openGraph: {
    title: "OKISO オキソ | VOCALOID Producer / VTuber",
    description:
      "Discover the universe of VOCALOID Producer / VTuber OKISO. Listen to music, explore art, and connect across social media.",
    url: "https://okiso.net",
    images: [
      {
        url: "https://i.imgur.com/pM8llz7.gif",
        width: 800,
        height: 600,
        alt: "OKISO Vocaloid Artist"
      }
    ],
    siteName: "オキソ PORTFOLIO",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "OKISO オキソ | VOCALOID Producer / VTuber",
    description:
      "Discover VOCALOID Producer / VTuber OKISO's portfolio with music, art, and social media links.",
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
    "description": "OKISO is a VOCALOID Producer, VTuber and Artist creating original electronic and Japanese styled VOCALOID music.",
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

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Releases",
        "item": `${siteUrl}/releases`
      }
    ]
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

        {/* Site-level JSON-LD: WebSite + ItemList (releases) + Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@graph": [webSiteLd, itemListLd, breadcrumbLd] }) }}
        />

        {/* Favicon (PNG) and Apple touch icon wired from app/favicon.png */}
        <link rel="icon" type="image/png" sizes="any" href={faviconPng.src} />
        <link rel="apple-touch-icon" href={faviconPng.src} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${urbanist.variable} ${exo2.variable} antialiased bg-urban-black text-urban-white overflow-x-hidden`}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <HalftoneWave />
          <CRTOverlay />
        </div>

        <div className="relative z-[1] min-h-screen flex flex-col">
          {/* Header hidden but accessible */}
          <header className="sr-only">
            <h1>OKISO オキソ | VOCALOID Producer / VTuber</h1>
            <nav>{/* Your navigation links */}</nav>
          </header>

          <main className="flex-grow relative w-full max-w-[1920px] mx-auto">
            {children}
          </main>

          <footer className="sr-only">
            <p>© {new Date().getFullYear()} オキソ. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}