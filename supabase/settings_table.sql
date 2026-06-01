-- ============================================================
-- Admin Settings Table
-- Paste this entire block into your Supabase SQL Editor
-- ============================================================

-- Drop table if exists (safe to re-run)
DROP TABLE IF EXISTS admin_settings;

-- Create the settings table (key-value store with JSONB values)
CREATE TABLE admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all settings
CREATE POLICY "Allow authenticated read settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert new settings
CREATE POLICY "Allow authenticated upsert settings"
  ON admin_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update existing settings
CREATE POLICY "Allow authenticated update settings"
  ON admin_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete settings
CREATE POLICY "Allow authenticated delete settings"
  ON admin_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Index for faster lookups by updated_at
CREATE INDEX IF NOT EXISTS idx_admin_settings_updated_at ON admin_settings (updated_at DESC);