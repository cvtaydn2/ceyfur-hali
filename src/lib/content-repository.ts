import "server-only";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabase-admin";
import { SiteContent } from "@/types";
import fallbackContent from "@/data/siteContent.json";
import { SiteContentSchema } from "./content-schema";

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
  const result = await getSiteContentWithMeta();
  return result.data;
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

  const parsed = SiteContentSchema.safeParse(data.content);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    console.error("[content-repository] DB içeriği geçersiz, fallback kullanılıyor:", issues);
    return {
      data: fallbackContent as unknown as SiteContent,
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

  const parsed = SiteContentSchema.safeParse(data.content);
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
}

/**
 * Belirli bir bölümü mevcut içerikle deep merge ederek günceller.
 * Partial update — sadece ilgili alan değişir, geri kalan dokunulmaz.
 */
export async function updateSiteContentSection<K extends keyof SiteContent>(
  section: K,
  sectionData: SiteContent[K]
): Promise<void> {
  // Mevcut içeriği çek
  const current = await getSiteContentFresh().catch(async () => {
    // DB'de kayıt yoksa fallback'ten başla
    return fallbackContent as unknown as SiteContent;
  });

  // Sadece ilgili bölümü güncelle
  const updated: SiteContent = { ...current, [section]: sectionData };

  // Full schema ile doğrula
  const parsed = SiteContentSchema.safeParse(updated);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`Güncelleme geçersiz: ${issues}`);
  }

  const { error } = await supabaseAdmin
    .from("site_configs")
    .upsert({ id: "main", content: parsed.data, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(`Bölüm güncellenemedi: ${error.message}`);
  }

  // Save-verify
  await getSiteContentFresh();

  // ISR cache'ini temizle
  revalidateAllPaths();
}

// ─── Cache Invalidation ───────────────────────────────────────────────────────

function revalidateAllPaths(): void {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/hizmetler/[slug]", "page");
    revalidatePath("/bolgeler/[slug]", "page");
  } catch {
    // revalidatePath sadece request context'inde çalışır, hata sessizce geçilir
  }
}
