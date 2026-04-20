import { NextResponse } from "next/server";
import { updateSiteContentSection, getSiteContentFresh } from "@/lib/content-repository";
import { SeoSchema } from "@/lib/content-schema";
import { writeAuditLog } from "@/lib/audit-log";
import { requireAuth } from "@/lib/admin-auth";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = SeoSchema.parse(body);

    const before = await getSiteContentFresh().catch(() => null);

    await updateSiteContentSection("seo", validatedData);

    await writeAuditLog({
      action: "section_update",
      entityType: "site_content",
      entityId: "seo",
      beforeData: before?.seo ? (before.seo as unknown as Record<string, unknown>) : undefined,
      afterData: validatedData as unknown as Record<string, unknown>,
    });

    return NextResponse.json({
      success: true,
      message: "SEO ayarları başarıyla güncellendi.",
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: "SEO ayarları doğrulama hatası.",
          details: error.format(),
        },
        { status: 400 }
      );
    }
    console.error("[admin-seo] POST hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası." }, { status: 500 });
  }
}
