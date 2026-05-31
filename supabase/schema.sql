-- ============================================================
-- Beyund Systems Labs - Students Table
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  program_interest TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'enrolled', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students (email);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_students_status ON students (status);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students (created_at DESC);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on the students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for the registration form on the landing page)
-- This lets anyone submit a registration without being logged in
CREATE POLICY "Allow anonymous inserts"
  ON students
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users full read access (for the admin dashboard)
CREATE POLICY "Allow authenticated read"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update (for status changes in dashboard)
CREATE POLICY "Allow authenticated update"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete (for removing records in dashboard)
CREATE POLICY "Allow authenticated delete"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Note: The API route uses the service_role key which bypasses
-- RLS entirely, so the POST /api/registrations route will work
-- regardless of these policies. The RLS policies above protect
-- direct client-side access to the Supabase database.
-- ============================================================

-- ============================================================
-- Admin User Setup
-- ============================================================
-- To create an admin user, use the Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Enter email and password
-- 4. The user will be able to log in at /admin/login
--
-- Alternatively, you can use the Supabase CLI:
-- supabase auth signup --email admin@beyund.com --password your-password
-- ============================================================