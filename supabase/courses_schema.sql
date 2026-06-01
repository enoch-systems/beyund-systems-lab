-- ============================================================
-- Courses Module for Beyond Academy
-- Run this entire block in your Supabase SQL Editor
-- Creates courses tables without affecting existing data
-- ============================================================

-- ============================================================
-- 1. COURSES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  total_weeks INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. COURSE WEEKS TABLE (curriculum)
-- ============================================================

CREATE TABLE IF NOT EXISTS course_weeks (
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

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_course_weeks_course ON course_weeks (course_id);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses (created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_weeks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "Allow authenticated read courses" ON courses;
DROP POLICY IF EXISTS "Allow authenticated insert courses" ON courses;
DROP POLICY IF EXISTS "Allow authenticated update courses" ON courses;
DROP POLICY IF EXISTS "Allow authenticated delete courses" ON courses;

DROP POLICY IF EXISTS "Allow authenticated read weeks" ON course_weeks;
DROP POLICY IF EXISTS "Allow authenticated insert weeks" ON course_weeks;
DROP POLICY IF EXISTS "Allow authenticated update weeks" ON course_weeks;
DROP POLICY IF EXISTS "Allow authenticated delete weeks" ON course_weeks;

CREATE POLICY "Allow authenticated read courses" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert courses" ON courses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update courses" ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete courses" ON courses FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read weeks" ON course_weeks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert weeks" ON course_weeks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update weeks" ON course_weeks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete weeks" ON course_weeks FOR DELETE TO authenticated USING (true);