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

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation failed", 
        errors: error.issues 
      }, { status: 400 });
    }

    console.error("Content API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "An internal server error occurred",
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}
