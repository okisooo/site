import type { Metadata } from "next"
import ReleasesClient from "@/app/releases/ReleasesClient"
import { staticReleases } from "@/data/releases"
import { releaseCard } from "@/lib/releasePresentation"

export const metadata: Metadata = {
  title: "Release interaction lab | OKISO",
  description: "An unlisted interaction prototype for the OKISO release archive.",
  robots: { index: false, follow: false },
}

export default function ReleasesLabPage() {
  return (
    <ReleasesClient catalog={staticReleases.map(releaseCard)} />
  )
}
