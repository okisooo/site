// src/app/upcoming/metadata.ts
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata(
    "OKISO / upcoming",
    "New music and announcements from OKISO. In the meantime, hear the latest release or explore demos in the vault.",
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
