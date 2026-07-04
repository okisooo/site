import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import VaultClient from "@/Components/Vault/VaultClient";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-vault-serif",
});

export const metadata: Metadata = {
  title: "The Vault | OKISO",
  description: "Demos, versions and cuts — straight from the source.",
  // Public now, but keep it out of search results: it's a listening room,
  // not a landing page.
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return (
    <div className={`${serif.variable} vault-theme min-h-screen bg-black text-white`}>
      <VaultClient />
    </div>
  );
}
