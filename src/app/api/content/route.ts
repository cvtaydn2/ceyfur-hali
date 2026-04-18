import { NextResponse } from "next/server";
import { updateSiteContent } from "@/lib/content-repository";
import { SiteContentSchema } from "@/lib/content-schema";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validation with Zod
    const validatedData = SiteContentSchema.parse(body);
    
    // 2. Check for Service Role Key (Safety first)
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        success: false, 
        code: "ENV_ERROR",
        message: "Kritik Hata: SUPABASE_SERVICE_ROLE_KEY bulunamadı. Lütfen .env.local dosyanızı kontrol edin." 
      }, { status: 500 });
    }

    // 3. Repository Update (Supabase)
    await updateSiteContent(validatedData as any);
    
    return NextResponse.json({ 
      success: true, 
      message: "Content updated successfully" 
    });

  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        success: false, 
        code: "VALIDATION_ERROR",
        message: "İçerik doğrulama hatası. Lütfen alanları kontrol edin.", 
        details: error.format()
      }, { status: 400 });
    }

    if (error instanceof Error && error.message?.includes("Failed to update content")) {
      return NextResponse.json({ 
        success: false, 
        code: "DATABASE_ERROR",
        message: "Veritabanına kayıt yapılamadı.",
        details: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined
      }, { status: 500 });
    }

    console.error("Content API Error:", error);
    return NextResponse.json({ 
      success: false, 
      code: "INTERNAL_ERROR",
      message: "Sunucu tarafında beklenmedik bir hata oluştu.",
      details: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined
    }, { status: 500 });
  }
}
