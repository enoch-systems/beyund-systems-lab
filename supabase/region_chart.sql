-- ============================================================
-- Beyund Systems Labs — Enrollment by Region (Top 5 states)
-- Dashboard chart reads (country + state) from student_registrations.
-- This script:
--   1) Ensures the `state` column exists + is indexed.
--   2) Backfills any existing state codes (e.g. "NG-AB") to the
--      full state name (e.g. "Abia") so the chart is readable.
--   3) Optionally seeds sample enrolled registrations across
--      5 countries so the chart has something to show on a fresh DB.
-- Run this in your Supabase SQL Editor.
-- ============================================================

-- 1) Ensure the `state` column exists.
ALTER TABLE student_registrations
  ADD COLUMN IF NOT EXISTS state TEXT;

-- 2) Add an index on (country, state) for fast "Top 5 states" aggregation.
CREATE INDEX IF NOT EXISTS idx_registrations_country_state
  ON student_registrations (country, state);

-- ============================================================
-- 3) BACKFILL: convert any stored state code (e.g. "NG-AB") to the
--    full state name (e.g. "Abia") for Nigeria, US, UK, Canada, Ghana.
--    This uses a CASE expression so it's a single, fast UPDATE.
--    Safe to re-run: it only touches rows that currently store a
--    recognizable code.
-- ============================================================

-- Nigeria (ISO: NG)
UPDATE student_registrations SET state = CASE state
  WHEN 'NG-AB' THEN 'Abia'
  WHEN 'NG-AD' THEN 'Adamawa'
  WHEN 'NG-AK' THEN 'Akwa Itbom'
  WHEN 'NG-AN' THEN 'Anambra'
  WHEN 'NG-BA' THEN 'Bauchi'
  WHEN 'NG-BY' THEN 'Bayelsa'
  WHEN 'NG-BE' THEN 'Benue'
  WHEN 'NG-BO' THEN 'Borno'
  WHEN 'NG-CR' THEN 'Cross River'
  WHEN 'NG-DE' THEN 'Delta'
  WHEN 'NG-EB' THEN 'Ebonyi'
  WHEN 'NG-ED' THEN 'Edo'
  WHEN 'NG-EK' THEN 'Ekiti'
  WHEN 'NG-EN' THEN 'Enugu'
  WHEN 'NG-GO' THEN 'Gombe'
  WHEN 'NG-IM' THEN 'Imo'
  WHEN 'NG-JI' THEN 'Jigawa'
  WHEN 'NG-KD' THEN 'Kaduna'
  WHEN 'NG-KN' THEN 'Kano'
  WHEN 'NG-KT' THEN 'Katsina'
  WHEN 'NG-KE' THEN 'Kebbi'
  WHEN 'NG-KO' THEN 'Kogi'
  WHEN 'NG-KW' THEN 'Kwara'
  WHEN 'NG-LA' THEN 'Lagos'
  WHEN 'NG-NA' THEN 'Nasarawa'
  WHEN 'NG-NI' THEN 'Niger'
  WHEN 'NG-OG' THEN 'Ogun'
  WHEN 'NG-ON' THEN 'Ondo'
  WHEN 'NG-OS' THEN 'Osun'
  WHEN 'NG-OY' THEN 'Oyo'
  WHEN 'NG-PL' THEN 'Plateau'
  WHEN 'NG-RI' THEN 'Rivers'
  WHEN 'NG-SO' THEN 'Sokoto'
  WHEN 'NG-TA' THEN 'Taraba'
  WHEN 'NG-YO' THEN 'Yobe'
  WHEN 'NG-ZA' THEN 'Zamfara'
  WHEN 'NG-FC' THEN 'Federal Capital Territory'
  ELSE state
END
WHERE country = 'Nigeria'
  AND state LIKE 'NG-%';

