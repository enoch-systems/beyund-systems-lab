"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import Link from "next/link";
import {
  Users, BookOpen, Bell, ChevronRight, Activity, TrendingUp, BarChart3,
  GraduationCap, DollarSign, Eye, EyeOff, Layers,
} from "lucide-react";
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/lib/theme-context";
import { getColors, type Colors } from "@/lib/theme-colors";

/* ── Types ── */
type Student = { id: string; full_name: string; email: string; course_applying_for: string; status: string; country: string; state?: string; created_at: string; };
type Course = { id: string; title: string; total_weeks: number; status: string; };
type PaymentProfile = { id: string; student_id: string; total_fee: number; amount_paid: number; balance: number; payment_status: string; };
type PaymentTx = { id: string; student_id: string; amount: number; payment_method: string; created_at: string; };
type Notification = { id: string; title: string; message: string; category: string; status: string; created_at: string; };

/* ── Helpers ── */
const fmt = (n: number) => n === 0 ? "₦0" : `₦${n.toLocaleString()}`;
const nDate = (s: string) => {
  const d = new Date(s);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
};
const initials = (n: string) => n.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);
const ts = () => {
  const d = new Date();
  return d.toLocaleString("en-US", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });
};

export default function AdminDashboardPage() {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [paymentProfiles, setPaymentProfiles] = useState<PaymentProfile[]>([]);
  const [transactions, setTransactions] = useState<PaymentTx[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prevTotal, setPrevTotal] = useState(0);
  const [showRevenue, setShowRevenue] = useState(true);
  const [showCollected, setShowCollected] = useState(true);
  const [showOutstanding, setShowOutstanding] = useState(true);
  const [showTotalFees, setShowTotalFees] = useState(true);
  const [now, setNow] = useState(ts());
  const [adminFirstName, setAdminFirstName] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const C = getColors(theme);
  useEffect(() => { document.title = "Admin LMS — Beyund Labs Academy"; }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(ts()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: c }, { data: p }, { data: tx }, { data: n }, { data: settings }] = await Promise.all([
        supabase.from("student_registrations").select("*").order("created_at", { ascending: false }),
        supabase.from("courses").select("*").order("created_at", { ascending: false }),
        supabase.from("student_payment_profiles").select("*"),
        supabase.from("payments").select("*").order("created_at", { ascending: false }),
        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("admin_settings").select("value").eq("key", "admin_name").maybeSingle(),
      ]);
      if (s) { setStudents(s as Student[]); setPrevTotal(s.length); }
      if (c) setCourses(c as Course[]);
      if (p) setPaymentProfiles(p as PaymentProfile[]);
      if (tx) setTransactions(tx as PaymentTx[]);
      if (n) setNotifications(n as Notification[]);
      if (settings?.value) {
        setAdminFirstName(settings.value.split(" ")[0]);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        const emailPrefix = session?.user?.email?.split("@")[0] ?? "Admin";
        setAdminFirstName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  const total = students.length;
  const enrolled = students.filter(s => s.status === "enrolled").length;
  const pending = students.filter(s => s.status === "pending").length;
  const contacted = students.filter(s => s.status === "contacted").length;
  const rejected = students.filter(s => s.status === "rejected").length;
  const activeCourses = courses.filter(c => c.status === "active").length;
  const collected = paymentProfiles.reduce((s, p) => s + p.amount_paid, 0);
  const outstanding = paymentProfiles.reduce((s, p) => s + p.balance, 0);
  const totalFees = paymentProfiles.reduce((s, p) => s + p.total_fee, 0);
  const collectionRate = totalFees > 0 ? Math.round((collected / totalFees) * 100) : 0;
  const unread = notifications.filter(n => n.status === "unread").length;
  const trend = prevTotal > 0 ? ((total - prevTotal) / prevTotal * 100).toFixed(1) : "0";

  // ── Region Data (enrolled only) ──
  // Group by (country + state) so we can show:
  //   - country + real flag image on the left side (outside the bar)
  //   - "State (N persons)" centered inside the bar
  // For registrations that only have a country (no state), we still surface the country.
  //
  // Flag rendering: real PNG flags from flagcdn.com (auto-resolves any ISO-3166-1
  // alpha-2 country code). No hard-coded emoji. We just need the ISO code.
  //
  // Comprehensive country name -> ISO code map (the form's country search uses the
  // restcountries.com API which spells names a certain way; the SQL seed uses English
  // common names; both are covered below).
  const COUNTRY_NAME_TO_CODE: Record<string, string> = {
    Afghanistan: "af", "Åland Islands": "ax", Albania: "al", Algeria: "dz",
    "American Samoa": "as", Andorra: "ad", Angola: "ao", Anguilla: "ai",
    Antarctica: "aq", "Antigua and Barbuda": "ag", Argentina: "ar", Armenia: "am",
    Aruba: "aw", Australia: "au", Austria: "at", Azerbaijan: "az",
    Bahamas: "bs", Bahrain: "bh", Bangladesh: "bd", Barbados: "bb",
    Belarus: "by", Belgium: "be", Belize: "bz", Benin: "bj", Bermuda: "bm",
    Bhutan: "bt", Bolivia: "bo", "Bonaire, Sint Eustatius and Saba": "bq",
    "Bosnia and Herzegovina": "ba", Botswana: "bw", "Bouvet Island": "bv",
    Brazil: "br", "British Indian Ocean Territory": "io",
    "Brunei Darussalam": "bn", Bulgaria: "bg", "Burkina Faso": "bf",
    Burundi: "bi", Cambodia: "kh", Cameroon: "cm", Canada: "ca",
    "Cape Verde": "cv", "Cayman Islands": "ky", "Central African Republic": "cf",
    Chad: "td", Chile: "cl", China: "cn", "Christmas Island": "cx",
    "Cocos (Keeling) Islands": "cc", Colombia: "co", Comoros: "km",
    Congo: "cg", "Congo, Democratic Republic of the": "cd",
    "Cook Islands": "ck", "Costa Rica": "cr", "Côte d'Ivoire": "ci",
    "Cote d'Ivoire": "ci", Croatia: "hr", Cuba: "cu", Curaçao: "cw",
    Cyprus: "cy", "Czech Republic": "cz", "Czechia": "cz", Denmark: "dk",
    Djibouti: "dj", Dominica: "dm", "Dominican Republic": "do", Ecuador: "ec",
    Egypt: "eg", "El Salvador": "sv", "Equatorial Guinea": "gq", Eritrea: "er",
    Estonia: "ee", Eswatini: "sz", Ethiopia: "et",
    "Falkland Islands": "fk", "Faroe Islands": "fo", Fiji: "fj", Finland: "fi",
    France: "fr", "French Guiana": "gf", "French Polynesia": "pf",
    "French Southern Territories": "tf", Gabon: "ga", Gambia: "gm", Georgia: "ge",
    Germany: "de", Ghana: "gh", Gibraltar: "gi", Greece: "gr", Greenland: "gl",
    Grenada: "gd", Guadeloupe: "gp", Guam: "gu", Guatemala: "gt",
    Guernsey: "gg", Guinea: "gn", "Guinea-Bissau": "gw", Guyana: "gy",
    Haiti: "ht", "Heard Island and McDonald Islands": "hm",
    "Holy See (Vatican City State)": "va", Honduras: "hn",
    "Hong Kong": "hk", Hungary: "hu", Iceland: "is", India: "in", Indonesia: "id",
    Iran: "ir", Iraq: "iq", Ireland: "ie", "Isle of Man": "im", Israel: "il",
    Italy: "it", Jamaica: "jm", Japan: "jp", Jersey: "je", Jordan: "jo",
    Kazakhstan: "kz", Kenya: "ke", Kiribati: "ki",
    "Korea, Democratic People's Republic of": "kp",
    "Korea, Republic of": "kr", "South Korea": "kr", "North Korea": "kp",
    Kuwait: "kw", Kyrgyzstan: "kg",
    "Lao People's Democratic Republic": "la", Laos: "la", Latvia: "lv",
    Lebanon: "lb", Lesotho: "ls", Liberia: "lr", Libya: "ly",
    Liechtenstein: "li", Lithuania: "lt", Luxembourg: "lu", Macao: "mo",
    "North Macedonia": "mk", Madagascar: "mg", Malawi: "mw", Malaysia: "my",
    Maldives: "mv", Mali: "ml", Malta: "mt", "Marshall Islands": "mh",
    Martinique: "mq", Mauritania: "mr", Mauritius: "mu", Mayotte: "yt",
    Mexico: "mx", Micronesia: "fm", Moldova: "md", Monaco: "mc", Mongolia: "mn",
    Montenegro: "me", Montserrat: "ms", Morocco: "ma", Mozambique: "mz",
    Myanmar: "mm", Namibia: "na", Nauru: "nr", Nepal: "np",
    Netherlands: "nl", "New Caledonia": "nc", "New Zealand": "nz",
    Nicaragua: "ni", Niger: "ne", Nigeria: "ng", Niue: "nu",
    "Norfolk Island": "nf", "Northern Mariana Islands": "mp", Norway: "no",
    Oman: "om", Pakistan: "pk", Palau: "pw", "Palestine, State of": "ps",
    Panama: "pa", "Papua New Guinea": "pg", Paraguay: "py", Peru: "pe",
    Philippines: "ph", Pitcairn: "pn", Poland: "pl", Portugal: "pt",
    "Puerto Rico": "pr", Qatar: "qa", Réunion: "re", Romania: "ro",
    "Russian Federation": "ru", Russia: "ru", Rwanda: "rw",
    "Saint Barthélemy": "bl", "Saint Helena, Ascension and Tristan da Cunha": "sh",
    "Saint Kitts and Nevis": "kn", "Saint Lucia": "lc",
    "Saint Martin (French part)": "mf", "Saint Pierre and Miquelon": "pm",
    "Saint Vincent and the Grenadines": "vc", Samoa: "ws", "San Marino": "sm",
    "Sao Tome and Principe": "st", "Saudi Arabia": "sa", Senegal: "sn",
    Serbia: "rs", Seychelles: "sc", "Sierra Leone": "sl", Singapore: "sg",
    "Sint Maarten (Dutch part)": "sx", Slovakia: "sk", Slovenia: "si",
    "Solomon Islands": "sb", Somalia: "so", "South Africa": "za",
    "South Georgia and the South Sandwich Islands": "gs",
    "South Sudan": "ss", Spain: "es", "Sri Lanka": "lk", Sudan: "sd",
    Suriname: "sr", "Svalbard and Jan Mayen": "sj",
    Sweden: "se", Switzerland: "ch", "Syrian Arab Republic": "sy", Syria: "sy",
    Taiwan: "tw", Tajikistan: "tj", Tanzania: "tz", Thailand: "th",
    "Timor-Leste": "tl", Togo: "tg", Tokelau: "tk", Tonga: "to",
    "Trinidad and Tobago": "tt", Tunisia: "tn", Turkey: "tr", Turkmenistan: "tm",
    "Turks and Caicos Islands": "tc", Tuvalu: "tv", Uganda: "ug", Ukraine: "ua",
    "United Arab Emirates": "ae", UAE: "ae",
    "United Kingdom": "gb", UK: "gb", "Great Britain": "gb", England: "gb",
    "United States": "us", USA: "us", "United States of America": "us",
    "United States Minor Outlying Islands": "um", Uruguay: "uy",
    Uzbekistan: "uz", Vanuatu: "vu", "Venezuela, Bolivarian Republic of": "ve",
    Venezuela: "ve", Vietnam: "vn", "Viet Nam": "vn",
    "Virgin Islands, British": "vg", "British Virgin Islands": "vg",
    "Virgin Islands, U.S.": "vi", "U.S. Virgin Islands": "vi",
    "Wallis and Futuna": "wf", "Western Sahara": "eh", Yemen: "ye",
    Zambia: "zm", Zimbabwe: "zw", Kosovo: "xk",
  };
  // Build the flag URL for a country name. Returns null if we can't resolve
  // the country to an ISO-2 code (e.g. "Unknown").
  const flagUrl = (country: string): string | null => {
    const code = COUNTRY_NAME_TO_CODE[country];
    if (!code) return null;
    // flagcdn.com serves a real PNG flag for any ISO-3166-1 alpha-2 code.
    // 20px wide is enough for a small YAxis tick.
    return `https://flagcdn.com/w20/${code}.png`;
  };
  // Normalise state names so "Abia" and "Abia State" are collapsed into one.
  const normaliseState = (raw: string) =>
    raw
      .replace(/\s+State$/i, "")
      .replace(/\s+LGA$/i, "")
      .trim();

  type RegionRow = { country: string; state: string; count: number; flagUrl: string | null };
  const enrolledStudents = students.filter(s => s.status === "enrolled");
  const rcMap: Record<string, RegionRow> = {};
  enrolledStudents.forEach(s => {
    const country = (s.country && s.country.trim()) || "Unknown";
    const rawState = (s.state && s.state.trim()) || country;
    const state = normaliseState(rawState);
    // Use a composite key so the same state name in two different countries doesn't collide
    const key = `${country}::${state}`;
    if (!rcMap[key]) {
      rcMap[key] = {
        country,
        state,
        count: 0,
        flagUrl: flagUrl(country),
      };
    }
    rcMap[key].count += 1;
  });
  const rd = Object.values(rcMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxC = Math.max(...rd.map(d => d.count), 1);
  const regionData = rd.map(d => ({
    ...d,
    // YAxis tick: country (real flag is rendered by the custom tick below)
    yLabel: d.country,
    // Bar center label: "State (N)" – short enough to stay on one line
    barLabel: `${d.state} (${d.count})`,
    fill: C.teal,
    fillOpacity: 0.25 + (d.count / maxC) * 0.55,
  }));
  // Distinct countries represented in the registered data (for context label)
  const countriesSet = Array.from(
    new Set(
      enrolledStudents
        .map(s => (s.country && s.country.trim()) || "")
        .filter(Boolean)
    )
  );
  const regionSubLabel = countriesSet.length > 0
    ? `Top 5 states · ${countriesSet.length} ${countriesSet.length === 1 ? "country" : "countries"}`
    : "Top 5 states";

  // ── Recent Registrations ──
  const recentStudents = students.slice(0, 5);

  // ── Status Data ──
  const sd = [
    { name: "Enrolled", value: enrolled || 0, color: C.green },
    { name: "Pending", value: pending || 0, color: C.amber },
    { name: "Contacted", value: contacted || 0, color: C.accent },
    { name: "Rejected", value: rejected || 0, color: C.red },
  ].filter(d => d.value > 0);
  const displaySD = total > 0 ? sd : [{ name: "—", value: 1, color: C.dim }];

  // ── Growth ──
  const gd = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const lb = d.toLocaleDateString("en-NG", { weekday: "short", day: "numeric" });
    gd.push({ date: ds, count: students.filter(s => s.created_at?.startsWith(ds)).length, label: lb });
  }

  // ── Daily Payments ──
  const dpm: Record<string, { count: number; amount: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    dpm[d.toISOString().split("T")[0]] = { count: 0, amount: 0 };
  }
  transactions.forEach(tx => {
    const day = tx.created_at?.split("T")[0];
    if (day && dpm[day] !== undefined) { dpm[day].count++; dpm[day].amount += tx.amount; }
  });
  const dailyPayments = Object.entries(dpm).map(([day, data]) => {
    const d = new Date(day + "T12:00:00");
    return { day, label: d.toLocaleDateString("en-NG", { weekday: "short", day: "numeric" }), ...data };
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[100vh]" style={{ background: C.bg }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border border-t-transparent animate-spin" style={{ borderColor: C.dim, borderTopColor: C.teal }} />
        <p className="text-xs" style={{ color: C.muted }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "10px", fontFamily: "'Inter','SF Pro',system-ui,sans-serif", maxWidth: 1280, margin: "0 auto" }} className="sm:p-4 md:p-6 xl:p-8">
      <style>{`
        .payment-stats-row {
          grid-template-columns: 1fr;
        }
        .payment-stats-grid {
          grid-template-columns: 1fr 1fr 1fr;
        }
        @media (min-width: 640px) {
          .payment-stats-row {
            grid-template-columns: auto 1fr;
            align-items: center;
          }
        }
        @media (min-width: 768px) {
          .payment-stats-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      `}</style>

      {/* ── Top Bar ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }} className="sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:mb-5 sm:pb-4">
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: C.text, letterSpacing: "-0.02em", lineHeight: 1.2 }} className="sm:text-[22px] md:text-[24px]">Welcome, {adminFirstName || "Admin"}</span>
          <span style={{ fontSize: 10, color: C.muted, fontFamily: "'JetBrains Mono','SF Mono',monospace", opacity: 0.75 }} className="sm:text-[11px] md:text-[12px]">{now}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }} className="sm:gap-3">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: C.muted }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />
            System OK
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: C.muted }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: unread > 0 ? C.amber : C.dim }} />
            {unread} alert{unread !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }} className="sm:gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Kpi icon={<GraduationCap size={14} />} label="Students" value={String(total)} sub={`${enrolled} enrolled`} href="/adminportal/students" C={C} />
        <Kpi icon={<BookOpen size={14} />} label="Courses" value={String(activeCourses)} sub={`${courses.length} total`} href="/adminportal/courses" C={C} />
        <Kpi icon={<DollarSign size={14} />} label="Revenue" value={showRevenue ? fmt(collected) : "₦••••••"} sub={showRevenue ? `${paymentProfiles.filter(p => p.payment_status === "paid").length} paid` : "••••• paid"} href="/adminportal/payments" onToggle={() => { setShowRevenue(!showRevenue); setShowCollected(!showRevenue); }} showEye={showRevenue} valueColor={theme === "dark" ? "#fde68a" : "#92400e"} C={C} />
        <Kpi icon={<Bell size={14} />} label="Activity" value={String(notifications.length)} sub={`${unread} unread`} href="/adminportal/notifications" C={C} />
      </div>

      {/* ── Main Chart Row ── */}
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }} className="sm:gap-4 md:grid-cols-2">
        {/* Growth */}
        <Card title="Registrations" sub="14d" icon={<TrendingUp size={12} />} C={C}>
          <div style={{ height: 180 }} className="sm:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gd} margin={{ top: 4, right: 4, left: isMobile ? -20 : -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.teal} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: isMobile ? 7 : 9, fill: C.muted }} axisLine={false} tickLine={false} interval={isMobile ? 2 : 1} />
                <YAxis allowDecimals={false} tick={{ fontSize: isMobile ? 7 : 9, fill: C.muted }} axisLine={false} tickLine={false} width={isMobile ? 24 : 36} />
                <Tooltip content={<CTip C={C} />} />
                <Area type="monotone" dataKey="count" stroke={C.teal} strokeWidth={1.5} fill="url(#gg)" name="New" dot={total > 0 ? { r: isMobile ? 1.5 : 2, fill: C.teal, stroke: "none" } : false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      
        {/* Status */}
        <Card title="Registration Status" sub={sd.filter(d => d.value > 0).length + " statuses"} icon={<BarChart3 size={12} />} C={C}>
          <div style={{ height: 180 }} className="sm:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={displaySD} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                  {displaySD.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CTip C={C} />} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="status-legend" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {sd.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color }} />
                <span style={{ fontSize: 10, color: C.muted }}>{d.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: C.text, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Secondary Chart Row ── */}
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }} className="sm:gap-4 md:grid-cols-2">
        {/* Region */}
        <Card title="Enrollment by Region" sub={regionSubLabel} icon={<BarChart3 size={12} />} C={C}>
          <div
            style={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              minHeight: 170,
            }}
          >
            {/* Globe background — blended softly behind the chart */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/globe.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                opacity: theme === "dark" ? 0.10 : 0.18,
                filter: theme === "dark"
                  ? "invert(1) hue-rotate(180deg) brightness(1.4)"
                  : "hue-rotate(-10deg) saturate(0.6) brightness(1.05)",
                mixBlendMode: theme === "dark" ? "screen" : "multiply",
                pointerEvents: "none",
              }}
            />
            {regionData.length === 0 ? (
              <div style={{ position: "relative", height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, color: C.muted }}>No data</span>
              </div>
            ) : (
              <div style={{ position: "relative", height: 170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regionData}
                    margin={{ top: 4, right: isMobile ? 2 : 16, left: isMobile ? 0 : 4, bottom: 0 }}
                    layout="vertical"
                    barCategoryGap={4}
                  >
                    <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={false} axisLine={false} tickLine={false} />
                    {/* YAxis (left side, outside the bar) shows flag image + country */}
                    <YAxis
                      type="category"
                      dataKey="yLabel"
                      axisLine={false}
                      tickLine={false}
                      width={isMobile ? 64 : 108}
                      tick={(props: any) => {
                        const { x, y, payload } = props;
                        const item = regionData.find(d => d.yLabel === payload.value);
                        const flagOffsetX = isMobile ? -58 : -100;
                        const textOffsetX = isMobile ? -40 : -78;
                        const fontSize = isMobile ? 7 : 9;
                        const flagW = isMobile ? 12 : 18;
                        const flagH = isMobile ? 8 : 12;
                        return (
                          <g transform={`translate(${x},${y})`}>
                            {item?.flagUrl ? (
                              <image
                                href={item.flagUrl}
                                x={flagOffsetX}
                                y={-6}
                                width={flagW}
                                height={flagH}
                                preserveAspectRatio="xMidYMid meet"
                                style={{ borderRadius: 1, outline: "1px solid rgba(255,255,255,0.15)" }}
                              />
                            ) : (
                              <rect x={flagOffsetX} y={-6} width={flagW} height={flagH} fill={C.dim} opacity={0.3} rx={1} />
                            )}
                            <text
                              x={textOffsetX}
                              y={0}
                              dy={3.5}
                              textAnchor="start"
                              fill={C.text}
                              fontSize={fontSize}
                              fontWeight={600}
                              fontFamily="'Inter','SF Pro',system-ui,sans-serif"
                            >
                              {payload.value}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      content={<CTip C={C} />}
                    />
                    {/* Bar center label: "State (N)" or shorter on mobile */}
                    <Bar
                      dataKey="count"
                      radius={[0, 3, 3, 0]}
                      name="Students"
                      barSize={isMobile ? 12 : 16}
                      isAnimationActive={false}
                      label={{
                        position: "center",
                        fill: "#f8fafc",
                        fontSize: isMobile ? 7 : 9,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono','SF Mono',monospace",
                        formatter: (v: any) => {
                          const item = regionData.find(d => d.count === v);
                          return item ? item.barLabel : String(v);
                        },
                        content: (props: any) => {
                          const { index } = props;
                          const item = regionData[index];
                          if (!item) return null;
                          // Truncate state name for mobile
                          const label = isMobile
                            ? `${item.state.length > 12 ? item.state.slice(0, 11) + "…" : item.state} (${item.count})`
                            : item.barLabel;
                          return (
                            <text
                              x={props.x + props.width / 2}
                              y={props.y + props.height / 2}
                              fill="#f8fafc"
                              fontSize={isMobile ? 7 : 9}
                              fontWeight={700}
                              fontFamily="'JetBrains Mono','SF Mono',monospace"
                              textAnchor="middle"
                              dominantBaseline="central"
                            >
                              {label}
                            </text>
                          );
                        },
                      }}
                    >
                      {regionData.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={e.fillOpacity} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Analytics */}
        <Card title="Payment Analytics" sub={`${transactions.length} tx`} icon={<DollarSign size={12} />} C={C}>
          {paymentProfiles.length === 0 ? (
            <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: C.muted }}>No data</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Stats row */}
              <div className="payment-stats-row" style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.card, borderRadius: 4, padding: "8px 10px", border: `1px solid ${C.border}` }}>
                  <div style={{ position: "relative", width: 52, height: 52 }}>
                    <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke={C.dim} strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke={collectionRate > 70 ? C.green : collectionRate > 40 ? C.amber : C.red} strokeWidth="3" strokeDasharray={`${collectionRate} ${100 - collectionRate}`} strokeLinecap="round" />
                    </svg>
                    <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.text, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{collectionRate}%</span>
                  </div>
                  <span style={{ fontSize: 8, color: C.muted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Rate</span>
                </div>
                <div className="payment-stats-grid" style={{ display: "grid", gap: 4 }}>
                  {[
                    { label: "Collected", val: fmt(collected), color: theme === "dark" ? "#fde68a" : "#92400e" },
                    { label: "Outstanding", val: fmt(outstanding), color: C.amber },
                    { label: "Total Fees", val: fmt(totalFees), color: C.text },
                  ].map(s => (
                    <div key={s.label} style={{ background: C.card, borderRadius: 4, padding: "6px 8px", border: `1px solid ${C.border}`, position: "relative" }}>
                      <p style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                        {s.label}
                        {s.label === "Collected" && (
                          <button onClick={() => setShowCollected(!showCollected)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: C.muted, display: "inline-flex", lineHeight: 1 }}>
                            {showCollected ? <EyeOff size={10} /> : <Eye size={10} />}
                          </button>
                        )}
                        {s.label === "Outstanding" && (
                          <button onClick={() => setShowOutstanding(!showOutstanding)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: C.muted, display: "inline-flex", lineHeight: 1 }}>
                            {showOutstanding ? <EyeOff size={10} /> : <Eye size={10} />}
                          </button>
                        )}
                        {s.label === "Total Fees" && (
                          <button onClick={() => setShowTotalFees(!showTotalFees)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: C.muted, display: "inline-flex", lineHeight: 1 }}>
                            {showTotalFees ? <EyeOff size={10} /> : <Eye size={10} />}
                          </button>
                        )}
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: s.color, margin: "2px 0 0", fontFamily: "'JetBrains Mono','SF Mono',monospace", overflow: "hidden", textOverflow: "ellipsis" }}>{
                        s.label === "Collected" ? (showCollected ? s.val : "₦••••••") :
                        s.label === "Outstanding" ? (showOutstanding ? s.val : "₦••••••") :
                        s.label === "Total Fees" ? (showTotalFees ? s.val : "₦••••••") :
                        s.val
                      }</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily trend */}
              {dailyPayments.some(d => d.count > 0) && (
                <div style={{ height: 55 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyPayments} margin={{ top: 2, right: 2, left: -16, bottom: 0 }}>
                      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.teal} stopOpacity={0.1} /><stop offset="95%" stopColor={C.teal} stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 8, fill: C.muted }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip content={<CTip C={C} />} />
                      <Area type="monotone" dataKey="amount" stroke={C.teal} strokeWidth={1.5} fill="url(#pg)" name="Amount" dot={{ r: 2, fill: C.teal, stroke: "none" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}


              {/* Latest */}
              {transactions.length > 0 && (
                <div style={{ background: C.card, borderRadius: 4, padding: "6px 8px", border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: C.muted }}>Latest: <strong style={{ color: "#22c55e", fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>₦{transactions[0].amount.toLocaleString()}</strong> via {transactions[0].payment_method}</span>
                  <span style={{ fontSize: 8, color: C.dim, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{nDate(transactions[0].created_at)}</span>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* ── Recently Registered ── */}
      {recentStudents.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
              <Users size={13} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text, letterSpacing: "-0.01em" }}>Recently Registered</span>
            <Link href="/adminportal/students" style={{ marginLeft: "auto", fontSize: 10, color: C.teal, fontFamily: "'JetBrains Mono','SF Mono',monospace", textDecoration: "none", cursor: "pointer", fontWeight: 500, opacity: 0.85, transition: "opacity 0.15s" }}>
              See all →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recentStudents.map((s, idx) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 5, background: C.bg, border: `1px solid ${C.border}`, transition: "border-color 0.15s" }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${C.teal}22, ${C.teal}44)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: C.teal, flexShrink: 0 }}>
                  {initials(s.full_name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.full_name}</p>
                  <p style={{ fontSize: 9, color: C.muted, margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.course_applying_for}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1, flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: C.muted, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{nDate(s.created_at)}</span>
                  <span style={{ fontSize: 7, fontWeight: 500, color: C.dim }}>{idx === 0 ? "Latest" : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 0 0", marginTop: 12, borderTop: `1px solid ${C.border}` }} className="sm:flex-row sm:justify-between sm:items-center sm:gap-0">
        <span style={{ fontSize: 9, color: C.muted, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>
          {total} records · {enrolled} enrolled · {pending} pending
        </span>
        <span style={{ fontSize: 9, color: C.dim, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>
          Beyund LMS v1.0
        </span>
      </div>
    </div>
  );
}

/* ── Components ── */

function Kpi({ icon, label, value, sub, href, onToggle, showEye, valueColor, C }: {
  icon: React.ReactNode; label: string; value: string; sub: string; href: string;
  onToggle?: () => void; showEye?: boolean; valueColor?: string; C: Colors;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "10px 12px", transition: "border-color 0.15s" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{label}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {showEye !== undefined && onToggle && (
              <button onClick={e => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2, color: C.muted, display: "flex" }}>
                {showEye ? <EyeOff size={11} /> : <Eye size={11} />}
              </button>
            )}
            <span style={{ color: C.muted }}>{icon}</span>
          </div>
        </div>
        <p style={{ fontSize: 20, fontWeight: 700, color: valueColor || C.text, margin: 0, fontFamily: "'JetBrains Mono','SF Mono',monospace", lineHeight: 1.2 }}>{value}</p>
        <p style={{ fontSize: 9, color: C.muted, margin: "2px 0 0" }}>{sub}</p>
      </div>
    </Link>
  );
}

function Card({ title, sub, icon, children, C }: { title: string; sub: string; icon: React.ReactNode; children: React.ReactNode; C: Colors }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: 10 }} className="sm:p-4">
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ color: C.muted, display: "flex" }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{title}</span>
        <span style={{ fontSize: 9, color: C.muted, marginLeft: "auto", fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{sub}</span>
      </div>
      {children}
    </div>
  );
}

function CTip({ active, payload, label, C }: any) {
  if (!active || !payload) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "6px 8px", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
      {label && <p style={{ fontSize: 9, color: C.muted, margin: "0 0 2px" }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 10, fontWeight: 600, color: C.text, margin: 0, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>
          {p.name}: {typeof p.value === "number" && p.value > 100000 ? `₦${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}

function SBadge({ status, C }: { status: string; C: Colors }) {
  const map: Record<string, string> = {
    enrolled: C.green, pending: C.amber, contacted: C.accent, rejected: C.red,
  };
  return (
    <span style={{ fontSize: 8, fontWeight: 600, color: map[status] || C.muted, textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>
      {status}
    </span>
  );
}
