// next.config.js
module.exports = {
  output: "export",
  images: {
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
