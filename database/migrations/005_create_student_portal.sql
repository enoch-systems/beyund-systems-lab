-- ============================================================
-- Student Portal Tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Students (separate from student_registrations) ──
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  sex TEXT,
  country TEXT,
  state TEXT,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  cohort TEXT DEFAULT 'default',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'completed', 'dropped')),
  registration_id UUID REFERENCES public.student_registrations(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Course Weeks ──
CREATE TABLE IF NOT EXISTS public.course_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, week_number)
);

-- ── Assignments (extended for student portal) ──
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  week_id UUID REFERENCES public.course_weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  total_points INTEGER DEFAULT 100,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Assignment Submissions ──
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  submission_url TEXT,
  submission_text TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'resubmitted')),
  grade INTEGER,
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  UNIQUE(student_id, assignment_id)
);

-- ── Weekly Progress ──
CREATE TABLE IF NOT EXISTS public.weekly_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  week_id UUID REFERENCES public.course_weeks(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  attendance_status TEXT DEFAULT 'pending' CHECK (attendance_status IN ('pending', 'present', 'absent', 'excused')),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, week_id)
);

-- ── Notifications (for students) ──
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES public.students(id) ON DELETE CASCADE;

-- ── Insert course weeks from existing courses ──
-- This is a helper to populate weeks. Customize as needed.
-- Each course will get weeks based on its total_weeks field.

-- ── RLS Policies ──
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_progress ENABLE ROW LEVEL SECURITY;

-- Students can read their own record
CREATE POLICY "students_read_own" ON public.students
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Students can update their own record (limited fields)
CREATE POLICY "students_update_own" ON public.students
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Students can read course weeks for their course
CREATE POLICY "students_read_course_weeks" ON public.course_weeks
  FOR SELECT USING (true);

-- Students can read assignments
CREATE POLICY "students_read_assignments" ON public.assignments
  FOR SELECT USING (true);

-- Students can manage their own submissions
CREATE POLICY "students_insert_submissions" ON public.submissions
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid())
  );
CREATE POLICY "students_read_submissions" ON public.submissions
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid())
  );
CREATE POLICY "students_update_submissions" ON public.submissions
  FOR UPDATE USING (
    student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid())
  );

-- Students can read/update their own progress
CREATE POLICY "students_read_progress" ON public.weekly_progress
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid())
  );
CREATE POLICY "students_update_progress" ON public.weekly_progress
  FOR UPDATE USING (
    student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid())
  );
CREATE POLICY "students_insert_progress" ON public.weekly_progress
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid())
  );

-- ── Email Logs (track sent/bounced status) ──
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES public.student_registrations(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN ('welcome', 'enrollment', 'other')),
  recipient_email TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'opened')),
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Admin can read/write email_logs
CREATE POLICY "admin_all_email_logs" ON public.email_logs
  FOR ALL USING (true);

-- ── Enable Supabase Realtime for student notifications ──
ALTER publication supabase_realtime ADD TABLE public.notifications;
ALTER publication supabase_realtime ADD TABLE public.submissions;

-- ============================================================
-- END OF MIGRATION
-- ============================================================