-- United States (ISO: US)
UPDATE student_registrations SET state = CASE state
  WHEN 'US-AL' THEN 'Alabama'        WHEN 'US-AK' THEN 'Alaska'
  WHEN 'US-AZ' THEN 'Arizona'        WHEN 'US-AR' THEN 'Arkansas'
  WHEN 'US-CA' THEN 'California'     WHEN 'US-CO' THEN 'Colorado'
  WHEN 'US-CT' THEN 'Connecticut'    WHEN 'US-DE' THEN 'Delaware'
  WHEN 'US-FL' THEN 'Florida'        WHEN 'US-GA' THEN 'Georgia'
  WHEN 'US-HI' THEN 'Hawaii'         WHEN 'US-ID' THEN 'Idaho'
  WHEN 'US-IL' THEN 'Illinois'       WHEN 'US-IN' THEN 'Indiana'
  WHEN 'US-IA' THEN 'Iowa'           WHEN 'US-KS' THEN 'Kansas'
  WHEN 'US-KY' THEN 'Kentucky'       WHEN 'US-LA' THEN 'Louisiana'
  WHEN 'US-ME' THEN 'Maine'          WHEN 'US-MD' THEN 'Maryland'
  WHEN 'US-MA' THEN 'Massachusetts'  WHEN 'US-MI' THEN 'Michigan'
  WHEN 'US-MN' THEN 'Minnesota'      WHEN 'US-MS' THEN 'Mississippi'
  WHEN 'US-MO' THEN 'Missouri'       WHEN 'US-MT' THEN 'Montana'
  WHEN 'US-NE' THEN 'Nebraska'       WHEN 'US-NV' THEN 'Nevada'
  WHEN 'US-NH' THEN 'New Hampshire'  WHEN 'US-NJ' THEN 'New Jersey'
  WHEN 'US-NM' THEN 'New Mexico'     WHEN 'US-NY' THEN 'New York'
  WHEN 'US-NC' THEN 'North Carolina' WHEN 'US-ND' THEN 'North Dakota'
  WHEN 'US-OH' THEN 'Ohio'           WHEN 'US-OK' THEN 'Oklahoma'
  WHEN 'US-OR' THEN 'Oregon'         WHEN 'US-PA' THEN 'Pennsylvania'
  WHEN 'US-RI' THEN 'Rhode Island'   WHEN 'US-SC' THEN 'South Carolina'
  WHEN 'US-SD' THEN 'South Dakota'   WHEN 'US-TN' THEN 'Tennessee'
  WHEN 'US-TX' THEN 'Texas'          WHEN 'US-UT' THEN 'Utah'
  WHEN 'US-VT' THEN 'Vermont'        WHEN 'US-VA' THEN 'Virginia'
  WHEN 'US-WA' THEN 'Washington'     WHEN 'US-WV' THEN 'West Virginia'
  WHEN 'US-WI' THEN 'Wisconsin'      WHEN 'US-WY' THEN 'Wyoming'
  ELSE state
END
WHERE country = 'United States'
  AND state LIKE 'US-%';

-- United Kingdom (ISO: GB)
UPDATE student_registrations SET state = CASE state
  WHEN 'GB-ENG' THEN 'England'
  WHEN 'GB-SCT' THEN 'Scotland'
  WHEN 'GB-WLS' THEN 'Wales'
  WHEN 'GB-NIR' THEN 'Northern Ireland'
  ELSE state
END
WHERE country = 'United Kingdom'
  AND state LIKE 'GB-%';

-- Canada (ISO: CA)
UPDATE student_registrations SET state = CASE state
  WHEN 'CA-ON' THEN 'Ontario'
  WHEN 'CA-QC' THEN 'Quebec'
  WHEN 'CA-BC' THEN 'British Columbia'
  WHEN 'CA-AB' THEN 'Alberta'
  WHEN 'CA-MB' THEN 'Manitoba'
  WHEN 'CA-SK' THEN 'Saskatchewan'
  WHEN 'CA-NS' THEN 'Nova Scotia'
  WHEN 'CA-NB' THEN 'New Brunswick'
  WHEN 'CA-NL' THEN 'Newfoundland and Labrador'
  WHEN 'CA-PE' THEN 'Prince Edward Island'
  ELSE state
END
WHERE country = 'Canada'
  AND state LIKE 'CA-%';

-- Ghana (ISO: GH)
UPDATE student_registrations SET state = CASE state
  WHEN 'GH-AA' THEN 'Greater Accra'
  WHEN 'GH-AH' THEN 'Ashanti'
  WHEN 'GH-WP' THEN 'Western'
  WHEN 'GH-CP' THEN 'Central'
  WHEN 'GH-TV' THEN 'Volta'
  WHEN 'GH-BA' THEN 'Brong-Ahafo'
  WHEN 'GH-UE' THEN 'Upper East'
  WHEN 'GH-UW' THEN 'Upper West'
  WHEN 'GH-NO' THEN 'Northern'
  ELSE state
END
WHERE country = 'Ghana'
  AND state LIKE 'GH-%';

-- ============================================================
-- 4) Optional seed: 21 sample enrolled students across 5 countries
--    so the "Top 5 states" chart has data to render. Safe to re-run.
-- ============================================================
INSERT INTO student_registrations
  (full_name, email, phone_whatsapp, sex, country, state,
   course_applying_for, employment_status, has_laptop, heard_about_us,
   learning_reason, status)
