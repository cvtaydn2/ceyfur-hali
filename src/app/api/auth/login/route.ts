import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateSessionToken } from "@/lib/admin-auth";
import { SESSION_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Parola gerekli." },
        { status: 400 }
      );
    }

    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      console.error("ADMIN_SECRET environment variable tanımlı değil.");
      return NextResponse.json(
        { success: false, message: "Sunucu yapılandırma hatası." },
        { status: 500 }
      );
    }

    if (password !== adminSecret) {
      return NextResponse.json(
        { success: false, message: "Geçersiz parola." },
        { status: 401 }
      );
    }

    const sessionToken = generateSessionToken(adminSecret);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_CONFIG.cookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_CONFIG.maxAge,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login hatası:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
