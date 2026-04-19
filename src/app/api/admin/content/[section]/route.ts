import { NextResponse } from "next/server";
import {
  getSiteContentFresh,
  updateSiteContentSection,
} from "@/lib/content-repository";
import { SiteContentSchema } from "@/lib/content-schema";
import { writeAuditLog } from "@/lib/audit-log";
import { requireAuth } from "@/lib/admin-auth";
import { CONTENT_SECTIONS, type ContentSection } from "@/lib/constants";
import { SiteContent } from "@/types";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ section: string }> };

/**
 * Belirli bir içerik bölümünü okur.
 */
export async function GET(_req: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { section } = await params;

  if (!isValidSection(section)) {
    return NextResponse.json(
      { success: false, message: `Geçersiz bölüm: ${section}` },
      { status: 400 }
    );
  }

  try {
    const content = await getSiteContentFresh();
    return NextResponse.json({
      success: true,
      section,
      data: content[section],
    });
  } catch (error) {
    console.error(`[admin/content/${section}] GET hatası:`, error);
    return NextResponse.json(
      { success: false, message: "Bölüm okunamadı." },
      { status: 500 }
    );
  }
}

/**
 * Belirli bir içerik bölümünü günceller (partial update).
 * Sadece ilgili bölüm değişir, diğer bölümler dokunulmaz.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { section } = await params;

  if (!isValidSection(section)) {
    return NextResponse.json(
      { success: false, message: `Geçersiz bölüm: ${section}` },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    // Bölüme ait schema'yı al ve doğrula
    const sectionSchema = SiteContentSchema.shape[section];
    const parsed = sectionSchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: friendlyValidationMessage(issues),
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    // Audit log için mevcut veriyi sakla
    const current = await getSiteContentFresh().catch(() => null);
    const beforeData = current ? { [section]: current[section] } : undefined;

    // Partial update
    await updateSiteContentSection(section, parsed.data as SiteContent[ContentSection]);

    await writeAuditLog({
      action: "section_update",
      entityType: "section",
      entityId: section,
      beforeData: beforeData as Record<string, unknown> | undefined,
      afterData: { [section]: parsed.data } as Record<string, unknown>,
    });

    return NextResponse.json({
      success: true,
      message: `"${sectionLabel(section)}" bölümü başarıyla güncellendi.`,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("Kaydedilen içerik geçersiz")) {
      return NextResponse.json(
        {
          success: false,
          code: "VERIFY_FAILED",
          message: "Kayıt doğrulanamadı. Lütfen tekrar deneyin.",
        },
        { status: 500 }
      );
    }

    console.error(`[admin/content/${section}] PATCH hatası:`, error);
    return NextResponse.json(
      { success: false, message: "Güncelleme sırasında hata oluştu." },
      { status: 500 }
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidSection(section: string): section is ContentSection {
  return (CONTENT_SECTIONS as readonly string[]).includes(section);
}

function sectionLabel(section: string): string {
  const labels: Record<string, string> = {
    brand: "Genel Ayarlar",
    seo: "SEO",
    hero: "Ana Sayfa Hero",
    about: "Hakkımızda",
    services: "Hizmetler",
    pricing: "Fiyatlar",
    campaigns: "Kampanyalar",
    stats: "İstatistikler",
    testimonials: "Yorumlar",
    contact: "İletişim",
    navigation: "Navigasyon",
    footer: "Footer",
  };
  return labels[section] ?? section;
}

function friendlyValidationMessage(issues: string): string {
  if (issues.includes("email")) return "Geçerli bir e-posta adresi girin.";
  if (issues.includes("url")) return "Geçerli bir URL girin (https:// ile başlamalı).";
  if (issues.includes("min")) return "Zorunlu alanları doldurun.";
  return "Lütfen alanları kontrol edin.";
}
