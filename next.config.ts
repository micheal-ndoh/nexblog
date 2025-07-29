import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.cubbit.eu',
        pathname: '/nexblog/**',
      },
    ],
  },
};

export default nextConfig;
