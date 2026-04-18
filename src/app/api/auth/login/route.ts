import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, message: "Parola gerekli" }, { status: 400 });
    }

    const adminSecret = process.env.ADMIN_SECRET;
    
    // Debug: Log which env vars are available (without exposing values)
    console.log("ENV check:", { 
      hasAdminSecret: !!adminSecret, 
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nodeEnv: process.env.NODE_ENV 
    });
    
    if (!adminSecret) {
      return NextResponse.json({ 
        success: false, 
        message: "Sunucu yapılandırma hatası: ADMIN_SECRET environment variable Netlify'de ayarlanmadı" 
      }, { status: 500 });
    }

    if (password !== adminSecret) {
      return NextResponse.json({ success: false, message: "Geçersiz parola" }, { status: 401 });
    }

    const sessionToken = crypto
      .createHmac("sha256", adminSecret)
      .update("ceyfur_admin_session_v1")
      .digest("hex");

    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}