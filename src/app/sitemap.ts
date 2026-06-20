import { MetadataRoute } from "next";
import { getAllVillas } from "@/lib/villas";
import { blogPosts } from "@/lib/blog";

const BASE = "https://canaryvillas.com";

const SITE_LAUNCH = new Date("2025-01-01");
const VILLAS_UPDATED = new Date("2025-04-01");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const villas = await getAllVillas();

  const villaUrls = villas.map((v) => ({
    url: `${BASE}/villas/${v.slug}`,
    lastModified: VILLAS_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogUrls = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: SITE_LAUNCH, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/villas`, lastModified: VILLAS_UPDATED, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/blog`, lastModified: new Date("2025-03-01"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.5 },
    ...villaUrls,
    ...blogUrls,
  ];
}
