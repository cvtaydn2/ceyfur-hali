import { NextResponse } from "next/server";
import { getSiteContentWithMeta } from "@/lib/content-repository";
import { requireAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Admin paneli için içerik okuma endpoint'i.
 * Fallback durumunu da döner — admin panelde uyarı göstermek için.
 */
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const result = await getSiteContentWithMeta();

    return NextResponse.json({
      success: true,
      content: result.data,
      isFromFallback: result.isFromFallback,
      fallbackReason: result.isFromFallback ? result.reason : undefined,
    });
  } catch (error) {
    console.error("[content/get] Hata:", error);
    return NextResponse.json(
      { success: false, message: "İçerik alınamadı." },
      { status: 500 }
    );
  }
}
