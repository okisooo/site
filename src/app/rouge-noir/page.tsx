import { Playfair_Display, Archivo } from "next/font/google";
import { metadata } from "./metadata";
import RougeNoirClient from "./RougeNoirClient";
import { socialImage } from "@/lib/socialImages";

export { metadata };

/* Scoped display/body faces per LOOKLOCK v1:
   Display: Playfair Display (Didone, engraved brass signage feeling).
   Body: Archivo (Neutral grotesk). Tabular numerals enabled via CSS on .rn-mono. */
const rnDisplay = Playfair_Display({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-rn-display",
});
const rnBody = Archivo({ subsets: ["latin"], variable: "--font-rn-body" });

const siteUrl = "https://okiso.net";

const videoGameLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Rouge & Noir",
  url: `${siteUrl}/rouge-noir`,
  description:
    "A roulette × roguelike deckbuilder. Place bets, spin the single-zero wheel, and hit score targets across 8 antes. Buy charms, rig the wheel, and stack multipliers.",
  genre: ["Roguelike", "Deckbuilder", "Strategy"],
  gamePlatform: ["PC"],
  applicationCategory: "Game",
  author: {
    "@type": "Organization",
    name: "OKISO",
    url: siteUrl,
  },
  image: socialImage('/rouge-noir').url,
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    {
      "@type": "ListItem",
      position: 2,
      name: "Rouge & Noir",
      item: `${siteUrl}/rouge-noir`,
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [videoGameLd, breadcrumbLd] }),
        }}
      />
      <div className={`${rnDisplay.variable} ${rnBody.variable}`}>
        <RougeNoirClient />
      </div>
    </>
  );
}
