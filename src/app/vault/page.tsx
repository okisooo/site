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
    // BUGFIX (docs/FRAMEWORK.md §0 defect #3): this wrapper forces a dark page,
    // but the .vault-* component classes gate their dark styling behind `dark:`.
    // The site's defaultTheme is "light", so a first-time visitor got
    // .vault-panel = bg-white/90 inheriting text-white (white on white) and
    // .vault-secondary = text-black on a black page. Adding `dark` here makes
    // every dark: variant in the subtree resolve, with no .vault-* edits.
    // `data-theme-scope`/`data-scheme` are the forward-looking L4 scope hooks
    // (src/styles/scopes.css); the old `vault-theme` class was defined nowhere.
    <div
      data-theme-scope="vault"
      data-scheme="dark"
      className={`${serif.variable} dark min-h-screen bg-black text-white`}
    >
      <VaultClient />
    </div>
  );
}
