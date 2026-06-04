// ============================================================
// Seed Script: Students (all Full Stack) + Payments + Transactions
// ============================================================
// Run: node scripts/seed-students.mjs
// ============================================================

const { createClient } = await import("@supabase/supabase-js");
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

let supabaseUrl, serviceRoleKey;
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const t = line.trim();
    if (t.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) supabaseUrl = t.split("=").slice(1).join("=");
    if (t.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) serviceRoleKey = t.split("=").slice(1).join("=");
  }
} catch (err) {
  console.error("❌ Could not read .env.local"); process.exit(1);
}
if (!supabaseUrl || !serviceRoleKey) { console.error("❌ Missing env vars"); process.exit(1); }

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Only Full Stack Development ──
const course = "Full Stack Development";
const TUITION_FEE = 150000;

// ── All 37 Nigerian States ──
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory",
];

const sexes = ["Male", "Female"];
const employmentStatuses = ["Employed", "Unemployed", "Student", "Self-employed", "Freelancer"];
const laptopOptions = ["Yes", "No"];
const heardAboutOptions = ["Instagram", "Facebook", "WhatsApp", "Twitter/X", "LinkedIn", "Friend/Family", "Google Search", "YouTube", "TikTok"];
const learningReasons = [
  "I want to switch careers into tech",
  "I want to upskill for my current job",
  "I want to start my own tech business",
  "I'm a student looking to gain practical skills",
  "I want to build my own projects",
  "I want to get a remote job",
  "I want to earn money freelancing",
  "I'm passionate about technology and learning",
];
const firstNames = [
  "Chidi", "Amara", "Oluwaseun", "Fatima", "Kwame", "Zuri", "Tunde", "Ngozi",
  "Kofi", "Aisha", "Emeka", "Akua", "Babatunde", "Makena", "Yusuf", "Chioma",
  "Jide", "Esi", "Damilola", "Nadia", "Abubakar", "Wanjiku", "Ifeanyi", "Nneka",
  "Suleiman", "Adaeze", "Kelechi",
];
const lastNames = [
  "Okonkwo", "Adebayo", "Osei", "Mensah", "Kamau", "Okafor", "Otieno",
  "Nwachukwu", "Asante", "Abdi", "Eze", "Boateng", "Ogunlade", "Njeri",
  "Hassan", "Diallo", "Obinna", "Quartey", "Akinlade", "Mwangi",
  "Bello", "Coker", "Oduya", "Eke", "Mohammed", "Igwe", "Akinyemi",
];
const domains = ["gmail.com", "yahoo.com", "outlook.com", "protonmail.com", "icloud.com", "hotmail.com"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateStudents(count) {
  const students = [];
  const usedEmails = new Set();
  for (let i = 0; i < count; i++) {
    const first = pick(firstNames);
    const last = pick(lastNames);
    const fullName = `${first} ${last}`;
    const emailLocal = `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(Math.random() * 100)}`;
    const email = `${emailLocal}@${pick(domains)}`;
    if (usedEmails.has(email)) { i--; continue; }
    usedEmails.add(email);

    const state = pick(nigerianStates);
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - daysAgo);
    createdDate.setHours(createdDate.getHours() - hoursAgo);

    students.push({
      full_name: fullName,
      email,
      phone_whatsapp: `+234${Math.floor(700000000 + Math.random() * 299999999)}`,
      sex: pick(sexes),
      country: "Nigeria",
      state,
      course_applying_for: course,
      employment_status: pick(employmentStatuses),
      has_laptop: pick(laptopOptions),
      heard_about_us: pick(heardAboutOptions),
      learning_reason: pick(learningReasons),
      status: "pending",
      created_at: createdDate.toISOString(),
    });
  }
  return students;
}

async function seed() {
  console.log("🚀 Seeding 35 students (all Full Stack Development, 11 enrolled with payments)...\n");

  // Clear everything
  await supabase.from("payments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("student_payment_profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("student_registrations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  console.log("🧹 Cleared existing records\n");

  // Generate & insert students
  const students = generateStudents(35);
  const { data: insertedStudents, error: insErr } = await supabase.from("student_registrations").insert(students).select("id, full_name, status");
  if (insErr) { console.error("❌ Insert failed:", insErr.message); process.exit(1); }
  console.log(`✅ Inserted ${insertedStudents.length} students\n`);

  // Pick 11 to enroll
  const enrolled = insertedStudents.slice(0, 11);
  const pending = insertedStudents.slice(11);
  for (const s of enrolled) {
    await supabase.from("student_registrations").update({ status: "enrolled" }).eq("id", s.id);
  }
  console.log(`📌 Enrolled ${enrolled.length} students\n`);

  // Create payment profiles + transactions for enrolled students
  // Spread over 4 days: 3, 4, 2, 2
  const paidCounts = [3, 4, 2, 2];
  let payIdx = 0;
  for (let dayOffset = 4; dayOffset >= 1; dayOffset--) {
    const count = paidCounts[4 - dayOffset];
    for (let j = 0; j < count && payIdx < enrolled.length; j++) {
      const student = enrolled[payIdx];
      const payDate = new Date();
      payDate.setDate(payDate.getDate() - dayOffset);
      payDate.setHours(10 + j, 0, 0, 0);

      // Create payment profile
      const { error: ppErr } = await supabase.from("student_payment_profiles").insert({
        student_id: student.id,
        total_fee: TUITION_FEE,
        amount_paid: TUITION_FEE,
        payment_status: "paid",
        updated_at: payDate.toISOString(),
      });
      if (ppErr) { console.error(`❌ Payment profile error for ${student.full_name}:`, ppErr.message); continue; }

      // Create payment transaction
      const { error: txErr } = await supabase.from("payments").insert({
        student_id: student.id,
        amount: TUITION_FEE,
        payment_method: pick(["transfer", "card", "pos", "cash", "ussd"]),
        reference: `PAY-${student.id.slice(0, 6).toUpperCase()}-${payDate.getTime()}`,
        notes: `Full Stack Development tuition - ${payDate.toLocaleDateString("en-NG")}`,
        created_at: payDate.toISOString(),
      });
      if (txErr) { console.error(`❌ Transaction error for ${student.full_name}:`, txErr.message); continue; }

      console.log(`   💰 ${student.full_name} — ₦${TUITION_FEE.toLocaleString()} paid on ${payDate.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })}`);
      payIdx++;
    }
  }

  console.log(`\n🎉 Done! ${enrolled.length} enrolled students with payments totaling ₦${(enrolled.length * TUITION_FEE).toLocaleString()}`);
  console.log(`📊 ${pending.length} pending students (no payments)`);

  // Verify totals
  const { count: totalCount } = await supabase.from("student_registrations").select("*", { count: "exact", head: true });
  const { count: enrolledCount } = await supabase.from("student_registrations").select("*", { count: "exact", head: true }).eq("status", "enrolled");
  const { count: profileCount } = await supabase.from("student_payment_profiles").select("*", { count: "exact", head: true });
  console.log(`\n📊 Verifications: ${totalCount} students, ${enrolledCount} enrolled, ${profileCount} payment profiles`);
}

seed().catch((err) => { console.error("❌ Error:", err.message); process.exit(1); });