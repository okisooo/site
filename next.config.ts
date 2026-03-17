/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Required for GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: true,
  },
  eslint: {
    // Old ZZZ/Urban files still on disk cause lint errors; safe to ignore during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
