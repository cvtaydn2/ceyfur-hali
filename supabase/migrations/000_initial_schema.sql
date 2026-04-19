-- ============================================================
-- Migration 000: Başlangıç şeması
-- Mevcut tablolar için referans — zaten oluşturulmuşsa atla.
-- ============================================================

-- ─── Site Config ─────────────────────────────────────────────
-- Tüm site içeriğini tek JSON olarak saklar.

CREATE TABLE IF NOT EXISTS site_configs (
  id          TEXT        PRIMARY KEY,
  content     JSONB       NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: Public okuma, service role yazma
ALTER TABLE site_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "site_configs_public_read"
  ON site_configs FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "site_configs_service_write"
  ON site_configs FOR ALL
  USING (false)
  WITH CHECK (false);

-- ─── Leads ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  service_id     TEXT        NOT NULL,
  district       TEXT        NOT NULL,
  preferred_date TEXT,
  notes          TEXT,
  status         TEXT        NOT NULL DEFAULT 'new',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public insert (form gönderimi)
CREATE POLICY IF NOT EXISTS "leads_public_insert"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Service role tüm işlemler
CREATE POLICY IF NOT EXISTS "leads_service_all"
  ON leads FOR ALL
  USING (false);

-- ─── Leads Archive ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads_archive (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  original_lead_id UUID,
  full_name        TEXT        NOT NULL,
  phone            TEXT        NOT NULL,
  service_id       TEXT        NOT NULL,
  district         TEXT        NOT NULL,
  preferred_date   TEXT,
  notes            TEXT,
  final_status     TEXT        NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL,
  completed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_archive_completed_at
  ON leads_archive (completed_at DESC);

ALTER TABLE leads_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "leads_archive_service_only"
  ON leads_archive
  USING (false);

-- ─── Archive Lead RPC ─────────────────────────────────────────
-- Lead'i arşive taşır ve leads tablosundan siler.

CREATE OR REPLACE FUNCTION archive_lead(
  p_lead_id    UUID,
  p_status     TEXT
) RETURNS void AS $$
DECLARE
  v_lead leads%ROWTYPE;
BEGIN
  SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead bulunamadı: %', p_lead_id;
  END IF;

  INSERT INTO leads_archive (
    original_lead_id, full_name, phone, service_id,
    district, preferred_date, notes, final_status, created_at
  ) VALUES (
    v_lead.id, v_lead.full_name, v_lead.phone, v_lead.service_id,
    v_lead.district, v_lead.preferred_date, v_lead.notes, p_status, v_lead.created_at
  );

  DELETE FROM leads WHERE id = p_lead_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
