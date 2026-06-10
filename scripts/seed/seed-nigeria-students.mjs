// ============================================================
// Seed Script: Add 322 Nigerian students (total → 350)
// Run: node scripts/seed-nigeria-students.mjs
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

// ── Data ──
const courses = ["Full Stack Development", "Data Science & AI", "Cybersecurity", "DevOps Engineering", "Cloud Computing", "Product Design (UI/UX)", "Mobile App Development"];
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory",
];
const nigerianCities = {
  "Lagos": ["Ikeja", "Victoria Island", "Lekki", "Surulere", "Yaba", "Ikoyi", "Ajah", "Badagry"],
  "Abia": ["Umuahia", "Aba", "Ohafia", "Arochukwu"],
  "Adamawa": ["Yola", "Mubi", "Numan", "Jimeta"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Oron"],
  "Anambra": ["Awka", "Onitsha", "Nnewi", "Ekwnlato"],
  "Bauchi": ["Bauchi", "Azare", "Misau", "Jama'are"],
  "Bayelsa": ["Yenagoa", "Brass", "Ogbia", "Sagbama"],
  "Benue": ["Makurdi", "Gboko", "Otukpo", "Vandekya"],
  "Borno": ["Maiduguri", "Bama", "Biu", "Monguno"],
  "Cross River": ["Calabar", "Ugep", "Obubra", "Ikom"],
  "Delta": ["Warri", "Asaba", "Sapele", "Ughelli"],
  "Ebonyi": ["Abakaliki", "Afikpo", "Onueke", "Ishieke"],
  "Edo": ["Benin City", "Auchi", "Ekpoma", "Uromi"],
  "Ekiti": ["Ado Ekiti", "Ikere Ekiti", "Oye Ekiti", "Ise Ekiti"],
  "Enugu": ["Enugu", "Nsukka", "Awgu", "Udi"],
  "Gombe": ["Gombe", "Kumo", "Deba", "Nafada"],
  "Imo": ["Owerri", "Orlu", "Okigwe", "Mbaise"],
  "Jigawa": ["Dutse", "Hadejia", "Gumel", "Birnin Kudu"],
  "Kaduna": ["Kaduna", "Zaria", "Kafanchan", "Sabon Gari"],
  "Kano": ["Kano", "Wudil", "Rano", "Gwarzo"],
  "Katsina": ["Katsina", "Daura", "Funtua", "Malumfashi"],
  "Kebbi": ["Birnin Kebbi", "Argungu", "Yauri", "Zuru"],
  "Kogi": ["Lokoja", "Okene", "Idah", "Kabba"],
  "Kwara": ["Ilorin", "Offa", "Patigi", "Jebba"],
  "Nasarawa": ["Lafia", "Keffi", "Akwanga", "Nasarawa"],
  "Niger": ["Minna", "Bida", "Suleja", "Kontagora"],
  "Ogun": ["Abeokuta", "Ijebu Ode", "Sango Otta", "Sagamu"],
  "Ondo": ["Akure", "Ondo", "Owo", "Okitipupa"],
  "Osun": ["Osogbo", "Ile Ife", "Ilesha", "Ede"],
  "Oyo": ["Ibadan", "Ogbomosho", "Oyo", "Iseyin"],
  "Plateau": ["Jos", "Pankshin", "Barkin Ladi", "Mangu"],
  "Rivers": ["Port Harcourt", "Obio Akpor", "Bonny", "Degema"],
  "Sokoto": ["Sokoto", "Gwadabawa", "Wurno", "Tambuwal"],
  "Taraba": ["Jalingo", "Wukari", "Mutum Biyu", "Ibi"],
  "Yobe": ["Damaturu", "Potiskum", "Gashua", "Nguru"],
  "Zamfara": ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka"],
  "Federal Capital Territory": ["Abuja", "Gwagwalada", "Kuje", "Bwari"],
};
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
const statuses = ["pending", "pending", "pending", "contacted", "enrolled", "rejected"]; // weighted: more pending
const firstNames = [
  "Chidi", "Amara", "Oluwaseun", "Fatima", "Kwame", "Zuri", "Tunde", "Ngozi",
  "Kofi", "Aisha", "Emeka", "Akua", "Babatunde", "Makena", "Yusuf", "Chioma",
  "Jide", "Esi", "Damilola", "Nadia", "Abubakar", "Wanjiku", "Ifeanyi", "Nneka",
  "Suleiman", "Adaeze", "Kelechi", "Obinna", "Chinwe", "Ezinne", "Chibueze",
  "Kemi", "Segun", "Toyin", "Funke", "Rotimi", "Folake", "Wale", "Bisi",
  "Dayo", "Tope", "Shola", "Yetunde", "Kunle", "Bolanle", "Adebisi", "Ola",
  "Tolani", "Sanya", "Laitan", "Femi", "Simi", "Deji", "Tomi", "Tayo",
  "Ikenna", "Chiamaka", "Uchenna", "Onyeka", "Chisom", "Somto", "Ebuka",
  "Nkechi", "Kehinde", "Taiwo", "Idris", "Aminu", "Hauwa", "Zainab", "Binta",
];
const lastNames = [
  "Okonkwo", "Adebayo", "Osei", "Mensah", "Kamau", "Okafor", "Otieno",
  "Nwachukwu", "Asante", "Abdi", "Eze", "Boateng", "Ogunlade", "Njeri",
  "Hassan", "Diallo", "Obinna", "Quartey", "Akinlade", "Mwangi",
  "Bello", "Coker", "Oduya", "Eke", "Mohammed", "Igwe", "Akinyemi",
  "Ogundele", "Balogun", "Afolabi", "Adepoju", "Ogunbiyi", "Fashola",
  "Tinubu", "Awolowo", "Akintola", "Soyinka", "Achebe", "Tutuola",
  "Okpara", "Azikiwe", "Nnamdi", "Ekwueme", "Nze", "Obi", "Okeke",
  "Igbokwe", "Ugwu", "Nwafor", "Okafor", "Nwosu", "Anozie", "Onyema",
  "Adeleke", "Opeyemi", "Olamide", "Adekunle", "Adeniyi", "Fashina",
];
const domains = ["gmail.com", "yahoo.com", "outlook.com", "protonmail.com", "icloud.com", "hotmail.com", "yandex.com", "aol.com"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateStudents(count) {
  const students = [];
  const usedEmails = new Set();
  for (let i = 0; i < count; i++) {
    const first = pick(firstNames);
    const last = pick(lastNames);
    const fullName = `${first} ${last}`;
    const emailLocal = `${first.toLowerCase()}.${last.toLowerCase()}${randBetween(1, 999)}`;
    const email = `${emailLocal}@${pick(domains)}`;
    if (usedEmails.has(email)) { i--; continue; }
    usedEmails.add(email);

    const state = pick(nigerianStates);
    const city = pick(nigerianCities[state] || [state]);

    // Spread across last 90 days, weighted more recent
    const daysAgo = Math.floor(Math.random() * 90);
    const hoursAgo = Math.floor(Math.random() * 24);
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - daysAgo);
    createdDate.setHours(createdDate.getHours() - hoursAgo);

    students.push({
      full_name: fullName,
      email,
      phone_whatsapp: `+234${String(randBetween(700000000, 829999999))}`,
      sex: pick(sexes),
      country: "Nigeria",
      state,
      course_applying_for: pick(courses),
      employment_status: pick(employmentStatuses),
      has_laptop: pick(laptopOptions),
      heard_about_us: pick(heardAboutOptions),
      learning_reason: pick(learningReasons),
      status: pick(statuses),
      created_at: createdDate.toISOString(),
    });
  }
  return students;
}

async function seed() {
  // Check current count
  const { count: currentCount } = await supabase
    .from("student_registrations")
    .select("*", { count: "exact", head: true });
  
  const target = 350;
  const needed = target - currentCount;
  
  console.log(`📊 Current students: ${currentCount}`);
  console.log(`🎯 Target: ${target}`);
  console.log(`➕ Need to add: ${needed}\n`);

  if (needed <= 0) {
    console.log("✅ Already have 350+ students. Nothing to do.");
    process.exit(0);
  }

  // Generate
  const students = generateStudents(needed);
  console.log(`👤 Generated ${students.length} new Nigerian students\n`);

  // Insert in batches of 50 (to avoid payload limits)
  const BATCH_SIZE = 50;
  let inserted = 0;
  for (let i = 0; i < students.length; i += BATCH_SIZE) {
    const batch = students.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("student_registrations").insert(batch);
    if (error) {
      console.error(`❌ Batch ${i / BATCH_SIZE + 1} failed:`, error.message);
      continue;
    }
    inserted += batch.length;
    console.log(`   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(students.length / BATCH_SIZE)} — ${batch.length} inserted`);
  }

  // Verify final count
  const { count: finalCount } = await supabase
    .from("student_registrations")
    .select("*", { count: "exact", head: true });
  
  console.log(`\n🎉 Done! Inserted ${inserted} students.`);
  console.log(`📊 Total in database: ${finalCount}`);

  // Summary by state
  const { data: stateData } = await supabase
    .from("student_registrations")
    .select("state");

  if (stateData) {
    const stateCounts = {};
    for (const s of stateData) {
      stateCounts[s.state] = (stateCounts[s.state] || 0) + 1;
    }
    console.log("\n📊 Students by state:");
    const sorted = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]);
    for (const [state, count] of sorted) {
      console.log(`   ${state.padEnd(28)} ${count}`);
    }
  }
}

seed().catch((err) => { console.error("❌ Error:", err.message); process.exit(1); });