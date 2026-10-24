import type { NextConfig } from "next";
import { apiRewrites } from "./src/lib/v2/api-paths";

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["jotai"],
  },
  transpilePackages: ["jotai"],
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-35fc99d1cb2b4cc1b75216788a3543fb.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-f9f7d99a5b7c4d858a673d96aea96e13.r2.dev",
        port: "",
        pathname: "/**",
      },
      // v2 media (backend app.media.*): public images on the R2 CDN
      // (CLOUDFLARE_PUBLIC_URL, an r2.dev host unless a custom domain is set)
      // and private photos as 15-minute signed R2 URLs.
      { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      // A custom CDN domain, when CLOUDFLARE_PUBLIC_URL isn't an r2.dev host.
      ...(process.env.NEXT_PUBLIC_MEDIA_HOST
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.NEXT_PUBLIC_MEDIA_HOST,
              pathname: "/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://justgo.up.railway.app";
    return [
      // Backend v2 at the ROOT path, same-origin (refresh cookie is Path=/auth).
      // No app page lives under any of these prefixes (pages are /provider/*,
      // /curator/* and the marketing/legal pages), so nothing is shadowed.
      ...apiRewrites(apiBase),
      // TODO(v2-curator): the old /api/v1 client is still used by curator
      // screens that haven't moved to v2; drop this once they have.
      {
        source: "/api/:path*",
        destination: `${apiBase.replace(/\/+$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
