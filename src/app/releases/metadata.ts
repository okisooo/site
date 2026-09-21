import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata(
    "OKISO / music",
    "My albums and singles, all in one place. Listen, read the lyrics and find your next favorite.",
    "/releases",
  ),
  keywords: [
    "OKISO music",
    "FANTASIA & ETUDE album",
    "Miku vocals",
    "GUMI vocals",
    "vocaloid music",
    "OKISO Spotify",
    "OKISO Bandcamp",
  ],
};
