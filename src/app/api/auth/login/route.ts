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
    // Rate limit kontrolü
    const limited = await isRateLimited(ip);
    if (limited) {
      return NextResponse.json(
        {
          success: false,
          message: "Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin.",
        },
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

    // Sabit zamanlı karşılaştırma (timing attack önlemi)
    const isValid = timingSafeEqual(password, adminSecret);

    if (!isValid) {
      await recordLoginAttempt(ip, false);
      await writeAuditLog({
        action: "login_failed",
        entityType: "auth",
        metadata: { ip },
      });

      return NextResponse.json(
        { success: false, message: "Geçersiz parola." },
        { status: 401 }
      );
    }

    // Session oluştur
    const sessionToken = generateSessionToken();
    await createSession(sessionToken);
    await recordLoginAttempt(ip, true);

    // Süresi dolmuş session'ları temizle (arka planda)
    cleanExpiredSessions().catch(() => {});

    await writeAuditLog({
      action: "login",
      entityType: "auth",
      metadata: { ip },
    });

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
 * Sabit zamanlı string karşılaştırması.
 * Timing attack'ı önler.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Uzunluk farkını gizlemek için yine de karşılaştır
    const dummy = b.padEnd(a.length, "\0");
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ dummy.charCodeAt(i);
    }
    return false; // Uzunluk farklıysa her zaman false
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
