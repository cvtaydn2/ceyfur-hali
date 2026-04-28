import "server-only";
import { cache } from "react";
import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabase-admin";
import { SiteContent } from "@/types";
import fallbackContent from "@/data/siteContent.json";
import { SiteContentSchema } from "./content-schema";
import { slugify } from "./utils";

// ─── Data Normalization ───────────────────────────────────────────────────────

/**
 * Eski verilerde eksik olabilecek alanları (slug vb.) tamamlar.
 * Sistem dayanıklılığı için kritik.
 */
function normalizeContent(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const content = raw as any;

  // Services normalizasyonu
  if (content.services && Array.isArray(content.services.items)) {
    content.services.items = content.services.items.map((item: any) => ({
      ...item,
      slug: item.slug || item.id || slugify(item.title || "servis"),
    }));
  }

  // Bölgeler normalizasyonu
  if (content.services && Array.isArray(content.services.areas)) {
    content.services.areas = content.services.areas.map((area: any) => ({
      ...area,
      slug: area.slug || slugify(area.name || "bolge"),
    }));
  }

  return content;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentReadResult =
  | { data: SiteContent; isFromFallback: false; updatedAt?: string }
  | { data: SiteContent; isFromFallback: true; reason: string; updatedAt?: string };

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Site içeriğini Supabase'den okur.
 * React `cache()` ile sarıldığı için aynı render cycle'da yalnızca bir kez DB'ye gider.
 * Hata veya geçersiz veri durumunda fallback JSON'a döner.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  return unstable_cache(
    async () => {
      const result = await getSiteContentWithMeta();
      return result.data;
    },
    ["site-content"],
    { revalidate: 3600, tags: ["site-content"] }
  )();
});

/**
 * İçeriği fallback durumu bilgisiyle birlikte döner.
 * Admin panelinde fallback uyarısı göstermek için kullanılır.
 */
export async function getSiteContentWithMeta(): Promise<ContentReadResult> {
  const { data, error } = await supabase
    .from("site_configs")
    .select("content, updated_at")
    .eq("id", "main")
    .single();

  if (error || !data?.content) {
    const reason = error?.message ?? "Kayıt bulunamadı";
    console.error("[content-repository] DB okuma hatası, fallback kullanılıyor:", reason);
    return {
      data: fallbackContent as unknown as SiteContent,
      isFromFallback: true,
      reason,
      updatedAt: data?.updated_at,
    };
  }

  const normalized = normalizeContent(data.content);
  const parsed = SiteContentSchema.safeParse(normalized);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    console.error("[content-repository] DB içeriği geçersiz, fallback kullanılıyor:", issues);
    return {
      data: normalizeContent(fallbackContent) as unknown as SiteContent,
      isFromFallback: true,
      reason: `Validation hatası: ${issues}`,
      updatedAt: data?.updated_at,
    };
  }

  return { data: parsed.data, isFromFallback: false, updatedAt: data?.updated_at };
}

/**
 * Cache'i bypass ederek doğrudan DB'den okur.
 * Save-verify döngüsünde kullanılır.
 */
export async function getSiteContentFresh(): Promise<SiteContent> {
  const { data, error } = await supabaseAdmin
    .from("site_configs")
    .select("content")
    .eq("id", "main")
    .single();

  if (error || !data?.content) {
    throw new Error(`Taze içerik okunamadı: ${error?.message ?? "Kayıt yok"}`);
  }

  const normalized = normalizeContent(data.content);
  const parsed = SiteContentSchema.safeParse(normalized);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`Kaydedilen içerik geçersiz: ${issues}`);
  }

  return parsed.data;
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Tüm site içeriğini Supabase'e kaydeder.
 * Kayıt sonrası DB'den tekrar okuyarak doğrular (save-verify).
 * Başarılı kayıt sonrası ISR cache'ini temizler.
 */
export async function updateSiteContent(content: SiteContent): Promise<void> {
  const { error } = await supabaseAdmin
    .from("site_configs")
    .upsert({ id: "main", content, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(`İçerik güncellenemedi: ${error.message}`);
  }

  // Save-verify: kayıt sonrası DB'den tekrar oku ve doğrula
  await getSiteContentFresh();

  // ISR cache'ini temizle
  revalidateAllPaths();
  revalidateTag("site-content", "max");
}

/**
 * Belirli bir bölümü mevcut içerikle deep merge ederek günceller.
 * Partial update — sadece ilgili alan değişir, geri kalan dokunulmaz.
 */
export async function updateSiteContentSection<K extends keyof SiteContent>(
  section: K,
  sectionData: SiteContent[K]
): Promise<void> {
  // RPC üzerinden atomic partial update yap
  const { error } = await supabaseAdmin.rpc("update_site_content_section", {
    p_section: section,
    p_data: sectionData,
  });

  if (error) {
    throw new Error(`Bölüm güncellenemedi: ${error.message}`);
  }

  // ISR cache'ini temizle
  revalidateAllPaths();
  revalidateTag("site-content", "max");
}

// ─── Cache Invalidation ───────────────────────────────────────────────────────

function revalidateAllPaths(): void {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/hizmetler", "page");
    revalidatePath("/hizmetler/[slug]", "page");
    revalidatePath("/bolgeler", "page");
    revalidatePath("/bolgeler/[slug]", "page");
    revalidatePath("/sitemap.xml");
  } catch {
    // revalidatePath sadece request context'inde çalışır, hata sessizce geçilir
  }
}
