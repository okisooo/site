import type { Metadata } from "next";
import VaultClient from "@/Components/Vault/VaultClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata("OKISO / the vault", "Demos, alternate versions and unfinished tracks from my music archive.", "/vault"),
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return <VaultClient />;
}
