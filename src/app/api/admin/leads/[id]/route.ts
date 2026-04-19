import { NextResponse } from "next/server";
import { updateLeadStatus } from "@/lib/leads-repository";
import { AllStatusSchema } from "@/lib/leads-schema";
import { requireAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Durum değerini schema ile doğrula
    const parsed = AllStatusSchema.safeParse(status);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Geçersiz durum değeri." },
        { status: 400 }
      );
    }

    await updateLeadStatus(id, parsed.data);

    return NextResponse.json({
      success: true,
      message: "Talep durumu güncellendi.",
    });
  } catch (error: unknown) {
    console.error("Admin Lead güncelleme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Güncelleme sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
