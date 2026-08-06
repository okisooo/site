import type { Metadata } from "next"
import { Archivo, JetBrains_Mono } from "next/font/google"
import FluidReleasesLab from "./FluidReleasesLab"

const display = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-archive-display",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-archive-mono",
})

export const metadata: Metadata = {
  title: "Release interaction lab | OKISO",
  description: "An unlisted interaction prototype for the OKISO release archive.",
  robots: { index: false, follow: false },
}

export default function ReleasesLabPage() {
  return (
    <div className={`${display.variable} ${mono.variable}`}>
      <FluidReleasesLab />
    </div>
  )
}
