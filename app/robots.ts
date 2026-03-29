import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/premium/unlock",
          "/account",
        ],
      },
    ],
    sitemap: "https://yaverim.io/sitemap.xml",
    host: "https://yaverim.io",
  };
}
