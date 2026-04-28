-- ============================================================
-- Migration 000: Başlangıç şeması
-- ============================================================

-- ─── Site Config ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_configs (
  id          TEXT        PRIMARY KEY,
  content     JSONB       NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_configs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_configs' AND policyname = 'site_configs_public_read'
  ) THEN
    CREATE POLICY "site_configs_public_read"
      ON site_configs FOR SELECT
      USING (true);
  END IF;
END $$;

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

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'leads' AND policyname = 'leads_public_insert'
  ) THEN
    CREATE POLICY "leads_public_insert"
      ON leads FOR INSERT
      WITH CHECK (false); -- API üzerinden kontrollü insert yapılacak
  END IF;
END $$;

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

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'leads_archive' AND policyname = 'leads_archive_service_only'
  ) THEN
    CREATE POLICY "leads_archive_service_only"
      ON leads_archive
      USING (false);
  END IF;
END $$;

-- ─── Archive Lead RPC ─────────────────────────────────────────

DROP FUNCTION IF EXISTS archive_lead(UUID, TEXT);

CREATE OR REPLACE FUNCTION archive_lead(
  p_lead_id       UUID,
  p_final_status  TEXT
) RETURNS void AS $$
BEGIN
  -- Yetki kontrolü (Sadece authenticated admin çağırabilir)
  IF auth.role() <> 'authenticated' THEN
    RAISE EXCEPTION 'Yetkisiz erişim.';
  END IF;

  INSERT INTO leads_archive (
    original_lead_id,
    full_name,
    phone,
    service_id,
    district,
    preferred_date,
    notes,
    final_status,
    created_at
  )
  SELECT
    id,
    full_name,
    phone,
    service_id,
    district,
    preferred_date,
    notes,
    p_final_status,
    created_at
  FROM leads
  WHERE id = p_lead_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead bulunamadı: %', p_lead_id;
  END IF;

  DELETE FROM leads WHERE id = p_lead_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Partial Update RPC ───────────────────────────────────────

CREATE OR REPLACE FUNCTION update_site_content_section(
  p_section TEXT,
  p_data    JSONB
) RETURNS void AS $$
BEGIN
  -- Yetki kontrolü (Sadece authenticated admin)
  IF auth.role() <> 'authenticated' THEN
    RAISE EXCEPTION 'Yetkisiz erişim.';
  END IF;

  UPDATE site_configs
  SET 
    content = jsonb_set(content, ARRAY[p_section], p_data, true),
    updated_at = NOW()
  WHERE id = 'main';

  IF NOT FOUND THEN
    -- Eğer kayıt yoksa oluştur (fallback'ten beslenen ilk kayıt için)
    INSERT INTO site_configs (id, content, updated_at)
    VALUES ('main', jsonb_build_object(p_section, p_data), NOW());
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

