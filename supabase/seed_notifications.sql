-- ============================================================
-- Seed Notifications for Existing Student Registrations
-- Run this in your Supabase SQL Editor to create notifications
-- for all existing student registrations that don't have one yet.
-- ============================================================

-- Create notifications for existing student registrations that don't have one
INSERT INTO notifications (title, message, category, status, student_id, link, created_at)
SELECT
  'New Student Registration',
  full_name || ' registered for ' || course_applying_for,
  'student',
  'unread',
  id,
  '/admin/students',
  created_at
FROM student_registrations sr
WHERE NOT EXISTS (
  SELECT 1 FROM notifications n WHERE n.student_id = sr.id AND n.category = 'student'
)
ORDER BY sr.created_at ASC;

-- Show result
SELECT COUNT(*) AS notifications_created FROM notifications WHERE category = 'student';