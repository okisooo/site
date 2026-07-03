import type { Metadata } from "next";
import VaultClient from "@/Components/Vault/VaultClient";

export const metadata: Metadata = {
  title: "The Vault | OKISO",
  description: "Private version archive.",
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return (
    <div className="vault-theme min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <VaultClient />
    </div>
  );
}
