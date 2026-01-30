import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Ensure fresh builds on Vercel
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
