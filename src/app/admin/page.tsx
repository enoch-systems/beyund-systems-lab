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
  return d.toLocaleString("en-NG", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
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
  const { theme } = useTheme();
  const C = getColors(theme);

  useEffect(() => { document.title = "Admin LMS — Beyund Labs Academy"; }, []);

  useEffect(() => {
    const i = setInterval(() => setNow(ts()), 30000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: c }, { data: p }, { data: tx }, { data: n }] = await Promise.all([
        supabase.from("student_registrations").select("*").order("created_at", { ascending: false }),
        supabase.from("courses").select("*").order("created_at", { ascending: false }),
        supabase.from("student_payment_profiles").select("*"),
        supabase.from("payments").select("*").order("created_at", { ascending: false }),
        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(10),
      ]);
      if (s) { setStudents(s as Student[]); setPrevTotal(s.length); }
      if (c) setCourses(c as Course[]);
      if (p) setPaymentProfiles(p as PaymentProfile[]);
      if (tx) setTransactions(tx as PaymentTx[]);
      if (n) setNotifications(n as Notification[]);
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

  // ── Region Data (enrolled only, custom order) ──
  const enrolledStudents = students.filter(s => s.status === "enrolled");
  const rc: Record<string, number> = {};
  enrolledStudents.forEach(s => { const r = s.state || "Unknown"; rc[r] = (rc[r] || 0) + 1; });
  const customOrder = ["Owerri", "Abia", "Enugu", "Lagos", "Rivers", "Anambra"];
  const rd = Object.entries(rc)
    .sort((a, b) => {
      const ia = customOrder.indexOf(a[0]);
      const ib = customOrder.indexOf(b[0]);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return b[1] - a[1];
    })
    .slice(0, 5)
    .map(([region, count]) => ({ region, count }));
  const maxC = Math.max(...rd.map(d => d.count), 1);
  const regionData = rd.map(d => ({ ...d, fill: C.teal, fillOpacity: 0.25 + (d.count / maxC) * 0.55 }));

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

  // ── Methods ──
  const methods = [
    { method: "Transfer", count: 10 },
    { method: "POS", count: 1 },
  ];
  const MCOLORS: Record<string, string> = { Transfer: C.accent, Card: "#a855f7", Pos: C.green, Cash: C.amber, Ussd: C.red };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[100vh]" style={{ background: C.bg }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border border-t-transparent animate-spin" style={{ borderColor: C.dim, borderTopColor: C.teal }} />
        <p className="text-xs" style={{ color: C.muted }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "16px", fontFamily: "'Inter','SF Pro',system-ui,sans-serif" }}>

      {/* ── Top Bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: "-0.01em" }}>Beyund Academy</span>
          <span style={{ fontSize: 11, color: C.muted, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{now}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
        <Kpi icon={<GraduationCap size={13} />} label="Students" value={String(total)} sub={`${enrolled} enrolled`} href="/admin/students" C={C} />
        <Kpi icon={<BookOpen size={13} />} label="Courses" value={String(activeCourses)} sub={`${courses.length} total`} href="/admin/courses" C={C} />
        <Kpi icon={<DollarSign size={13} />} label="Revenue" value={showRevenue ? fmt(collected) : "₦••••••"} sub={showRevenue ? `${paymentProfiles.filter(p => p.payment_status === "paid").length} paid` : "••••• paid"} href="/admin/payments" onToggle={() => { setShowRevenue(!showRevenue); setShowCollected(!showRevenue); }} showEye={showRevenue} valueColor="#fde68a" C={C} />
        <Kpi icon={<Bell size={13} />} label="Activity" value={String(notifications.length)} sub={`${unread} unread`} href="/admin/notifications" C={C} />
      </div>

      {/* ── Main Chart Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {/* Growth */}
        <Card title="Registrations" sub="14d" icon={<TrendingUp size={12} />} C={C}>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gd} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.teal} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} interval={1} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CTip C={C} />} />
                <Area type="monotone" dataKey="count" stroke={C.teal} strokeWidth={1.5} fill="url(#gg)" name="New" dot={total > 0 ? { r: 2, fill: C.teal, stroke: "none" } : false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      
        {/* Status */}
        <Card title="Registration Status" sub={sd.filter(d => d.value > 0).length + " statuses"} icon={<BarChart3 size={12} />} C={C}>
          <div style={{ height: 160, display: "flex", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={displaySD} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                  {displaySD.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CTip C={C} />} />
              </RePieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 8 }}>
              {sd.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color }} />
                  <span style={{ fontSize: 10, color: C.muted }}>{d.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.text, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Secondary Chart Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {/* Region */}
        <Card title="Enrollment by Region" sub="Top 5 states" icon={<BarChart3 size={12} />} C={C}>
          {regionData.length === 0 ? (
            <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: C.muted }}>No data</span>
            </div>
          ) : (
            <div style={{ height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} layout="vertical">
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={false} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="region" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} width={75} />
                  <Tooltip content={<CTip C={C} />} />
                  <Bar dataKey="count" radius={[0, 2, 2, 0]} name="Students" barSize={14} label={{ position: 'center', fill: '#f8fafc', fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>
                    {regionData.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={e.fillOpacity} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
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
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 8 }}>
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                  {[
                    { label: "Collected", val: fmt(collected), color: "#fde68a" },
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

              {/* Methods */}
              {methods.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {methods.map(m => (
                    <div key={m.method} style={{ display: "flex", alignItems: "center", gap: 4, background: C.card, borderRadius: 3, padding: "3px 6px", border: `1px solid ${C.border}` }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: MCOLORS[m.method] || C.muted }} />
                      <span style={{ fontSize: 9, color: C.text, fontWeight: 500 }}>{m.method}</span>
                      <span style={{ fontSize: 8, color: C.muted, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{m.count}</span>
                    </div>
                  ))}
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

      {/* ── Footer ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 0", marginTop: 12, borderTop: `1px solid ${C.border}` }}>
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
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: 10 }}>
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