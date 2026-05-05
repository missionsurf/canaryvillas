import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "canaryvillas.com",
      },
    ],
  },
  serverExternalPackages: [
    "@libsql/client",
    "@libsql/client/http",
    "@prisma/adapter-libsql",
    "node-ical",
    "ical-generator",
  ],
};

export default nextConfig;
