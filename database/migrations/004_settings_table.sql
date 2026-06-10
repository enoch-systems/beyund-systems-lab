-- ============================================================
-- Admin Settings Table
-- Run this in your Supabase SQL Editor (creates table if it
-- doesn't exist without dropping anything)
-- ============================================================

-- Create the table only if it doesn't exist (safe to re-run)
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security (safe to re-run)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist (safe to re-run)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_settings' AND policyname = 'Allow authenticated read settings'
  ) THEN
    CREATE POLICY "Allow authenticated read settings" ON admin_settings FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_settings' AND policyname = 'Allow authenticated upsert settings'
  ) THEN
    CREATE POLICY "Allow authenticated upsert settings" ON admin_settings FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_settings' AND policyname = 'Allow authenticated update settings'
  ) THEN
    CREATE POLICY "Allow authenticated update settings" ON admin_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_settings' AND policyname = 'Allow authenticated delete settings'
  ) THEN
    CREATE POLICY "Allow authenticated delete settings" ON admin_settings FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Index (safe to re-run)
CREATE INDEX IF NOT EXISTS idx_admin_settings_updated_at ON admin_settings (updated_at DESC);
