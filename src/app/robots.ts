import { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Tüm botlar için genel kural
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/auth/",
          "/_next/",
        ],
      },
      {
        // Googlebot için özel — daha agresif crawl izni
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/api/", "/auth/"],
      },
    ],
    sitemap: `${APP_CONFIG.url}/sitemap.xml`,
    host: APP_CONFIG.url,
  };
}
