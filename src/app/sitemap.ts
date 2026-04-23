import { MetadataRoute } from "next";
import { getSiteContentWithMeta } from "@/lib/content-repository";
import { APP_CONFIG } from "@/lib/constants";

export const revalidate = 300; // 5 dakika — yeni bölge/hizmet eklenince hızlı güncellenir

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await getSiteContentWithMeta();
  const content = result.data;
  const base = APP_CONFIG.url;

  // DB'den gelen gerçek güncelleme tarihini kullan, yoksa fallback
  const lastModified = result.updatedAt ? new Date(result.updatedAt) : new Date("2024-04-18");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/hizmetler`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/bolgeler`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date("2024-04-18"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date("2024-04-18"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/kvkk`,
      lastModified: new Date("2024-04-18"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Hizmet sayfaları
  const serviceRoutes: MetadataRoute.Sitemap = content.services.items.map((item) => ({
    url: `${base}/hizmetler/${item.slug || item.id.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Bölge sayfaları
  const districtRoutes: MetadataRoute.Sitemap = (content.services.areas ?? []).map((area) => ({
    url: `${base}/bolgeler/${area.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...districtRoutes];
}
