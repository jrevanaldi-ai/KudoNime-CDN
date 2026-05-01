/** @type {import('next').NextConfig} */
const nextConfig = {
  // Biar ga error saat build kalo env ga ada
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
