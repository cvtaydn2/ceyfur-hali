import "server-only";
import { supabaseAdmin } from "./supabase-admin";
import crypto from "crypto";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Admin şifresini doğrular.
 * Önce DB'deki hash'e bakar, yoksa ADMIN_SECRET env var'a düşer.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const { data } = await supabaseAdmin
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password_hash")
      .single();

    if (data?.value) {
      // DB'de hash var — karşılaştır
      const inputHash = hashPassword(password);
      return inputHash === data.value;
    }
  } catch {
    // DB erişimi yoksa env var'a düş
  }

  // Fallback: ADMIN_SECRET env var
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return false;
  return timingSafeEqual(password, adminSecret);
}

/**
 * Admin şifresini günceller (hash'leyerek saklar).
 */
export async function updateAdminPassword(newPassword: string): Promise<void> {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Şifre en az 8 karakter olmalıdır.");
  }

  const hash = hashPassword(newPassword);

  const { error } = await supabaseAdmin
    .from("admin_settings")
    .upsert({
      key: "admin_password_hash",
      value: hash,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(`Şifre güncellenemedi: ${error.message}`);
  }
}

/**
 * Şifrenin son güncellenme zamanını döner.
 */
export async function getPasswordLastUpdated(): Promise<string | null> {
  try {
    const { data } = await supabaseAdmin
      .from("admin_settings")
      .select("updated_at")
      .eq("key", "admin_password_hash")
      .single();

    return data?.updated_at ?? null;
  } catch {
    return null;
  }
}

// ─── Timing Safe Compare ──────────────────────────────────────────────────────

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
