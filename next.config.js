/** @type {import('next').NextConfig} */
// Force Vercel redeploy
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  transpilePackages: ['undici', 'firebase', 'firebase-admin'],
};

module.exports = withPWA(nextConfig);
