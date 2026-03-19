import { Nunito, Quicksand, Geist } from "next/font/google";
import "./globals.css";
import { staticReleases } from '@/data/releases';
import { ThemeProvider } from "@/Components/ThemeProvider";
import { ThemeToggle } from "@/Components/ThemeToggle";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  title: "OKISO ✦ Official Site",
  description: "OKISO — Virtual artist, VOCALOID producer & VTuber. Explore music, releases, art, and more!",
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
    title: "OKISO ✦ Official Site",
    description: "Virtual artist, VOCALOID producer & VTuber ♪",
    url: "https://okiso.net",
    images: [
      {
        url: "https://okiso.net/easter_egg.jpg",
        alt: "OKISO Official Site"
      }
    ],
    siteName: "OKISO",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "OKISO ✦ Official Site",
    description: "Virtual artist, VOCALOID producer & VTuber — music, art & vibes ♪",
    images: ["https://okiso.net/easter_egg.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = 'https://okiso.net';

  const musicGroupLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "OKISO",
    "alternateName": "オキソ",
    "url": siteUrl,
    "image": "https://okiso.net/easter_egg.jpg",
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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#7CC8F8" />

        {/* MusicGroup JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupLd) }}
        />

        {/* Site-level JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@graph": [webSiteLd, itemListLd, breadcrumbLd] }) }}
        />

        <link rel="icon" type="image/png" sizes="any" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body suppressHydrationWarning className={`${nunito.variable} ${quicksand.variable} antialiased overflow-x-hidden bg-white text-black dark:bg-black dark:text-white transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {/* <MusicPlayer /> */}

          <div className="relative z-[1] min-h-screen flex flex-col">
            <header className="sr-only">
              <h1>OKISO オキソ | VOCALOID Producer / VTuber</h1>
              <nav>{/* Navigation links */}</nav>
            </header>

            <main className="flex-grow relative w-full flex flex-col max-w-[1920px] mx-auto">
              {children}
            </main>

            <footer className="sr-only">
              <p>© {new Date().getFullYear()} オキソ. All rights reserved.</p>
            </footer>
          </div>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
