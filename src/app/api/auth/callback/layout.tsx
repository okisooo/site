import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authorization callback | OKISO",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://okiso.net/api/auth/callback" },
};

export default function CallbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
