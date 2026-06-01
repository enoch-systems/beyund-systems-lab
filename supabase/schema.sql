-- ============================================================
-- Beyund Systems Labs - Student Registrations Table
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xwjrlxrsmeryozvystwa/sql/new
-- ============================================================

-- Drop existing policies if they exist (safe to re-run)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON student_registrations;
DROP POLICY IF EXISTS "Allow authenticated read" ON student_registrations;
DROP POLICY IF EXISTS "Allow authenticated update" ON student_registrations;
DROP POLICY IF EXISTS "Allow authenticated delete" ON student_registrations;

-- Drop old tables if they exist
DROP TABLE IF EXISTS students;

-- Drop and recreate the student_registrations table (fresh start)
DROP TABLE IF EXISTS student_registrations;

-- Create the student_registrations table
CREATE TABLE student_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  sex TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  course_applying_for TEXT NOT NULL,
  employment_status TEXT NOT NULL,
  has_laptop TEXT NOT NULL,
  heard_about_us TEXT NOT NULL,
  learning_reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'enrolled', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_registrations_email ON student_registrations (email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON student_registrations (status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON student_registrations (created_at DESC);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on the student_registrations table
ALTER TABLE student_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for the registration form on the landing page)
CREATE POLICY "Allow anonymous inserts"
  ON student_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users full read access (for the admin dashboard)
CREATE POLICY "Allow authenticated read"
  ON student_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update (for status changes in dashboard)
CREATE POLICY "Allow authenticated update"
  ON student_registrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete (for removing records in dashboard)
CREATE POLICY "Allow authenticated delete"
  ON student_registrations
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Note: The form uses the anon key + RLS policies for inserts.
-- The admin dashboard uses authenticated user session for reads.
-- ============================================================

-- ============================================================
-- Export Reports Table (for PDF export history)
-- ============================================================

-- Drop existing policies if they exist (safe to re-run)
DROP POLICY IF EXISTS "Allow authenticated read exports" ON export_reports;
DROP POLICY IF EXISTS "Allow authenticated insert exports" ON export_reports;
DROP POLICY IF EXISTS "Allow authenticated delete exports" ON export_reports;

-- Drop and recreate export_reports table
DROP TABLE IF EXISTS export_reports;

CREATE TABLE export_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT DEFAULT '',
  exported_by TEXT NOT NULL DEFAULT 'Admin',
  student_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast history lookups
CREATE INDEX IF NOT EXISTS idx_export_reports_created_at ON export_reports (created_at DESC);

-- Enable RLS
ALTER TABLE export_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users full read access
CREATE POLICY "Allow authenticated read exports"
  ON export_reports
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert exports"
  ON export_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete exports"
  ON export_reports
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Courses Table (with week-based curriculum)
-- ============================================================

DROP TABLE IF EXISTS course_weeks;
DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  total_weeks INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_weeks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  scheme_of_work TEXT DEFAULT '',
  resources TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, week_number)
);

CREATE INDEX IF NOT EXISTS idx_course_weeks_course ON course_weeks (course_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses (created_at DESC);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read courses" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert courses" ON courses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update courses" ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete courses" ON courses FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read weeks" ON course_weeks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert weeks" ON course_weeks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update weeks" ON course_weeks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete weeks" ON course_weeks FOR DELETE TO authenticated USING (true);

-- ============================================================
-- Admin Settings Table (key-value store for app settings)
-- ============================================================
-- This table stores all admin preferences and app configuration
-- that needs to persist across sessions and devices.
-- ============================================================

-- Drop existing table and policies (safe to re-run)
DROP POLICY IF EXISTS "Allow authenticated read settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow authenticated upsert settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow authenticated delete settings" ON admin_settings;

DROP TABLE IF EXISTS admin_settings;

CREATE TABLE admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all settings
CREATE POLICY "Allow authenticated read settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert/update settings
CREATE POLICY "Allow authenticated upsert settings"
  ON admin_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to upsert (update)
CREATE POLICY "Allow authenticated update settings"
  ON admin_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete settings
CREATE POLICY "Allow authenticated delete settings"
  ON admin_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_settings_updated_at ON admin_settings (updated_at DESC);

-- ============================================================
-- Saved SQL Scripts Table (for SQL Editor)
-- ============================================================
-- This table stores saved SQL queries from the admin SQL Editor.
-- ============================================================

-- Drop existing table and policies (safe to re-run)
DROP POLICY IF EXISTS "Allow authenticated read saved_sql" ON saved_sql_scripts;
DROP POLICY IF EXISTS "Allow authenticated insert saved_sql" ON saved_sql_scripts;
DROP POLICY IF EXISTS "Allow authenticated update saved_sql" ON saved_sql_scripts;
DROP POLICY IF EXISTS "Allow authenticated delete saved_sql" ON saved_sql_scripts;

DROP TABLE IF EXISTS saved_sql_scripts;

CREATE TABLE saved_sql_scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  sql_query TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE saved_sql_scripts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read saved scripts
CREATE POLICY "Allow authenticated read saved_sql"
  ON saved_sql_scripts
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert saved scripts
CREATE POLICY "Allow authenticated insert saved_sql"
  ON saved_sql_scripts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update saved scripts
CREATE POLICY "Allow authenticated update saved_sql"
  ON saved_sql_scripts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete saved scripts
CREATE POLICY "Allow authenticated delete saved_sql"
  ON saved_sql_scripts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_sql_scripts_updated_at ON saved_sql_scripts (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_sql_scripts_created_by ON saved_sql_scripts (created_by);

-- ============================================================
-- Supabase Storage Bucket for Reports
-- ============================================================
-- NOTE: Storage buckets must be created via the Supabase Dashboard.
-- ============================================================

-- ============================================================
-- Admin User Setup
-- ============================================================