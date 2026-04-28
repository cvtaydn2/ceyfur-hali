import "server-only";
import { supabaseAdmin } from "./supabase-admin";
import crypto from "crypto";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parolayı rastgele bir salt ile hash'ler.
 * Format: salt:hash
 */
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * İki string'i timing-attack korumalı şekilde karşılaştırır.
 */
function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Admin şifresini doğrular.
 * Önce DB'deki hash'e bakar. Eğer DB'deki hash eşleşmezse veya DB erişilemezse
 * ADMIN_SECRET env var'ı fallback olarak kontrol eder (kilitlenme koruması).
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  let dbHash: string | null = null;

  try {
    const { data } = await supabaseAdmin
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password_hash")
      .single();
    
    dbHash = data?.value || null;
  } catch {
    // DB erişim hatası
  }

  // 1. DB Hash Kontrolü
  if (dbHash) {
    if (dbHash.includes(":")) {
      // Yeni format (salt:hash)
      const [salt, storedHash] = dbHash.split(":");
      const inputHash = crypto
        .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
        .toString("hex");
      
      if (safeCompare(inputHash, storedHash)) return true;
    } else {
      // Eski format (hardcoded salt)
      const legacyHash = crypto
        .pbkdf2Sync(password, "ceyfur-salt-v1", 100_000, 64, "sha512")
        .toString("hex");
      
      if (safeCompare(legacyHash, dbHash)) return true;
    }
  }

  // 2. Fallback: ADMIN_SECRET env var (DB hash yanlışsa veya yoksa)
  const adminSecret = process.env.ADMIN_SECRET;
  if (adminSecret && safeCompare(password, adminSecret)) {
    return true;
  }

  return false;
}

/**
 * Admin şifresini günceller (hash'leyerek saklar).
 */
export async function updateAdminPassword(newPassword: string): Promise<void> {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Şifre en az 8 karakter olmalıdır.");
  }

  const hashWithSalt = hashPassword(newPassword);

  const { error } = await supabaseAdmin
    .from("admin_settings")
    .upsert({
      key: "admin_password_hash",
      value: hashWithSalt,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "key"
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

