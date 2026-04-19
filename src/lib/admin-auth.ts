import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "./supabase-admin";
import { SESSION_CONFIG } from "./constants";

// ─── Token ────────────────────────────────────────────────────────────────────

/**
 * Rastgele, tek kullanımlık session token üretir.
 * Her login'de farklı token → replay attack riski yok.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ─── Session DB ───────────────────────────────────────────────────────────────

/**
 * Session'ı DB'ye kaydeder.
 */
export async function createSession(token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_CONFIG.maxAge * 1000).toISOString();

  console.log("[createSession] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30));
  console.log("[createSession] Service key prefix:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20));

  const { error } = await supabaseAdmin.from("admin_sessions").upsert({
    token,
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[createSession] Supabase error:", JSON.stringify(error));
    throw new Error(`Session oluşturulamadı: ${error.message} (code: ${error.code})`);
  }
}

/**
 * Session'ı DB'den doğrular.
 * Süresi dolmuş veya bulunamayan session → false döner.
 */
export async function validateSession(token: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("admin_sessions")
    .select("token, expires_at")
    .eq("token", token)
    .single();

  if (error) {
    // PGRST116 = satır bulunamadı (normal durum)
    if (error.code !== "PGRST116") {
      console.error("[admin-auth] Session doğrulama hatası:", error.message);
    }
    return false;
  }

  if (!data) return false;

  const isExpired = new Date(data.expires_at) < new Date();
  if (isExpired) {
    void supabaseAdmin.from("admin_sessions").delete().eq("token", token);
    return false;
  }

  return true;
}

/**
 * Session'ı DB'den siler (logout).
 */
export async function revokeSession(token: string): Promise<void> {
  await supabaseAdmin.from("admin_sessions").delete().eq("token", token);
}

/**
 * Süresi dolmuş tüm session'ları temizler.
 */
export async function cleanExpiredSessions(): Promise<void> {
  await supabaseAdmin
    .from("admin_sessions")
    .delete()
    .lt("expires_at", new Date().toISOString());
}

// ─── Brute Force Protection ───────────────────────────────────────────────────

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 dakika
const MAX_ATTEMPTS = 5;

/**
 * Login denemesini kaydeder.
 */
export async function recordLoginAttempt(ip: string, success: boolean): Promise<void> {
  try {
    await supabaseAdmin.from("login_attempts").insert({
      ip_address: ip,
      success,
      attempted_at: new Date().toISOString(),
    });
  } catch {
    // Brute force kaydı başarısız olursa sessizce geç
  }
}

/**
 * IP adresinin son 15 dakikada çok fazla başarısız deneme yapıp yapmadığını kontrol eder.
 */
export async function isRateLimited(ip: string): Promise<boolean> {
  try {
    const windowStart = new Date(Date.now() - ATTEMPT_WINDOW_MS).toISOString();

    const { count, error } = await supabaseAdmin
      .from("login_attempts")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("success", false)
      .gte("attempted_at", windowStart);

    if (error) return false;
    return (count ?? 0) >= MAX_ATTEMPTS;
  } catch {
    return false;
  }
}

// ─── Middleware Auth (Edge Runtime) ──────────────────────────────────────────

/**
 * Edge Runtime'da session token'ını cookie'den okur.
 * Middleware'de kullanılır — DB erişimi yoktur, sadece token varlığını kontrol eder.
 * Gerçek doğrulama requireAuth() ile API route'larında yapılır.
 */
export function getSessionTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${SESSION_CONFIG.cookieName}=([^;]+)`));
  return match?.[1] ?? null;
}

// ─── API Route Auth ───────────────────────────────────────────────────────────

/**
 * API route'larında oturum doğrulaması yapar.
 * Geçersiz oturum durumunda 401 response döner, aksi halde null.
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_CONFIG.cookieName)?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { success: false, message: "Yetkisiz erişim." },
      { status: 401 }
    );
  }

  // Token formatını kontrol et (64 hex karakter)
  if (!/^[a-f0-9]{64}$/.test(sessionToken)) {
    return NextResponse.json(
      { success: false, message: "Geçersiz oturum." },
      { status: 401 }
    );
  }

  // DB doğrulaması — hata olursa token varlığına güven
  try {
    const isValid = await validateSession(sessionToken);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Oturum süresi dolmuş. Lütfen tekrar giriş yapın." },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error("[requireAuth] DB doğrulama hatası, token varlığına güveniliyor:", err);
    // DB erişimi yoksa token formatı yeterliyse geç
  }

  return null;
}
