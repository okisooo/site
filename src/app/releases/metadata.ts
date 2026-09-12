import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata(
    "OKISO Music Discography | VOCALOID Releases Archive",
    "Browse the complete music discography and releases archive of VOCALOID producer and VTuber OKISO. Explore albums, singles, tracklists, and Spotify links.",
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
