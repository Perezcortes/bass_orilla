import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Si vas a usar imágenes de otros sitios, agrégalos aquí también
    ],
  },
};

export default nextConfig;