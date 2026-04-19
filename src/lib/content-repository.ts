import "server-only";
import { cache } from "react";
import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabase-admin";
import { SiteContent } from "@/types";
import fallbackContent from "@/data/siteContent.json";
import { SiteContentSchema } from "./content-schema";

/**
 * Site içeriğini Supabase'den okur.
 * React `cache()` ile sarıldığı için aynı render cycle'da
 * (generateMetadata + RootLayout gibi) yalnızca bir kez DB'ye gider.
 *
 * Hata veya geçersiz veri durumunda fallback JSON'a döner.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const { data, error } = await supabase
    .from("site_configs")
    .select("content")
    .eq("id", "main")
    .single();

  if (error || !data?.content) {
    console.error("Site içeriği alınamadı, fallback kullanılıyor:", error?.message);
    return fallbackContent as unknown as SiteContent;
  }

  const result = SiteContentSchema.safeParse(data.content);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    console.error("DB içeriği geçersiz, fallback kullanılıyor. Sorunlar:", issues);
    return fallbackContent as unknown as SiteContent;
  }

  return result.data;
});

/**
 * Site içeriğini Supabase'e kaydeder.
 * Yalnızca sunucu tarafında (API route) çağrılmalıdır.
 */
export async function updateSiteContent(content: SiteContent): Promise<void> {
  const { error } = await supabaseAdmin
    .from("site_configs")
    .upsert({ id: "main", content, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(`İçerik güncellenemedi: ${error.message}`);
  }
}
