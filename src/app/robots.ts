import { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/auth/"],
      },
    ],
    sitemap: `${APP_CONFIG.url}/sitemap.xml`,
    host: APP_CONFIG.url,
  };
}
