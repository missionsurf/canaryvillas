import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "canaryvillas.com",
      },
      {
        protocol: "https",
        hostname: "pnkxfbsjd3gpupqs.public.blob.vercel-storage.com",
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

export default withNextIntl(nextConfig);