SELECT * FROM (VALUES
  -- 🇳🇬 Nigeria
  ('Chinedu Okafor',  'chinedu.okafor@example.com',  '+2348010000001', 'Male',   'Nigeria', 'Lagos',         'Full Stack Fundamentals', 'Employed',   'Yes', 'Twitter',    'Career growth',  'enrolled'),
  ('Aisha Bello',     'aisha.bello@example.com',     '+2348010000002', 'Female', 'Nigeria', 'Lagos',         'Full Stack Fundamentals', 'Student',     'Yes', 'Instagram',  'Career growth',  'enrolled'),
  ('Tunde Adeyemi',   'tunde.adeyemi@example.com',   '+2348010000003', 'Male',   'Nigeria', 'Lagos',         'React & Next.js',         'Employed',   'Yes', 'LinkedIn',   'Career growth',  'enrolled'),
  ('Funmi Lawal',     'funmi.lawal@example.com',     '+2348010000004', 'Female', 'Nigeria', 'Oyo',           'Full Stack Fundamentals', 'Self-employed','No', 'Friend',     'Build a startup','enrolled'),
  ('Emeka Eze',       'emeka.eze@example.com',       '+2348010000005', 'Male',   'Nigeria', 'Enugu',         'API Development',         'Unemployed',  'Yes', 'Facebook',   'Career growth',  'enrolled'),
  ('Bisi Oladimeji',  'bisi.oladimeji@example.com',  '+2348010000006', 'Female', 'Nigeria', 'Abuja',         'Database Design',         'Employed',   'Yes', 'Twitter',    'Career growth',  'enrolled'),
  ('Kelechi Nwosu',   'kelechi.nwosu@example.com',   '+2348010000007', 'Male',   'Nigeria', 'Rivers',        'Deployment & DevOps',    'Employed',   'Yes', 'LinkedIn',   'Career growth',  'enrolled'),
  ('Yemisi Akinola',  'yemisi.akinola@example.com',  '+2348010000008', 'Female', 'Nigeria', 'Kano',          'Introduction to Programming','Student', 'No', 'Instagram',  'Curiosity',      'enrolled'),
  ('Ifeanyi Igwe',    'ifeanyi.igwe@example.com',    '+2348010000009', 'Male',   'Nigeria', 'Abia',          'Full Stack Fundamentals', 'Self-employed','Yes', 'Twitter',   'Career growth',  'enrolled'),
  ('Ngozi Umeh',      'ngozi.umeh@example.com',      '+2348010000010', 'Female', 'Nigeria', 'Anambra',       'React & Next.js',         'Employed',   'Yes', 'LinkedIn',   'Career growth',  'enrolled'),
  -- 🇺🇸 United States
  ('Olivia Carter',   'olivia.carter@example.com',   '+12025550001',  'Female', 'United States', 'California', 'Full Stack Fundamentals', 'Employed',   'Yes', 'Google',     'Career growth',  'enrolled'),
  ('Liam Walker',     'liam.walker@example.com',     '+12025550002',  'Male',   'United States', 'New York',    'React & Next.js',         'Employed',   'Yes', 'YouTube',    'Career growth',  'enrolled'),
  ('Ava Mitchell',    'ava.mitchell@example.com',    '+12025550003',  'Female', 'United States', 'Texas',       'Database Design',         'Student',    'Yes', 'Friend',     'Build a project','enrolled'),
  ('Noah Bennett',    'noah.bennett@example.com',    '+12025550004',  'Male',   'United States', 'Florida',     'API Development',         'Employed',   'Yes', 'Twitter',    'Career growth',  'enrolled'),
  ('Sophia Reed',     'sophia.reed@example.com',     '+12025550005',  'Female', 'United States', 'Illinois',    'Deployment & DevOps',     'Employed',   'Yes', 'LinkedIn',   'Career growth',  'enrolled'),
  -- 🇬🇧 United Kingdom
  ('James Whitaker',  'james.whitaker@example.com',  '+447700900001', 'Male',   'United Kingdom', 'England',    'Full Stack Fundamentals', 'Employed',   'Yes', 'LinkedIn',   'Career growth',  'enrolled'),
  ('Emily Hart',      'emily.hart@example.com',      '+447700900002', 'Female', 'United Kingdom', 'Scotland',  'React & Next.js',         'Employed',   'Yes', 'Twitter',    'Career growth',  'enrolled'),
  -- 🇨🇦 Canada
  ('Lucas Tremblay',  'lucas.tremblay@example.com',  '+14165550001',  'Male',   'Canada', 'Ontario',                       'Full Stack Fundamentals', 'Employed',   'Yes', 'Friend',     'Career growth',  'enrolled'),
  ('Mia Patel',       'mia.patel@example.com',       '+14165550002',  'Female', 'Canada', 'Quebec',                        'API Development',         'Employed',   'Yes', 'LinkedIn',   'Career growth',  'enrolled'),
  -- 🇬🇭 Ghana
  ('Kwame Mensah',    'kwame.mensah@example.com',    '+23380100001',  'Male',   'Ghana',  'Greater Accra',                  'Full Stack Fundamentals', 'Employed',   'Yes', 'Twitter',    'Career growth',  'enrolled'),
  ('Akosua Boateng',  'akosua.boateng@example.com',  '+23380100002',  'Female', 'Ghana',  'Ashanti',                        'React & Next.js',         'Student',    'No',  'Instagram',  'Career growth',  'enrolled')
) AS s(full_name, email, phone_whatsapp, sex, country, state,
        course_applying_for, employment_status, has_laptop, heard_about_us,
        learning_reason, status)
WHERE NOT EXISTS (
  SELECT 1 FROM student_registrations r WHERE r.email = s.email
);

-- ============================================================
-- 5) Sanity check: what the chart will read
-- ============================================================
SELECT
  country,
  state,
  COUNT(*) AS enrolled_count
FROM student_registrations
WHERE status = 'enrolled'
GROUP BY country, state
ORDER BY enrolled_count DESC
LIMIT 10;
