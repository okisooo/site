import type { Metadata } from "next";

const siteUrl = "https://okiso.net";
const title = "Rouge & Noir ✦ Roulette Roguelike Deckbuilder | OKISO";
const description =
  "Rouge & Noir — a roulette × roguelike deckbuilder. Place bets, spin the single-zero wheel, and hit score targets across 8 antes. Buy charms, rig the wheel, stack multipliers, and read the mood of an anime casino dealer whose rouge/noir temper bends the odds.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Rouge & Noir",
    "Rouge and Noir",
    "roulette roguelike",
    "roguelike deckbuilder",
    "roulette deckbuilder",
    "casino roguelike",
    "OKISO",
    "indie game",
    "anime casino game",
  ],
  alternates: {
    canonical: `${siteUrl}/rouge-noir`,
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/rouge-noir`,
    siteName: "OKISO",
    type: "website",
    images: [
      {
        // Replacement slot: swap for a real 1200x630 key-art card when art ships.
        url: "https://okiso.net/og_image.png",
        alt: "Rouge & Noir — roulette roguelike deckbuilder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://okiso.net/og_image.png"],
  },
};
