import type { Metadata } from "next";
import VaultClient from "@/Components/Vault/VaultClient";

export const metadata: Metadata = {
  title: "The Vault | OKISO",
  description: "Private version archive.",
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <VaultClient />
    </div>
  );
}
