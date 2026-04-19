import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Admin oturum token'ını üretir.
 * ADMIN_SECRET + sabit mesaj → HMAC-SHA256 hex string.
 */
export function generateSessionToken(secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update("ceyfur_admin_session_v1")
    .digest("hex");
}

/**
 * API route'larında oturum doğrulaması yapar.
 * Geçersiz oturum durumunda 401 response döner, aksi halde null.
 *
 * Middleware zaten /api/admin ve /api/content route'larını korur.
 * Bu fonksiyon ikinci bir güvenlik katmanı olarak kullanılır.
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json(
      { success: false, message: "Sunucu yapılandırma hatası." },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie?.value) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz erişim." },
      { status: 401 }
    );
  }

  const expectedToken = generateSessionToken(adminSecret);
  if (sessionCookie.value !== expectedToken) {
    return NextResponse.json(
      { success: false, message: "Geçersiz oturum." },
      { status: 401 }
    );
  }

  return null;
}
