import { NextResponse } from "next/server";
import { LeadSchema } from "@/lib/leads-schema";
import { createLead } from "@/lib/leads-repository";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = LeadSchema.parse(body);
    
    // Create record (Public client is OK because of RLS handle)
    await createLead(validatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: "Talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız." 
    });

  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Lütfen tüm zorunlu alanları doğru doldurun.",
        details: error.format() 
      }, { status: 400 });
    }

    console.error("Lead API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Sunucu tarafında bir hata oluştu." 
    }, { status: 500 });
  }
}
