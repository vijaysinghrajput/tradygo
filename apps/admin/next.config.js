const path = require('path');

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
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.join(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;