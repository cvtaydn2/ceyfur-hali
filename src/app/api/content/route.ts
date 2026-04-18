import { NextResponse } from "next/server";
import { updateSiteContent } from "@/lib/content-repository";
import { SiteContentSchema } from "@/lib/content-schema";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validation with Zod
    const validatedData = SiteContentSchema.parse(body);
    
    // 2. Repository Update (Supabase)
    await updateSiteContent(validatedData as any);
    
    return NextResponse.json({ 
      success: true, 
      message: "Content updated successfully" 
    });

  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        success: false, 
        code: "VALIDATION_ERROR",
        message: "İçerik doğrulama hatası. Lütfen alanları kontrol edin.", 
        details: error.format()
      }, { status: 400 });
    }

    if (error.message?.includes("Failed to update content")) {
      return NextResponse.json({ 
        success: false, 
        code: "DATABASE_ERROR",
        message: "Veritabanına kayıt yapılamadı.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      }, { status: 500 });
    }

    console.error("Content API Error:", error);
    return NextResponse.json({ 
      success: false, 
      code: "INTERNAL_ERROR",
      message: "Sunucu tarafında beklenmedik bir hata oluştu.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    }, { status: 500 });
  }
}
