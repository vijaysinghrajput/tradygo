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
      'pub-4c6376b443dd4c0889479e5958ddf218.r2.dev',
      '100cd1b89d3b20902f6d8c56ad05e975.r2.cloudflarestorage.com',
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