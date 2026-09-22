import type { NextConfig } from "next";

const API_ORIGIN = (
  process.env.API_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_ORIGIN ||
  "https://api.eonage.ru"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.eonage.ru",
      },
      {
        protocol: "https",
        hostname: "s3.twcstorage.ru",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/oauth-sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${API_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
