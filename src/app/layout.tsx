import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "オキソ | Vocaloid Artist",
  description:
    "The official portfolio of Vocaloid Artist Okiso featuring music, art, and links to social media.",
  openGraph: {
    title: "オキソ | Vocaloid Artist",
    description:
      "Discover the work of Vocaloid Artist Okiso. Listen to music, explore art, and connect across social media.",
    url: "https://okiso.net",
    images: [
      {
        url: "https://i.imgur.com/pM8llz7.gif",
        width: 800,
        height: 600,
        alt: "Okiso Vocaloid Artist"
      }
    ],
    siteName: "オキソ Portfolio",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "オキソ | Vocaloid Artist",
    description:
      "Discover Vocaloid Artist Okiso’s portfolio with music, art, and social media links.",
    images: ["https://i.imgur.com/pM8llz7.gif"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
