import { NextResponse } from "next/server";
import { updateSiteContent } from "@/lib/content-repository";
import { SiteContentSchema } from "@/lib/content-schema";
import { ZodError } from "zod";
import { requireAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = SiteContentSchema.parse(body);
    await updateSiteContent(validatedData);

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

    if (error instanceof Error && error.message.includes("İçerik güncellenemedi")) {
      return NextResponse.json(
        {
          success: false,
          code: "DATABASE_ERROR",
          message: "Veritabanına kayıt yapılamadı.",
        },
        { status: 500 }
      );
    }

    console.error("Content API hatası:", error);
    return NextResponse.json(
      {
        success: false,
        code: "INTERNAL_ERROR",
        message: "Sunucu tarafında beklenmedik bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
