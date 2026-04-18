import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminSecret = process.env.ADMIN_SECRET || "ceyfur_premium_secret_2024";

    if (password !== adminSecret) {
      return NextResponse.json({ success: false, message: "Geçersiz parola" }, { status: 401 });
    }

    // Create a secured session token by hashing the secret
    // This ensures root secret is never exposed in the browser
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
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
