-- ============================================================
-- Payments Module for Beyond Academy
-- Run this entire block in your Supabase SQL Editor
-- Creates payment tables without affecting existing data
-- ============================================================

-- ============================================================
-- 1. STUDENT PAYMENT PROFILES
-- Tracks each student's overall tuition status
-- ============================================================

CREATE TABLE IF NOT EXISTS student_payment_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES student_registrations(id) ON DELETE CASCADE,
  total_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
  balance NUMERIC(12, 2) GENERATED ALWAYS AS (total_fee - amount_paid) STORED,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('paid', 'pending', 'installment')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id)
);

-- ============================================================
-- 2. PAYMENT TRANSACTIONS
-- Records every individual payment made
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES student_registrations(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL DEFAULT 'cash'
    CHECK (payment_method IN ('cash', 'transfer', 'card', 'pos', 'ussd', 'other')),
  reference TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. DEFAULT TUITION FEES PER COURSE
-- ============================================================

CREATE TABLE IF NOT EXISTS course_tuition (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL UNIQUE,
  fee NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default fees (safe to re-run)
INSERT INTO course_tuition (course_name, fee) VALUES
  ('Introduction to Programming', 150000),
  ('Full Stack Fundamentals', 200000),
  ('React & Next.js', 180000),
  ('Database Design', 150000),
  ('API Development', 180000),
  ('Deployment & DevOps', 150000)
ON CONFLICT (course_name) DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_payments_student ON payments (student_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_profiles_status ON student_payment_profiles (payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_profiles_student ON student_payment_profiles (student_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE student_payment_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tuition ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "Allow authenticated read payment_profiles" ON student_payment_profiles;
DROP POLICY IF EXISTS "Allow authenticated insert payment_profiles" ON student_payment_profiles;
DROP POLICY IF EXISTS "Allow authenticated update payment_profiles" ON student_payment_profiles;
DROP POLICY IF EXISTS "Allow authenticated delete payment_profiles" ON student_payment_profiles;

DROP POLICY IF EXISTS "Allow authenticated read payments" ON payments;
DROP POLICY IF EXISTS "Allow authenticated insert payments" ON payments;
DROP POLICY IF EXISTS "Allow authenticated update payments" ON payments;
DROP POLICY IF EXISTS "Allow authenticated delete payments" ON payments;

DROP POLICY IF EXISTS "Allow authenticated read tuition" ON course_tuition;
DROP POLICY IF EXISTS "Allow authenticated insert tuition" ON course_tuition;
DROP POLICY IF EXISTS "Allow authenticated update tuition" ON course_tuition;

-- Create policies
CREATE POLICY "Allow authenticated read payment_profiles" ON student_payment_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert payment_profiles" ON student_payment_profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update payment_profiles" ON student_payment_profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete payment_profiles" ON student_payment_profiles FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read payments" ON payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert payments" ON payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update payments" ON payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete payments" ON payments FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read tuition" ON course_tuition FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert tuition" ON course_tuition FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update tuition" ON course_tuition FOR UPDATE TO authenticated USING (true) WITH CHECK (true);