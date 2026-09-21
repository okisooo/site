import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

const title = "Rouge & Noir — OKISO";
const description =
  "A roulette roguelike deckbuilder. Place your bets, collect charms and bend the odds.";

export const metadata: Metadata = {
  ...pageMetadata(title, description, '/rouge-noir'),
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
};
