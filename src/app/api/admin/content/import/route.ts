import { NextResponse } from "next/server";
import { updateSiteContent, getSiteContentFresh } from "@/lib/content-repository";
import { SiteContentSchema } from "@/lib/content-schema";
import { writeAuditLog } from "@/lib/audit-log";
import { requireAuth } from "@/lib/admin-auth";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

/**
 * Tüm site içeriğini günceller.
 * Kayıt sonrası DB'den tekrar okuyarak doğrular (save-verify).
 */
export async function PATCH(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = SiteContentSchema.parse(body);

    // Mevcut içeriği audit log için sakla
    const before = await getSiteContentFresh().catch(() => null);

    await updateSiteContent(validatedData);

    // Audit log
    await writeAuditLog({
      action: "content_update",
      entityType: "site_content",
      entityId: "main",
      beforeData: before ? (before as Record<string, unknown>) : undefined,
      afterData: validatedData as unknown as Record<string, unknown>,
    });

    return NextResponse.json({
      success: true,
      message: "İçerik başarıyla güncellendi.",
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: "İçerik doğrulama hatası. Lütfen alanları kontrol edin.",
          details: error.format(),
        },
        { status: 400 }
      );
    }

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

    console.error("[content] POST hatası:", error);
    return NextResponse.json(
      {
        success: false,
        code: "INTERNAL_ERROR",
        message: "Sunucu hatası oluştu.",
      },
      { status: 500 }
    );
  }
}
