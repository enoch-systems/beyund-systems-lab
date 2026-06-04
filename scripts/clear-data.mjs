import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xwjrlxrsmeryozvystwa.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3anJseHJzbWVyeW96dnlzdHdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE5MTE0OCwiZXhwIjoyMDk1NzY3MTQ4fQ.TZvP9TLIJK-0fapOLurENN5hRY9yNW3NtjaFhgpWtqo";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function clearAll() {
  // Delete in order of FK dependencies (children first)
  const tables = [
    "notification_seen",
    "announcements",
    "notifications",
    "course_weeks",
    "courses",
    "payments",
    "student_payment_profiles",
    "course_tuition",
    "export_reports",
    "student_registrations",
    "saved_sql_scripts",
    "admin_settings",
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      console.log(`✗ ${table}: ${error.message}`);
    } else {
      console.log(`✓ ${table} cleared`);
    }
  }

  console.log("\nDone! All tables cleared.");
}

clearAll();