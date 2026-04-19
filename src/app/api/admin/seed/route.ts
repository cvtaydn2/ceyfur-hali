/**
 * DB Seed Endpoint — Yalnızca geliştirme ortamında kullanılır.
 * Supabase'deki site_configs tablosunu fallback JSON ile başlatır.
 *
 * Kullanım: POST /api/admin/seed
 * Bu route production'da devre dışıdır.
 */
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import fallbackContent from "@/data/siteContent.json";
import { requireAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { success: false, message: "Bu endpoint yalnızca geliştirme ortamında kullanılabilir." },
      { status: 403 }
    );
  }

  const authError = await requireAuth();
  if (authError) return authError;

  const { error } = await supabaseAdmin
    .from("site_configs")
    .upsert({ id: "main", content: fallbackContent, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json(
      { success: false, message: `Seed başarısız: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Veritabanı fallback içerikle başarıyla güncellendi.",
  });
}
