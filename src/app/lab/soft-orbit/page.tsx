import type { Metadata } from "next";
import SoftOrbitLab from "./SoftOrbitLab";
export const metadata: Metadata = {
  title: "Editorial design preview | OKISO",
  description: "An unlisted preview of OKISO’s shared editorial design.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://okiso.net/lab/soft-orbit" },
};
export default function SoftOrbitLabPage() { return <SoftOrbitLab />; }
