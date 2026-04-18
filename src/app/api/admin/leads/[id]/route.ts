import { NextResponse } from "next/server";
import { updateLeadStatus } from "@/lib/leads-repository";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id } = await params;

    if (!status) {
      return NextResponse.json({ success: false, message: "Geçersiz durum." }, { status: 400 });
    }

    await updateLeadStatus(id, status);
    
    return NextResponse.json({ 
      success: true, 
      message: "Talep durumu güncellendi." 
    });

  } catch (error: unknown) {
    console.error("Admin Lead Update Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Güncelleme sırasında bir hata oluştu." 
    }, { status: 500 });
  }
}
