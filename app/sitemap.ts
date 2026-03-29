import type { MetadataRoute } from "next";
import { getTools } from "@/lib/tools/store";

const BASE = "https://yaverim.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getTools();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/analyze`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tools`,   lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/compare`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/about`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/trust`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/cookies`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: tool.status === "priority" ? 0.85 : tool.status === "core" ? 0.75 : 0.6,
  }));

  return [...staticPages, ...toolPages];
}
