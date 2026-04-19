-- ============================================================
-- Migration 001: Auth güçlendirme ve audit log tabloları
-- ============================================================

-- ─── Admin Sessions ──────────────────────────────────────────
-- Service role key ile erişilir (RLS bypass).
-- Public erişim tamamen kapalı.

CREATE TABLE IF NOT EXISTS admin_sessions (
  token       TEXT        PRIMARY KEY,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at
  ON admin_sessions (expires_at);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Tüm public erişimi engelle (service role RLS'yi bypass eder)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_sessions' AND policyname = 'admin_sessions_deny_all'
  ) THEN
    CREATE POLICY "admin_sessions_deny_all"
      ON admin_sessions
      AS RESTRICTIVE
      FOR ALL
      TO public
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

-- ─── Login Attempts ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS login_attempts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address   TEXT        NOT NULL,
  success      BOOLEAN     NOT NULL DEFAULT false,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time
  ON login_attempts (ip_address, attempted_at);

CREATE INDEX IF NOT EXISTS idx_login_attempts_time
  ON login_attempts (attempted_at);

ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'login_attempts' AND policyname = 'login_attempts_deny_all'
  ) THEN
    CREATE POLICY "login_attempts_deny_all"
      ON login_attempts
      AS RESTRICTIVE
      FOR ALL
      TO public
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

-- ─── Admin Audit Logs ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type  TEXT        NOT NULL,
  entity_type  TEXT        NOT NULL,
  entity_id    TEXT,
  before_data  JSONB,
  after_data   JSONB,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON admin_audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type
  ON admin_audit_logs (action_type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
  ON admin_audit_logs (entity_type, entity_id);

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_audit_logs' AND policyname = 'audit_logs_deny_all'
  ) THEN
    CREATE POLICY "audit_logs_deny_all"
      ON admin_audit_logs
      AS RESTRICTIVE
      FOR ALL
      TO public
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

-- ─── Cleanup Function ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM login_attempts
  WHERE attempted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Comments ─────────────────────────────────────────────────

COMMENT ON TABLE admin_sessions   IS 'Admin oturum tokenları. Stateless HMAC yerine DB''de saklanır.';
COMMENT ON TABLE login_attempts   IS 'Brute force koruması için giriş denemeleri.';
COMMENT ON TABLE admin_audit_logs IS 'Admin işlem geçmişi. Rollback ve denetim için.';
