/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@tradygo/ui'],
  images: {
    domains: ['localhost', 'tradygo.in', 'cdn.tradygo.in'],
  },
};

module.exports = nextConfig;