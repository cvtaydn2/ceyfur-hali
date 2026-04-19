-- ============================================================
-- Migration 001: Auth güçlendirme ve audit log tabloları
-- ============================================================

-- ─── Admin Sessions ──────────────────────────────────────────
-- Stateless HMAC token yerine DB'de saklanan session'lar.
-- Rotation, revoke ve expiry desteği sağlar.

CREATE TABLE IF NOT EXISTS admin_sessions (
  token       TEXT        PRIMARY KEY,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Süresi dolmuş session'ları otomatik temizlemek için index
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at
  ON admin_sessions (expires_at);

-- RLS: Sadece service role erişebilir
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_sessions_service_only"
  ON admin_sessions
  USING (false);  -- Tüm public erişimi engelle, service role bypass eder

-- ─── Login Attempts ──────────────────────────────────────────
-- Brute force koruması için başarısız giriş denemeleri.

CREATE TABLE IF NOT EXISTS login_attempts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address   TEXT        NOT NULL,
  success      BOOLEAN     NOT NULL DEFAULT false,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time
  ON login_attempts (ip_address, attempted_at);

-- Eski kayıtları temizlemek için index
CREATE INDEX IF NOT EXISTS idx_login_attempts_time
  ON login_attempts (attempted_at);

ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "login_attempts_service_only"
  ON login_attempts
  USING (false);

-- ─── Admin Audit Logs ─────────────────────────────────────────
-- Her admin işleminin kaydı. Veri kaybı durumunda rollback için.

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type  TEXT        NOT NULL,  -- content_update, section_update, login, logout, login_failed
  entity_type  TEXT        NOT NULL,  -- site_content, section, auth
  entity_id    TEXT,                  -- section adı veya kayıt ID'si
  before_data  JSONB,                 -- değişiklik öncesi veri
  after_data   JSONB,                 -- değişiklik sonrası veri
  metadata     JSONB,                 -- ek bilgi (IP, user agent, vb.)
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON admin_audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type
  ON admin_audit_logs (action_type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
  ON admin_audit_logs (entity_type, entity_id);

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_service_only"
  ON admin_audit_logs
  USING (false);

-- ─── Cleanup Function ─────────────────────────────────────────
-- Eski login attempt kayıtlarını temizler (30 günden eski).

CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM login_attempts
  WHERE attempted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Comments ─────────────────────────────────────────────────

COMMENT ON TABLE admin_sessions IS 'Admin oturum token''ları. Stateless HMAC yerine DB''de saklanır.';
COMMENT ON TABLE login_attempts IS 'Brute force koruması için giriş denemeleri.';
COMMENT ON TABLE admin_audit_logs IS 'Admin işlem geçmişi. Rollback ve denetim için.';
