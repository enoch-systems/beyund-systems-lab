-- ============================================================
-- BEYUND LABS ACADEMY — PRODUCTION DATABASE SCHEMA
-- ============================================================
--
--   Single public schema with modular table prefixes
--   (Supabase best practice — custom schemas require
--    multi-client setup which complicates RLS + realtime)
--
-- Naming Convention:
--   Module prefix: [module]_[table]
--   Examples:
--     reg_students     → Registration module
--     courses_courses  → Courses module
--     courses_weeks    → Courses module (weeks)
--     report_exports   → Reports module
-- ============================================================

-- ============================================================
-- [REGISTRATION MODULE] — Student Applications & Enrollments
-- ============================================================

DROP TABLE IF EXISTS student_registrations;

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

CREATE INDEX IF NOT EXISTS idx_reg_email ON student_registrations (email);
CREATE INDEX IF NOT EXISTS idx_reg_status ON student_registrations (status);
CREATE INDEX IF NOT EXISTS idx_reg_created_at ON student_registrations (created_at DESC);

ALTER TABLE student_registrations ENABLE ROW LEVEL SECURITY;

-- Anonymous: can insert (registration form)
CREATE POLICY "allow_anon_insert"
  ON student_registrations FOR INSERT TO anon WITH CHECK (true);

-- Authenticated: full CRUD (admin dashboard)
CREATE POLICY "allow_auth_read"   ON student_registrations FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow_auth_update" ON student_registrations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth_delete" ON student_registrations FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow anonymous inserts" ON student_registrations;
DROP POLICY IF EXISTS "Allow authenticated read" ON student_registrations;
DROP POLICY IF EXISTS "Allow authenticated update" ON student_registrations;
DROP POLICY IF EXISTS "Allow authenticated delete" ON student_registrations;

-- ============================================================
-- [REPORTS MODULE] — PDF Export History
-- ============================================================

DROP TABLE IF EXISTS export_reports;

CREATE TABLE export_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT DEFAULT '',
  exported_by TEXT NOT NULL DEFAULT 'Admin',
  student_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_export_created_at ON export_reports (created_at DESC);

ALTER TABLE export_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_auth_read_exports"   ON export_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow_auth_insert_exports" ON export_reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "allow_auth_delete_exports" ON export_reports FOR DELETE TO authenticated USING (true);

-- ============================================================
-- [COURSES MODULE] — Course & Curriculum Management
-- ============================================================
-- Tables: courses, course_weeks
-- Foreign Key: course_weeks.course_id → courses.id
-- ============================================================

-- ── COURSES ──
DROP TABLE IF EXISTS course_weeks;
DROP TABLE IF EXISTS courses;

CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  total_weeks INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses (created_at DESC);

-- ── COURSE WEEKS ──
CREATE TABLE course_weeks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  scheme_of_work TEXT DEFAULT '',
  resources TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, week_number)
);

CREATE INDEX IF NOT EXISTS idx_weeks_course ON course_weeks (course_id);
CREATE INDEX IF NOT EXISTS idx_weeks_number ON course_weeks (course_id, week_number);

-- ── RLS Policies ──
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_read_courses"   ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_courses" ON courses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_courses" ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_courses" ON courses FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth_read_weeks"   ON course_weeks FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_weeks" ON course_weeks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_weeks" ON course_weeks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_weeks" ON course_weeks FOR DELETE TO authenticated USING (true);

-- ============================================================
-- [FUTURE SCHEMA TEMPLATES] — Design Only, NOT YET ACTIVE
-- ============================================================
-- These schemas are prepared for future LMS modules.
-- Do NOT execute until the corresponding feature is implemented.
-- ============================================================

-- ═══════════════════════════════════════════════════════════════
-- FUTURE: ATTENDANCE MODULE
-- ═══════════════════════════════════════════════════════════════
--
-- CREATE TABLE attendance_records (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   student_id UUID NOT NULL REFERENCES student_registrations(id) ON DELETE CASCADE,
--   course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
--   week_number INTEGER,
--   date DATE NOT NULL,
--   notes TEXT DEFAULT '',
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   UNIQUE(student_id, course_id, date)
-- );
--
-- CREATE INDEX idx_attendance_student ON attendance_records (student_id);
-- CREATE INDEX idx_attendance_course  ON attendance_records (course_id);
-- CREATE INDEX idx_attendance_date    ON attendance_records (date DESC);
--
-- ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
-- -- Policies: authenticated full CRUD

-- ═══════════════════════════════════════════════════════════════
-- FUTURE: CALENDAR / SCHEDULE MODULE
-- ═══════════════════════════════════════════════════════════════
--
-- CREATE TYPE event_type AS ENUM ('class', 'exam', 'workshop', 'holiday', 'meeting');
--
-- CREATE TABLE schedule_events (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   title TEXT NOT NULL,
--   description TEXT DEFAULT '',
--   event_type event_type NOT NULL DEFAULT 'class',
--   start_time TIMESTAMPTZ NOT NULL,
--   end_time TIMESTAMPTZ NOT NULL,
--   location TEXT DEFAULT '',
--   cohort TEXT DEFAULT '',
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   CONSTRAINT valid_time_range CHECK (end_time > start_time)
-- );
--
-- CREATE INDEX idx_schedule_date    ON schedule_events (start_time);
-- CREATE INDEX idx_schedule_course  ON schedule_events (course_id);
-- CREATE INDEX idx_schedule_type    ON schedule_events (event_type);
--
-- ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;
-- -- Policies: authenticated full CRUD

-- ═══════════════════════════════════════════════════════════════
-- FUTURE: ASSIGNMENTS MODULE
-- ═══════════════════════════════════════════════════════════════
--
-- CREATE TABLE assignments (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   title TEXT NOT NULL,
--   description TEXT DEFAULT '',
--   due_date DATE NOT NULL,
--   total_points INTEGER DEFAULT 100,
--   cohort TEXT DEFAULT '',
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
--
-- CREATE TABLE assignment_submissions (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
--   student_id UUID NOT NULL REFERENCES student_registrations(id) ON DELETE CASCADE,
--   submitted_at TIMESTAMPTZ DEFAULT NOW(),
--   file_url TEXT DEFAULT '',
--   score INTEGER,
--   feedback TEXT DEFAULT '',
--   status TEXT NOT NULL DEFAULT 'pending'
--     CHECK (status IN ('pending', 'submitted', 'graded', 'resubmit')),
--   UNIQUE(assignment_id, student_id)
-- );
--
-- CREATE INDEX idx_assignments_course  ON assignments (course_id);
-- CREATE INDEX idx_assignments_due     ON assignments (due_date);
-- CREATE INDEX idx_submissions_assign  ON assignment_submissions (assignment_id);
-- CREATE INDEX idx_submissions_student ON assignment_submissions (student_id);
--
-- ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
-- -- Policies: authenticated full CRUD

-- ============================================================
-- MIGRATION NOTES
-- ============================================================
-- 
-- 2026-06-01: Initial structured schema
--   - Registration module (student_registrations)
--   - Reports module (export_reports)
--   - Future templates (attendance, calendar, assignments)
--
-- ============================================================

-- ============================================================
-- ADMIN USER SETUP
-- ============================================================
-- Create admin user via Supabase Dashboard:
-- 1. Go to Authentication → Users
-- 2. Click "Add user" → enter email + password
-- 3. Admin can log in at /admin/login
-- ============================================================