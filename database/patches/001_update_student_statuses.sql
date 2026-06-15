-- ============================================================
-- Patch: Update Student Registration Statuses
-- Changes: pending, contacted, enrolled, rejected 
--       →  pending, enrolled, restricted
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Drop the old check constraint on student_registrations
ALTER TABLE public.student_registrations 
  DROP CONSTRAINT IF EXISTS student_registrations_status_check;

-- 2. Add the new check constraint with only 3 statuses
ALTER TABLE public.student_registrations 
  ADD CONSTRAINT student_registrations_status_check 
  CHECK (status IN ('pending', 'enrolled', 'restricted'));

-- 3. Update any existing 'contacted' records to 'pending'
UPDATE public.student_registrations 
  SET status = 'pending' 
  WHERE status = 'contacted';

-- 4. Update any existing 'rejected' records to 'restricted'
UPDATE public.student_registrations 
  SET status = 'restricted' 
  WHERE status = 'rejected';

-- ============================================================
-- END OF PATCH
-- ============================================================