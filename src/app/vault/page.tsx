import type { Metadata } from "next";
import VaultClient from "@/Components/Vault/VaultClient";

export const metadata: Metadata = {
  title: "The Vault | OKISO",
  description: "Demos, versions and cuts — straight from the source.",
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return <VaultClient />;
}
