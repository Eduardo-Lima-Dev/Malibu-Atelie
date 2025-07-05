/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "crocheparavendermais.com",
      "xcrmutztexhdxlknxsqx.supabase.co",
      // adicione outros domínios se necessário
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 