-- ============================================================
-- Add admin RLS policy for students table
-- Allows authenticated users (admin) to read all students
-- ============================================================

-- Drop old restrictive policy
DROP POLICY IF EXISTS "students_read_own" ON public.students;
DROP POLICY IF EXISTS "students_update_own" ON public.students;

-- Students can read their own record
CREATE POLICY "students_read_own" ON public.students
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Admin (authenticated) can read ALL students
CREATE POLICY "admin_read_all_students" ON public.students
  FOR SELECT TO authenticated USING (true);

-- Admin can insert/update/delete students
CREATE POLICY "admin_manage_students" ON public.students
  FOR ALL TO authenticated USING (true);

-- ============================================================
-- Also fix student_registrations status check constraint
-- ============================================================

-- Update status constraint to only allow: pending, enrolled, restricted
ALTER TABLE public.student_registrations 
  DROP CONSTRAINT IF EXISTS student_registrations_status_check;

ALTER TABLE public.student_registrations
  ADD CONSTRAINT student_registrations_status_check
  CHECK (status IN ('pending', 'enrolled', 'restricted'));

-- Migrate any old statuses
UPDATE public.student_registrations SET status = 'restricted' WHERE status = 'rejected';
UPDATE public.student_registrations SET status = 'restricted' WHERE status = 'contacted';
UPDATE public.student_registrations SET status = 'pending' WHERE status NOT IN ('pending', 'enrolled', 'restricted');