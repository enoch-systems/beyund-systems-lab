// ============================================================
// Fix states + enroll all 350 students with payments
// Run: node scripts/fix-states-and-enroll.mjs
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

const TUITION_FEE = 150000;

const validNigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory",
];

// Mapping for invalid/typo states → correct Nigerian state
const stateFixMap = {
  "Abia State": "Abia",
  "Central Governorate": "Federal Capital Territory",
  "Abuja": "Federal Capital Territory",
};

function isValidNigerianState(s) {
  if (!s) return false;
  const trimmed = s.trim();
  return validNigerianStates.includes(trimmed);
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function fixState(raw) {
  if (!raw) return pick(validNigerianStates);
  const trimmed = raw.trim();
  if (stateFixMap[trimmed]) return stateFixMap[trimmed];
  if (isValidNigerianState(trimmed)) return trimmed;
  // Unknown → assign random Nigerian state
  return pick(validNigerianStates);
}

async function main() {
  // ── 1. Fetch all students ──
  const { data: students, error: fetchErr } = await supabase
    .from("student_registrations")
    .select("id, full_name, state, status");

  if (fetchErr) { console.error("❌ Failed to fetch:", fetchErr.message); process.exit(1); }
  console.log(`📊 Found ${students.length} students\n`);

  // ── 2. Fix invalid states ──
  const needsStateFix = students.filter((s) => !isValidNigerianState(s.state));
  console.log(`🔧 Students with invalid/missing states: ${needsStateFix.length}`);

  for (const s of needsStateFix) {
    const correct = fixState(s.state);
    const { error } = await supabase
      .from("student_registrations")
      .update({ state: correct })
      .eq("id", s.id);
    if (error) {
      console.error(`   ❌ ${s.full_name} (${s.state || "null"} → ${correct}): ${error.message}`);
    } else {
      console.log(`   ✅ ${s.full_name.padEnd(22)} ${(s.state || "null").padEnd(22)} → ${correct}`);
    }
  }

  // Verify all states are now valid
  const { data: afterFix } = await supabase
    .from("student_registrations")
    .select("state");

  const stillBad = afterFix.filter((s) => !isValidNigerianState(s.state));
  if (stillBad.length > 0) {
    console.log(`\n⚠️  ${stillBad.length} students still have invalid states (shouldn't happen)`);
  } else {
    console.log(`\n✅ All students now have valid Nigerian states`);
  }

  // ── 3. Update all to "enrolled" ──
  console.log(`\n📌 Updating all ${students.length} students to "enrolled"...`);
  const { error: updateErr } = await supabase
    .from("student_registrations")
    .update({ status: "enrolled" })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (updateErr) {
    console.error("❌ Failed to update statuses:", updateErr.message);
    process.exit(1);
  }
  console.log(`✅ All students now enrolled\n`);

  // ── 4. Create payment profiles + transactions ──
  console.log(`💰 Creating payment profiles & transactions for all students...\n`);

  let created = 0;
  let skipped = 0;

  for (const student of students) {
    // Check if payment profile already exists
    const { data: existingProfile } = await supabase
      .from("student_payment_profiles")
      .select("id")
      .eq("student_id", student.id)
      .single();

    if (existingProfile) {
      skipped++;
      continue;
    }

    // Spread payments across last 90 days
    const payDate = new Date();
    const daysAgo = Math.floor(Math.random() * 60) + 1; // 1–60 days ago
    payDate.setDate(payDate.getDate() - daysAgo);
    payDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);

    const ref = `PAY-${student.id.slice(0, 6).toUpperCase()}-${payDate.getTime()}`;

    // Insert payment profile
    const { error: ppErr } = await supabase.from("student_payment_profiles").insert({
      student_id: student.id,
      total_fee: TUITION_FEE,
      amount_paid: TUITION_FEE,
      payment_status: "paid",
      updated_at: payDate.toISOString(),
    });
    if (ppErr) {
      console.error(`   ❌ Profile error for ${student.full_name}: ${ppErr.message}`);
      continue;
    }

    // Insert transaction
    const { error: txErr } = await supabase.from("payments").insert({
      student_id: student.id,
      amount: TUITION_FEE,
      payment_method: pick(["transfer", "card", "pos", "cash", "ussd"]),
      reference: ref,
      notes: `Full Stack Development tuition - ${payDate.toLocaleDateString("en-NG")}`,
      created_at: payDate.toISOString(),
    });
    if (txErr) {
      console.error(`   ❌ Transaction error for ${student.full_name}: ${txErr.message}`);
      continue;
    }

    created++;
    if (created % 20 === 0 || created === students.length - skipped) {
      console.log(`   💰 ${created} payment profiles created...`);
    }
  }

  // ── 5. Final verification ──
  const { count: totalCount } = await supabase
    .from("student_registrations")
    .select("*", { count: "exact", head: true });

  const { count: enrolledCount } = await supabase
    .from("student_registrations")
    .select("*", { count: "exact", head: true })
    .eq("status", "enrolled");

  const { count: profileCount } = await supabase
    .from("student_payment_profiles")
    .select("*", { count: "exact", head: true });

  console.log(`\n🎉 Done!`);
  console.log(`📊 Total students: ${totalCount}`);
  console.log(`📊 Enrolled: ${enrolledCount}`);
  console.log(`📊 Payment profiles: ${profileCount}`);
  console.log(`💰 New profiles created: ${created}`);
  console.log(`⏭️  Already existed: ${skipped}`);

  // State distribution summary
  const { data: stateData } = await supabase
    .from("student_registrations")
    .select("state");

  const stateCounts = {};
  for (const s of stateData) {
    stateCounts[s.state] = (stateCounts[s.state] || 0) + 1;
  }
  console.log("\n📊 Final state distribution:");
  const sorted = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]);
  for (const [state, count] of sorted) {
    console.log(`   ${state.padEnd(28)} ${count}`);
  }
}

main().catch((err) => { console.error("❌ Error:", err.message); process.exit(1); });