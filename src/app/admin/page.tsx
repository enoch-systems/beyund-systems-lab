"use client";

import { useEffect, useState } from "react";
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
  const [now, setNow] = useState(ts());
  const [adminFirstName, setAdminFirstName] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const theme = "dark";
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
      try {
        const [sRes] = await Promise.all([
          fetch("/api/admin/students", { cache: "no-store" }),
        ]);
        const s = sRes.ok ? await sRes.json() : [];
        setStudents(s);
        setPrevTotal(s.length);
        setCourses([]);
        setPaymentProfiles([]);
        setTransactions([]);
        setNotifications([]);
      } catch {
        setStudents([]);
        setCourses([]);
        setPaymentProfiles([]);
        setTransactions([]);
        setNotifications([]);
      }
      setLoading(false);
    }
    load();
  }, []);

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
  const normaliseState = (raw: string) =>
    raw.replace(/\s+State$/i, "").replace(/\s+LGA$/i, "").trim();

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
  const flagUrl = (country: string): string | null => {
    const code = COUNTRY_NAME_TO_CODE[country];
    if (!code) return null;
    return `https://flagcdn.com/w20/${code}.png`;
  };

  const countryShortCode = (country: string): string => {
    const code = COUNTRY_NAME_TO_CODE[country];
    if (code) return code.toUpperCase();
    return country.slice(0, 2).toUpperCase();
  };

  type RegionRow = { country: string; shortCode: string; state: string; count: number; flagUrl: string | null };
  const enrolledStudents = students.filter(s => s.status === "enrolled");

  const stateCounts: Record<string, Record<string, number>> = {};
  enrolledStudents.forEach(s => {
    const country = (s.country && s.country.trim()) || "Unknown";
    const rawState = (s.state && s.state.trim()) || country;
    const state = normaliseState(rawState);
    if (!stateCounts[country]) stateCounts[country] = {};
    stateCounts[country][state] = (stateCounts[country][state] || 0) + 1;
  });

  const countryTotals = Object.entries(stateCounts).map(([country, states]) => ({
    country,
    total: Object.values(states).reduce((s, c) => s + c, 0),
  })).sort((a, b) => b.total - a.total);

  const rd: RegionRow[] = [];
  countryTotals.forEach(({ country }) => {
    const states = stateCounts[country];
    const topStates = Object.entries(states)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    topStates.forEach(([state, count]) => {
      rd.push({
        country,
        shortCode: countryShortCode(country),
        state,
        count,
        flagUrl: flagUrl(country),
      });
    });
  });

  const maxC = Math.max(...rd.map(d => d.count), 1);
  const isSingleCountry = countryTotals.length === 1;

  const regionData = rd.map((d, idx) => ({
    ...d,
    yLabel: isSingleCountry ? d.state : `${d.shortCode} ${d.state}`,
    barLabel: `${d.state} (${d.count})`,
    fill: "#14b8a6",
    fillOpacity: 0.25 + (d.count / maxC) * 0.55,
  }));

  const countriesCount = countryTotals.length;
  const totalStates = rd.length;
  const regionSubLabel = countriesCount > 0
    ? `${totalStates} state${totalStates !== 1 ? "s" : ""} · ${countriesCount} ${countriesCount === 1 ? "country" : "countries"}`
    : "No region data";

  // ── Country Deep Dive: NG, US, CA, GH ──
  const COUNTRY_CODE_TO_NAME: Record<string, string> = {
    ng: "Nigeria", us: "United States", ca: "Canada", gh: "Ghana",
  };
  const TARGET_COUNTRY_CODES = new Set(["ng", "us", "ca", "gh"]);

  const targetedEnrolled = enrolledStudents.filter(s => {
    const code = COUNTRY_NAME_TO_CODE[s.country?.trim() || ""];
    return code && TARGET_COUNTRY_CODES.has(code);
  });

  const deepStateCounts: Record<string, Record<string, number>> = {};
  targetedEnrolled.forEach(s => {
    const country = (s.country && s.country.trim()) || "Unknown";
    const rawState = (s.state && s.state.trim()) || country;
    const state = normaliseState(rawState);
    if (!deepStateCounts[country]) deepStateCounts[country] = {};
    deepStateCounts[country][state] = (deepStateCounts[country][state] || 0) + 1;
  });

  type DeepRow = {
    country: string; shortCode: string; flagUrl: string | null;
    state: string; count: number; yLabel: string; barLabel: string;
    fill: string; fillOpacity: number;
  };

  const countryDisplayOrder = ["ng", "us", "ca", "gh"];
  const countryColorMap: Record<string, string> = {
    ng: "#10b981", us: "#3b82f6", ca: "#ef4444", gh: "#f59e0b",
  };

  const deepDataAll: DeepRow[] = [];
  countryDisplayOrder.forEach(code => {
    const fullName = Object.entries(COUNTRY_NAME_TO_CODE).find(([, v]) => v === code)?.[0];
    if (!fullName || !deepStateCounts[fullName]) return;
    const states = deepStateCounts[fullName];
    const entries = Object.entries(states);
    const maxForCountry = Math.max(...entries.map(([, c]) => c), 1);
    const baseColor = countryColorMap[code] || "#14b8a6";
    entries.forEach(([state, count]) => {
      const opacity = 0.30 + (count / maxForCountry) * 0.55;
      deepDataAll.push({
        country: fullName,
        shortCode: code.toUpperCase(),
        flagUrl: `https://flagcdn.com/w20/${code}.png`,
        state,
        count,
        yLabel: `${code.toUpperCase()} ${state}`,
        barLabel: `${state} (${count})`,
        fill: baseColor,
        fillOpacity: opacity,
      });
    });
  });
  const deepData = deepDataAll.sort((a, b) => b.count - a.count).slice(0, 10);
  const deepTotalStates = deepData.length;
  const deepCountryCount = countryDisplayOrder.filter(c =>
    Object.entries(COUNTRY_NAME_TO_CODE).some(([, v]) => v === c && deepStateCounts[Object.entries(COUNTRY_NAME_TO_CODE).find(([, v2]) => v2 === c)?.[0] || ""])
  ).length;

  // ── Recent Registrations ──
  const recentStudents = students.slice(0, 10);
  const recentTotal = students.length;

  // ── Status Data ──
  const sd = [
    { name: "Enrolled", value: enrolled || 0, color: "#10b981" },
    { name: "Pending", value: pending || 0, color: "#f59e0b" },
    { name: "Contacted", value: contacted || 0, color: "#3b82f6" },
    { name: "Rejected", value: rejected || 0, color: "#ef4444" },
  ].filter(d => d.value > 0);
  const displaySD = total > 0 ? sd : [{ name: "—", value: 1, color: "#64748b" }];

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
    <div className="flex items-center justify-center min-h-[100vh]" style={{ background: "var(--color-bg-primary)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "var(--color-bg-primary)", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
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
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 12, 
        marginBottom: 20, 
        paddingBottom: 16, 
        background: "var(--color-bg-secondary)",
        borderRadius: 14,
        padding: 20,
        boxShadow: "var(--shadow-sm)",
      }} className="sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }} className="sm:text-[24px] md:text-[26px]">
            Welcome, {adminFirstName || "Admin"}
          </span>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)", opacity: 0.8 }} className="sm:text-[13px]">
            {now}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)" }} />
            System OK
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: unread > 0 ? "#f59e0b" : "#64748b", boxShadow: unread > 0 ? "0 0 0 2px rgba(245, 158, 11, 0.2)" : "none" }} />
            {unread} alert{unread !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: "grid", gap: 16, marginBottom: 20 }} className="sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={<GraduationCap size={18} />} label="Students" value={String(total)} sub={`${enrolled} enrolled`} href="/admin/students" />
        <Kpi icon={<BookOpen size={18} />} label="Courses" value={String(activeCourses)} sub={`${courses.length} total`} href="/admin/courses" />
        <Kpi 
          icon={<DollarSign size={18} />} 
          label="Revenue" 
          value={showRevenue ? fmt(collected) : "₦••••••"} 
          sub={showRevenue ? `${paymentProfiles.filter(p => p.payment_status === "paid").length} paid` : "••••• paid"} 
          href="/admin/payments" 
          onToggle={() => { setShowRevenue(!showRevenue); setShowCollected(!showRevenue); }} 
          showEye={showRevenue} 
          valueColor="#fde68a" 
        />
        <Kpi icon={<Bell size={18} />} label="Activity" value={String(notifications.length)} sub={`${unread} unread`} href="/admin/notifications" />
      </div>

      {/* ── Main Chart Row ── */}
      <div style={{ display: "grid", gap: 16, marginBottom: 20 }} className="sm:gap-4 lg:grid-cols-2">
        {/* Growth */}
        <Card title="Registrations" sub="14d" icon={<TrendingUp size={16} />}>
          <div style={{ height: 200 }} className="sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gd} margin={{ top: 4, right: 4, left: isMobile ? -20 : -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border-default)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: isMobile ? 9 : 10, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} interval={isMobile ? 2 : 1} />
                <YAxis allowDecimals={false} tick={{ fontSize: isMobile ? 9 : 10, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} width={isMobile ? 28 : 40} />
                <Tooltip content={<CTip />} />
                <Area type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={2} fill="url(#gg)" name="New" dot={total > 0 ? { r: isMobile ? 2 : 3, fill: "#14b8a6", stroke: "var(--color-bg-primary)", strokeWidth: 2 } : false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      
        {/* Status */}
        <Card title="Registration Status" sub={sd.filter(d => d.value > 0).length + " statuses"} icon={<BarChart3 size={16} />}>
          <div style={{ height: 200 }} className="sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={displaySD} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                  {displaySD.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CTip />} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="status-legend" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
            {sd.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, boxShadow: `0 0 0 2px ${d.color}20` }} />
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{d.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Secondary Chart Row ── */}
      <div style={{ display: "grid", gap: 16, marginBottom: 20 }} className="sm:gap-4 lg:grid-cols-2">
        {/* Region */}
        <Card title="Enrollment by Region" sub={`${deepData.length} states · ${deepData.filter((d,i,a)=>a.findIndex(x=>x.shortCode===d.shortCode)===i).length} countries`} icon={<BarChart3 size={16} />}>
          <div
            style={{
              position: "relative",
              borderRadius: 8,
              overflow: "hidden",
              minHeight: 240,
              background: "var(--color-bg-tertiary)",
            }}
          >
            {deepData.length === 0 ? (
              <div style={{ position: "relative", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>No data</span>
              </div>
            ) : (
              <div style={{ position: "relative", height: Math.max(240, deepData.length * 30 + 10) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deepData}
                    margin={{ top: 4, right: isMobile ? 4 : 20, left: isMobile ? 4 : 8, bottom: 0 }}
                    layout="vertical"
                    barCategoryGap={3}
                  >
                    <CartesianGrid stroke="var(--color-border-default)" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={false} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="yLabel"
                      axisLine={false}
                      tickLine={false}
                      width={isMobile ? 44 : 60}
                      tick={(props: any) => {
                        const { x, y, payload } = props;
                        const item = deepData.find(d => d.yLabel === payload.value);
                        const label = item?.shortCode || payload.value;
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text
                              x={-6}
                              y={0}
                              dy={4}
                              textAnchor="end"
                              fill="var(--color-text-primary)"
                              fontSize={isMobile ? 9 : 10}
                              fontWeight={600}
                              fontFamily="var(--font-sans)"
                            >
                              {label}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <Tooltip cursor={{ fill: "transparent" }} content={<CTip />} />
                    <Bar
                      dataKey="count"
                      radius={[0, 4, 4, 0]}
                      name="Students"
                      barSize={isMobile ? 16 : 20}
                      isAnimationActive={false}
                      label={{
                        position: "center",
                        fill: "#f8fafc",
                        fontSize: isMobile ? 8 : 9,
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        content: (props: any) => {
                          const { index, x, y, width, height } = props;
                          const item = deepData[index];
                          if (!item) return null;
                          const flagW = isMobile ? 14 : 20;
                          const flagH = isMobile ? 10 : 14;
                          const flagX = x + 5;
                          const flagY = y + height / 2 - flagH / 2;
                          const labelX = flagX + flagW + (isMobile ? 3 : 7);
                          const label = isMobile
                            ? `${item.state.length > 6 ? item.state.slice(0, 5) + "…" : item.state} (${item.count})`
                            : `${item.state} (${item.count})`;
                          return (
                            <g>
                              {item.flagUrl && (
                                <image
                                  href={item.flagUrl}
                                  x={flagX}
                                  y={flagY}
                                  width={flagW}
                                  height={flagH}
                                  preserveAspectRatio="xMidYMid meet"
                                  style={{ borderRadius: 2, outline: "1px solid rgba(255,255,255,0.3)" }}
                                />
                              )}
                              <text
                                x={labelX}
                                y={y + height / 2}
                                fill="#f8fafc"
                                fontSize={isMobile ? 8 : 9}
                                fontWeight={700}
                                fontFamily="var(--font-mono)"
                                textAnchor="start"
                                dominantBaseline="central"
                              >
                                {label}
                              </text>
                            </g>
                          );
                        },
                      }}
                    >
                      {deepData.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={e.fillOpacity} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Analytics */}
        <Card title="Payment Analytics" sub={`${transactions.length} tx`} icon={<DollarSign size={16} />}>
          {paymentProfiles.length === 0 ? (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>No data</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Stats row — two centered cards */}
              <div className="payment-stats-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  background: "var(--color-bg-tertiary)", 
                  borderRadius: 12, 
                  padding: "16px 12px", 
                  textAlign: "center",
                  transition: "all 0.15s",
                  boxShadow: "var(--shadow-sm)",
                }}>
                  <p style={{ 
                    fontSize: 11, 
                    color: "var(--color-text-tertiary)", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.06em", 
                    margin: "0 0 8px", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6, 
                    justifyContent: "center",
                    fontWeight: 600,
                  }}>
                    Collected
                    <button 
                      onClick={() => setShowCollected(!showCollected)}
                      style={{ 
                        background: "transparent", 
                        border: "none", 
                        cursor: "pointer", 
                        padding: 2, 
                        color: "var(--color-text-tertiary)", 
                        display: "inline-flex", 
                        lineHeight: 1,
                        transition: "all 0.15s",
                      }}
                    >
                      {showCollected ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </p>
                  <p style={{ 
                    fontSize: 18, 
                    fontWeight: 700, 
                    color: "#fde68a", 
                    margin: 0, 
                    fontFamily: "var(--font-mono)", 
                    lineHeight: 1.3,
                    letterSpacing: "-0.02em",
                  }}>
                    {showCollected ? fmt(collected) : "₦••••••"}
                  </p>
                </div>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  background: "var(--color-bg-tertiary)", 
                  borderRadius: 12, 
                  padding: "16px 12px", 
                  textAlign: "center",
                  transition: "all 0.15s",
                  boxShadow: "var(--shadow-sm)",
                }}>
                  <p style={{ 
                    fontSize: 11, 
                    color: "var(--color-text-tertiary)", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.06em", 
                    margin: "0 0 8px", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 6, 
                    justifyContent: "center",
                    fontWeight: 600,
                  }}>
                    Outstanding
                    <button 
                      onClick={() => setShowOutstanding(!showOutstanding)}
                      style={{ 
                        background: "transparent", 
                        border: "none", 
                        cursor: "pointer", 
                        padding: 2, 
                        color: "var(--color-text-tertiary)", 
                        display: "inline-flex", 
                        lineHeight: 1,
                        transition: "all 0.15s",
                      }}
                    >
                      {showOutstanding ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </p>
                  <p style={{ 
                    fontSize: 18, 
                    fontWeight: 700, 
                    color: "#f59e0b", 
                    margin: 0, 
                    fontFamily: "var(--font-mono)", 
                    lineHeight: 1.3,
                    letterSpacing: "-0.02em",
                  }}>
                    {showOutstanding ? fmt(outstanding) : "₦••••••"}
                  </p>
                </div>
              </div>

              {/* Daily trend */}
              {dailyPayments.some(d => d.count > 0) && (
                <div style={{ height: 60 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyPayments} margin={{ top: 2, right: 2, left: -16, bottom: 0 }}>
                      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15} /><stop offset="95%" stopColor="#14b8a6" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid stroke="var(--color-border-default)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 9, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip content={<CTip />} />
                      <Area type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={2} fill="url(#pg)" name="Amount" dot={{ r: 2, fill: "#14b8a6", stroke: "var(--color-bg-primary)", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Latest */}
              {transactions.length > 0 && (
                <div style={{ 
                  background: "var(--color-bg-tertiary)", 
                  borderRadius: 10, 
                  padding: "10px 14px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  transition: "all 0.15s",
                  boxShadow: "var(--shadow-sm)",
                }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                    Latest: <strong style={{ color: "#22c55e", fontFamily: "var(--font-mono)", fontWeight: 600 }}>₦{transactions[0].amount.toLocaleString()}</strong> via {transactions[0].payment_method}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{nDate(transactions[0].created_at)}</span>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* ── Recently Registered ── */}
      {recentStudents.length > 0 && (
        <div style={{ 
          background: "var(--color-bg-elevated)", 
          borderRadius: 14, 
          padding: 20, 
          marginBottom: 20,
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 10, 
              background: "var(--color-bg-tertiary)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "var(--color-text-secondary)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <Users size={18} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
              Recently Registered
              <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 400, marginLeft: 8 }}>({recentTotal})</span>
            </span>
            <Link 
              href="/admin/students" 
              style={{ 
                marginLeft: "auto", 
                fontSize: 12, 
                color: "var(--color-accent-teal)", 
                fontFamily: "var(--font-mono)", 
                textDecoration: "none", 
                cursor: "pointer", 
                fontWeight: 500, 
                opacity: 0.9,
                transition: "all 0.15s",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              See all
              <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentStudents.map((s, idx) => (
              <div 
                key={s.id} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 14, 
                  padding: "12px 14px", 
                  borderRadius: 10, 
                  background: "var(--color-bg-tertiary)", 
                  transition: "all 0.15s",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <span style={{ 
                  fontSize: 11, 
                  fontWeight: 600, 
                  color: "var(--color-text-tertiary)", 
                  fontFamily: "var(--font-mono)", 
                  flexShrink: 0,
                  minWidth: 24,
                }}>
                  #{recentTotal - idx}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.full_name}</p>
                  <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.course_applying_for}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{nDate(s.created_at)}</span>
                  {idx === 0 && <span style={{ fontSize: 10, fontWeight: 500, color: "var(--color-accent-teal)" }}>Latest</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 6, 
        marginTop: 16, 
        background: "var(--color-bg-secondary)",
        borderRadius: 14,
        padding: 16,
        boxShadow: "var(--shadow-sm)",
      }} className="sm:flex-row sm:justify-between sm:items-center sm:gap-0">
        <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>
          {total} records · {enrolled} enrolled · {pending} pending
        </span>
        <span style={{ fontSize: 11, color: "var(--color-text-disabled)", fontFamily: "var(--font-mono)" }}>
          Beyund LMS v1.0
        </span>
      </div>
    </div>
  );
}

/* ── Components ── */

function Kpi({ icon, label, value, sub, href, onToggle, showEye, valueColor }: any) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ 
        background: "var(--color-bg-elevated)", 
        borderRadius: 14, 
        padding: "16px 18px",
        transition: "all 0.2s",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {showEye !== undefined && onToggle && (
              <button 
                onClick={e => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
                style={{ 
                  background: "transparent", 
                  border: "none", 
                  cursor: "pointer", 
                  padding: 4, 
                  color: "var(--color-text-tertiary)", 
                  display: "flex",
                  borderRadius: 6,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-bg-tertiary)";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-text-tertiary)";
                }}
              >
                {showEye ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
            <span style={{ 
              color: "var(--color-accent-teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--color-bg-tertiary)",
              boxShadow: "var(--shadow-sm)",
            }}>
              {icon}
            </span>
          </div>
        </div>
        <p style={{ fontSize: 26, fontWeight: 700, color: valueColor || "var(--color-text-primary)", margin: 0, fontFamily: "var(--font-mono)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>{value}</p>
        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "4px 0 0", fontWeight: 500 }}>{sub}</p>
      </div>
    </Link>
  );
}

function Card({ title, sub, icon, children }: any) {
  return (
    <div style={{ 
      background: "var(--color-bg-elevated)", 
      borderRadius: 14, 
      padding: 20,
      boxShadow: "var(--shadow-sm)",
      transition: "all 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ 
          color: "var(--color-accent-teal)", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "var(--color-bg-tertiary)",
          boxShadow: "var(--shadow-sm)",
        }}>
          {icon}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{title}</span>
        <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: "auto", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{sub}</span>
      </div>
      {children}
    </div>
  );
}

function CTip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div style={{ 
      background: "var(--color-bg-elevated)", 
      borderRadius: 10, 
      padding: "10px 14px", 
      boxShadow: "var(--shadow-lg)",
    }}>
      {label && <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "0 0 4px", fontWeight: 500 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", margin: 0, fontFamily: "var(--font-mono)" }}>
          {p.name}: {typeof p.value === "number" && p.value > 100000 ? `₦${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}

function SBadge({ status }: any) {
  const map: Record<string, string> = {
    enrolled: "#10b981", pending: "#f59e0b", contacted: "#3b82f6", rejected: "#ef4444",
  };
  return (
    <span style={{ 
      fontSize: 11, 
      fontWeight: 600, 
      color: map[status] || "var(--color-text-tertiary)", 
      textTransform: "uppercase", 
      letterSpacing: "0.04em", 
      fontFamily: "var(--font-mono)",
    }}>
      {status}
    </span>
  );
}