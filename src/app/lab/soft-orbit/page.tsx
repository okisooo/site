import type { Metadata } from "next"
import { Instrument_Sans } from "next/font/google"
import SoftOrbitLab from "./SoftOrbitLab"

const softOrbitFont = Instrument_Sans({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-soft-orbit",
})

export const metadata: Metadata = {
  title: "Soft orbit interaction lab | OKISO",
  description: "An unlisted character-led visual prototype for the OKISO website.",
  robots: { index: false, follow: false },
}

export default function SoftOrbitLabPage() {
  return (
    <div className={softOrbitFont.variable}>
      <SoftOrbitLab />
    </div>
  )
}
