/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  transpilePackages: ['undici', 'firebase', 'firebase-admin'],
};

module.exports = nextConfig;
