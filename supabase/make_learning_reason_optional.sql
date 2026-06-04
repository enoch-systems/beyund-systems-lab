-- ============================================================
-- Make learning_reason column optional in student_registrations
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Allow NULL values for learning_reason
ALTER TABLE student_registrations
  ALTER COLUMN learning_reason DROP NOT NULL;

-- Update existing empty-string rows to NULL for cleanliness
UPDATE student_registrations
  SET learning_reason = NULL
  WHERE learning_reason = '';

-- Verify
SELECT
  column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'student_registrations' AND column_name = 'learning_reason';