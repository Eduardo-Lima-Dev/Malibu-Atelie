/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "crocheparavendermais.com",
      // adicione outros domínios se necessário
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 