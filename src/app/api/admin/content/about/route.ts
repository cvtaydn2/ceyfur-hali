import { NextResponse } from "next/server";
import { updateSiteContentSection, getSiteContentFresh } from "@/lib/content-repository";
import { AboutSchema } from "@/lib/content-schema";
import { writeAuditLog } from "@/lib/audit-log";
import { requireAuth } from "@/lib/admin-auth";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = AboutSchema.parse(body);

    const before = await getSiteContentFresh().catch(() => null);

    await updateSiteContentSection("about", validatedData);

    await writeAuditLog({
      action: "section_update",
      entityType: "site_content",
      entityId: "about",
      beforeData: before?.about ? (before.about as unknown as Record<string, unknown>) : undefined,
      afterData: validatedData as unknown as Record<string, unknown>,
    });

    return NextResponse.json({
      success: true,
      message: "Hakkımızda bölümü başarıyla güncellendi.",
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: "Hakkımızda bölümü doğrulama hatası.",
          details: error.format(),
        },
        { status: 400 }
      );
    }
    console.error("[admin-about] POST hatası:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası." }, { status: 500 });
  }
}
