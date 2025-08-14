const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tradygo/ui'],
  webpack: (config) => {
    // Explicitly map "@" to the local src directory to ensure Vercel resolves aliases
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.join(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;