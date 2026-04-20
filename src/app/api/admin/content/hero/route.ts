import { NextResponse } from "next/server";
import { updateSiteContentSection, getSiteContentFresh } from "@/lib/content-repository";
import { HeroSchema } from "@/lib/content-schema";
import { writeAuditLog } from "@/lib/audit-log";
import { requireAuth } from "@/lib/admin-auth";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = HeroSchema.parse(body);

    // Mevcut içeriği audit log için sakla
    const before = await getSiteContentFresh().catch(() => null);

    await updateSiteContentSection("hero", validatedData);

    // Audit log
    await writeAuditLog({
      action: "section_update",
      entityType: "site_content",
      entityId: "hero",
      beforeData: before?.hero ? (before.hero as unknown as Record<string, unknown>) : undefined,
      afterData: validatedData as unknown as Record<string, unknown>,
    });

    return NextResponse.json({
      success: true,
      message: "Hero bölümü başarıyla güncellendi.",
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: "Hero bölümü doğrulama hatası.",
          details: error.format(),
        },
        { status: 400 }
      );
    }

    console.error("[admin-hero] POST hatası:", error);
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
