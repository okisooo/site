// next.config.js
module.exports = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
