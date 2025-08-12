/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@tradygo/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  output: 'standalone',
  images: {
    domains: [
      'localhost',
      'tradygo.in',
      'cdn.tradygo.in',
      'images.unsplash.com',
      'via.placeholder.com',
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;