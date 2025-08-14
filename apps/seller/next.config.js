/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@tradygo/ui'],
  images: {
    domains: [
      'localhost',
      'tradygo.in',
      'cdn.tradygo.in',
      'pub-4c6376b443dd4c0889479e5958ddf218.r2.dev',
      '100cd1b89d3b20902f6d8c56ad05e975.r2.cloudflarestorage.com',
    ],
  },
};

module.exports = nextConfig;