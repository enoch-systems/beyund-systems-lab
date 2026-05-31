-- ============================================================
-- Beyund Systems Labs - Student Registrations Table
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xwjrlxrsmeryozvystwa/sql/new
-- ============================================================

-- Drop the old students table if it exists (replacing with new schema)
DROP TABLE IF EXISTS students;

-- Create the student_registrations table
CREATE TABLE IF NOT EXISTS student_registrations (
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
-- Note: The API route uses the service_role key which bypasses
-- RLS entirely. The RLS policies above protect direct
-- client-side access to the Supabase database.
-- ============================================================

-- ============================================================
-- Admin User Setup
-- ============================================================
-- To create an admin user, use the Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Enter email and password
-- 4. The user will be able to log in at /admin/login
-- ============================================================