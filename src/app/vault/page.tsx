import type { Metadata } from "next";
import VaultClient from "@/Components/Vault/VaultClient";

export const metadata: Metadata = {
  title: "The Vault | OKISO",
  description: "OKISO demos, alternate versions and unfinished tracks.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://okiso.net/vault" },
};

export default function VaultPage() {
  return <VaultClient />;
}
