import "server-only";
import { supabaseAdmin } from "./supabase-admin";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuditAction = "content_update" | "section_update" | "login" | "logout" | "login_failed" | "password_changed";
export type AuditEntityType = "site_content" | "section" | "auth";

export interface AuditLogEntry {
  id: string;
  action_type: AuditAction;
  entity_type: AuditEntityType;
  entity_id: string | null;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Audit log kaydı oluşturur.
 * Hata durumunda sessizce geçer — log hatası asıl işlemi engellememelidir.
 */
export async function writeAuditLog(params: {
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await supabaseAdmin.from("admin_audit_logs").insert({
      action_type: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId ?? null,
      before_data: params.beforeData ?? null,
      after_data: params.afterData ?? null,
      metadata: params.metadata ?? null,
    });
  } catch (err) {
    // Audit log hatası asıl işlemi durdurmamalı
    console.error("[audit-log] Log yazılamadı:", err);
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Son N adet audit log kaydını getirir.
 */
export async function getAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  const { data, error } = await supabaseAdmin
    .from("admin_audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Audit loglar alınamadı: ${error.message}`);
  }

  return (data ?? []) as AuditLogEntry[];
}
