-- ============================================================
-- Migration 002: Admin ayarları tablosu
-- Şifre ve diğer admin konfigürasyonları için.
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_settings (
  key        TEXT        PRIMARY KEY,
  value      TEXT        NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Tüm public erişimi engelle (service role bypass eder)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_settings' AND policyname = 'admin_settings_deny_all'
  ) THEN
    CREATE POLICY "admin_settings_deny_all"
      ON admin_settings
      AS RESTRICTIVE
      FOR ALL
      TO public
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

COMMENT ON TABLE admin_settings IS 'Admin panel konfigürasyonu. Şifre ve diğer ayarlar.';
COMMENT ON COLUMN admin_settings.key IS 'Ayar anahtarı (örn: admin_password_hash)';
COMMENT ON COLUMN admin_settings.value IS 'Ayar değeri';
