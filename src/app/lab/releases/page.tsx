import type { Metadata } from "next"
import ReleasesClient from "@/app/releases/ReleasesClient"
import { staticReleases } from "@/data/releases"
import { releaseCard } from "@/lib/releasePresentation"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  ...pageMetadata("Release interaction lab | OKISO", "An unlisted interaction prototype for the OKISO release archive.", "/lab/releases"),
  robots: { index: false, follow: false },
}

export default function ReleasesLabPage() {
  return (
    <ReleasesClient catalog={staticReleases.map(releaseCard)} />
  )
}
