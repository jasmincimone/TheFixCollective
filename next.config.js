/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Do not bundle @vercel/blob: it pulls in undici with private fields (#target) that
  // webpack cannot parse, which breaks /api/vendor/listings/upload in dev and build.
  experimental: {
    serverComponentsExternalPackages: ["@vercel/blob"],
  },
};

module.exports = nextConfig;

