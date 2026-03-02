import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-12991a9f3b9e43eba46833e1ac879e50.r2.dev',
      },
    ],
  },
};

export default nextConfig;
