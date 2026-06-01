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
-- Supabase Storage Bucket for Reports
-- ============================================================
-- NOTE: Storage buckets must be created via the Supabase Dashboard.
-- To set up the "reports" bucket:
--
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name: reports
-- 4. Make it: Public (or configure policies below)
-- 5. File size limit: 50MB
-- 6. Allowed MIME types: application/pdf
--
-- Storage RLS Policies (run after bucket is created):
--
-- -- Allow authenticated uploads
-- CREATE POLICY "Allow authenticated uploads"
--   ON storage.objects
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'reports');
--
-- -- Allow authenticated reads
-- CREATE POLICY "Allow authenticated reads"
--   ON storage.objects
--   FOR SELECT
--   TO authenticated
--   USING (bucket_id = 'reports');
--
-- -- Allow authenticated deletes
-- CREATE POLICY "Allow authenticated deletes"
--   ON storage.objects
--   FOR DELETE
--   TO authenticated
--   USING (bucket_id = 'reports');
--
-- -- Allow public reads (optional, for shareable links)
-- CREATE POLICY "Allow public reads"
--   ON storage.objects
--   FOR SELECT
--   TO public
--   USING (bucket_id = 'reports');
-- ============================================================

-- ============================================================
-- Admin User Setup
-- ============================================================
-- To create an admin user, use the Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Enter email and password
-- 4. The user will be able to log in at /admin/login
