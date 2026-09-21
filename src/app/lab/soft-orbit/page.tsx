import type { Metadata } from "next";
import SoftOrbitLab from "./SoftOrbitLab";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = {
  ...pageMetadata("Editorial design preview | OKISO", "An unlisted preview of OKISO’s shared editorial design.", "/lab/soft-orbit"),
  robots: { index: false, follow: false },
};
export default function SoftOrbitLabPage() { return <SoftOrbitLab />; }
