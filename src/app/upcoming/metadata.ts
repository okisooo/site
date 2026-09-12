// src/app/upcoming/metadata.ts
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata(
    "OKISO | Upcoming Music Releases & Announcements",
    "Stay updated on upcoming music releases, future announcements, and project teasers from virtual artist and VOCALOID producer OKISO.",
    "/upcoming",
  ),
  keywords: [
    "OKISO upcoming",
    "OKISO new music",
    "upcoming vocaloid releases",
    "OKISO future releases",
    "vocaloid announcements",
  ],
};
