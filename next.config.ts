import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Optional local build destination. With static export, Next uses a custom
  // distDir for the exported site and retains .next for its compilation cache.
  distDir: process.env.OKISO_EXPORT_DIR || ".next",
  // Required for GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  eslint: {
    // Old ZZZ/Urban files still on disk cause lint errors; safe to ignore during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
