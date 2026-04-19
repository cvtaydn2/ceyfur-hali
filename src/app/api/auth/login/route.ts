import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import {
  generateSessionToken,
  createSession,
  recordLoginAttempt,
  isRateLimited,
  cleanExpiredSessions,
} from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { SESSION_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  try {
    // Rate limit kontrolü — tablo yoksa veya hata varsa geç
    const limited = await isRateLimited(ip).catch(() => false);
    if (limited) {
      return NextResponse.json(
        { success: false, message: "Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }

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
      console.error("[auth/login] ADMIN_SECRET tanımlı değil.");
      return NextResponse.json(
        { success: false, message: "Sunucu yapılandırma hatası." },
        { status: 500 }
      );
    }

    const isValid = timingSafeEqual(password, adminSecret);

    if (!isValid) {
      // Hata olursa sessizce geç — login'i engelleme
      recordLoginAttempt(ip, false).catch(() => {});
      writeAuditLog({ action: "login_failed", entityType: "auth", metadata: { ip } }).catch(() => {});

      return NextResponse.json(
        { success: false, message: "Geçersiz parola." },
        { status: 401 }
      );
    }

    // Session token oluştur ve cookie'ye yaz
    const sessionToken = generateSessionToken();

    // DB'ye session kaydet — hata olursa logla ama devam et
    const sessionSaved = await createSession(sessionToken)
      .then(() => true)
      .catch((err) => {
        console.error("[auth/login] Session DB'ye kaydedilemedi:", err);
        return false;
      });

    if (!sessionSaved) {
      return NextResponse.json(
        { success: false, message: "Oturum oluşturulamadı. Lütfen tekrar deneyin." },
        { status: 500 }
      );
    }

    // Arka plan işlemleri — hata olursa sessizce geç
    recordLoginAttempt(ip, true).catch(() => {});
    cleanExpiredSessions().catch(() => {});
    writeAuditLog({ action: "login", entityType: "auth", metadata: { ip } }).catch(() => {});

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
    console.error("[auth/login] Hata:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası." },
      { status: 500 }
    );
  }
}

/**
 * Sabit zamanlı string karşılaştırması — timing attack önlemi.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    const dummy = b.padEnd(a.length, "\0");
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ dummy.charCodeAt(i);
    }
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
