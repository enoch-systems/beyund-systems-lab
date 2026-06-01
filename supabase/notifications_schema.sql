-- ============================================================
-- Notifications Module for Beyond Academy
-- Run this entire block in your Supabase SQL Editor
-- Creates notification tables without affecting existing data
-- ============================================================

-- ============================================================
-- 1. NOTIFICATIONS TABLE
-- Stores all system-generated notifications from student
-- registrations, payments, academic updates, etc.
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'system'
    CHECK (category IN ('student', 'academic', 'payment', 'system', 'announcement')),
  status TEXT NOT NULL DEFAULT 'unread'
    CHECK (status IN ('unread', 'read')),
  student_id UUID REFERENCES student_registrations(id) ON DELETE SET NULL,
  link TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ANNOUNCEMENTS TABLE
-- Admin-published announcements that appear in the feed
-- ============================================================

CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. NOTIFICATION SEEN TRACKING
-- Tracks which admins have seen/dismissed notifications
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_seen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seen_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notification_id, user_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications (category);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications (status);
CREATE INDEX IF NOT EXISTS idx_notifications_student ON notifications (student_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements (created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_seen ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "Allow authenticated read notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated insert notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated update notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated delete notifications" ON notifications;

DROP POLICY IF EXISTS "Allow authenticated read announcements" ON announcements;
DROP POLICY IF EXISTS "Allow authenticated insert announcements" ON announcements;
DROP POLICY IF EXISTS "Allow authenticated delete announcements" ON announcements;

DROP POLICY IF EXISTS "Allow authenticated read seen" ON notification_seen;
DROP POLICY IF EXISTS "Allow authenticated insert seen" ON notification_seen;
DROP POLICY IF EXISTS "Allow authenticated update seen" ON notification_seen;

-- Notifications policies
CREATE POLICY "Allow authenticated read notifications" ON notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update notifications" ON notifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete notifications" ON notifications FOR DELETE TO authenticated USING (true);

-- Announcements policies
CREATE POLICY "Allow authenticated read announcements" ON announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated delete announcements" ON announcements FOR DELETE TO authenticated USING (true);

-- Seen tracking policies
CREATE POLICY "Allow authenticated read seen" ON notification_seen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert seen" ON notification_seen FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update seen" ON notification_seen FOR UPDATE TO authenticated USING (true) WITH CHECK (true);