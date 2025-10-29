import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-35fc99d1cb2b4cc1b75216788a3543fb.r2.dev",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
