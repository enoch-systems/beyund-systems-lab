"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Wallet,
  Bell,
  ChevronRight,
  UserPlus,
  CreditCard,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CalendarDays,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
type Student = {
  id: string; full_name: string; email: string; course_applying_for: string;
  status: string; country: string; created_at: string;
};

type Course = { id: string; title: string; total_weeks: number; status: string };
type PaymentProfile = { id: string; student_id: string; total_fee: number; amount_paid: number; balance: number; payment_status: string };
type Notification = { id: string; title: string; message: string; category: string; status: string; created_at: string };

/* ═══════════════════════════════════════
   Helpers
   ═══════════════════════════════════════ */
function getGreeting(): string {
  const now = new Date();
  const nigeriaTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
  const h = nigeriaTime.getHours();
  if (h >= 4 && h < 12) return "Good morning";
  if (h >= 12 && h < 16) return "Good afternoon";
  return "Good evening";
}

function formatCurrency(amount: number): string { return `₦${amount.toLocaleString()}`; }
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const COLORS = {
  enrolled: "#30d158", contacted: "#0a84ff", pending: "#ff9f0a", rejected: "#ff453a",
  violet: "#8940fa", emerald: "#30d158", amber: "#ff9f0a", blue: "#0a84ff",
};

/* ═══════════════════════════════════════
   Custom Tooltip
   ═══════════════════════════════════════ */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-[#1c1c1e] border border-neutral-200 dark:border-neutral-800 rounded-[10px] shadow-lg px-3 py-2">
      <p className="text-[11px] text-neutral-500 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-[12px] font-medium text-neutral-900 dark:text-white">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   Dashboard Page
   ═══════════════════════════════════════ */
export default function AdminDashboardPage() {
  const supabase = createSupabaseBrowserClient();

  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);

  // Raw data
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [paymentProfiles, setPaymentProfiles] = useState<PaymentProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    document.title = "Admin LMS — Beyund Labs Academy";
    async function loadAll() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const { data: settings } = await supabase.from("admin_settings").select("value").eq("key", "admin_name").single();
        if (settings?.value) setAdminName(settings.value);
        else setAdminName(session.user.email.split("@")[0].charAt(0).toUpperCase() + session.user.email.split("@")[0].slice(1));
      }

      const [{ data: s }, { data: c }, { data: p }, { data: n }] = await Promise.all([
        supabase.from("student_registrations").select("*").order("created_at", { ascending: false }),
        supabase.from("courses").select("*").order("created_at", { ascending: false }),
        supabase.from("student_payment_profiles").select("*"),
        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      if (s) setStudents(s as Student[]);
      if (c) setCourses(c as Course[]);
      if (p) setPaymentProfiles(p as PaymentProfile[]);
      if (n) setNotifications(n as Notification[]);
      setLoading(false);
    }
    loadAll();
  }, [supabase]);

  /* ── Metrics ── */
  const totalStudents = students.length;
  const enrolledStudents = students.filter((s) => s.status === "enrolled").length;
  const pendingStudents = students.filter((s) => s.status === "pending").length;
  const contactedStudents = students.filter((s) => s.status === "contacted").length;
  const rejectedStudents = students.filter((s) => s.status === "rejected").length;

  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.status === "active").length;

  const totalCollected = paymentProfiles.reduce((sum, p) => sum + p.amount_paid, 0);
  const totalOutstanding = paymentProfiles.reduce((sum, p) => sum + p.balance, 0);
  const fullyPaid = paymentProfiles.filter((p) => p.payment_status === "paid").length;
  const installmentCount = paymentProfiles.filter((p) => p.payment_status === "installment").length;

  const unreadNotifs = notifications.filter((n) => n.status === "unread").length;

  /* ── Status Breakdown for Pie ── */
  const statusData = [
    { name: "Enrolled", value: enrolledStudents, color: COLORS.enrolled },
    { name: "Contacted", value: contactedStudents, color: COLORS.contacted },
    { name: "Pending", value: pendingStudents, color: COLORS.pending },
    { name: "Rejected", value: rejectedStudents, color: COLORS.rejected },
  ];

  /* ── Students per Course for Bar ── */
  const courseCounts: Record<string, number> = {};
  students.forEach((s) => {
    courseCounts[s.course_applying_for] = (courseCounts[s.course_applying_for] || 0) + 1;
  });
  const courseData = Object.entries(courseCounts)
    .map(([course, count]) => ({ course: course.length > 20 ? course.slice(0, 20) + "…" : course, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  /* ── Registrations over Time (daily, last 14 days) ── */
  const last14Days: { date: string; count: number; label: string }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-NG", { weekday: "short", day: "numeric" });
    const count = students.filter((s) => s.created_at?.startsWith(dateStr)).length;
    last14Days.push({ date: dateStr, count, label });
  }

  /* ── Payment Analytics ── */
  const totalFees = paymentProfiles.reduce((sum, p) => sum + p.total_fee, 0);
  const paymentChartData = [
    { name: "Collected", amount: totalCollected, fill: COLORS.emerald },
    { name: "Outstanding", amount: totalOutstanding, fill: COLORS.amber },
    { name: "Total Fees", amount: totalFees, fill: COLORS.violet },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white animate-spin" />
          <p className="text-sm text-neutral-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ──────── HEADER ──────── */}
      <div>
        <h1 className="text-[28px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
          {getGreeting()}, {adminName}
        </h1>
        <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">Here's your analytics overview.</p>
      </div>

      {/* ──────── KPI GRID ──────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard icon={<Users className="w-4 h-4" />} label="Total Students" value={String(totalStudents)} subtitle={`${enrolledStudents} enrolled`} color="text-neutral-900 dark:text-white" href="/admin/students" />
        <KpiCard icon={<BookOpen className="w-4 h-4" />} label="Active Courses" value={String(activeCourses)} subtitle={`${totalCourses} total`} color="text-violet-600 dark:text-violet-400" href="/admin/courses" />
        <KpiCard icon={<Wallet className="w-4 h-4" />} label="Total Collected" value={formatCurrency(totalCollected)} subtitle={`${fullyPaid} paid · ${installmentCount} installments`} color="text-emerald-600 dark:text-emerald-400" href="/admin/payments" />
        <KpiCard icon={<Bell className="w-4 h-4" />} label="Notifications" value={String(notifications.length)} subtitle={`${unreadNotifs} unread`} color="text-amber-600 dark:text-amber-400" href="/admin/notifications" />
      </div>

      {/* ──────── CHARTS ROW 1 ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Student Growth Trend */}
        <ChartCard icon={<TrendingUp className="w-4 h-4" />} title="Student Growth" subtitle="Daily registrations (14 days)">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last14Days} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.violet} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={COLORS.violet} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" className="dark:opacity-20" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} interval={1} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="count" stroke={COLORS.violet} strokeWidth={2} fill="url(#growthGrad)" name="Registrations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Registration Status */}
        <ChartCard icon={<PieChart className="w-4 h-4" />} title="Registration Status" subtitle="Breakdown of all applicants">
          <div className="h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={30}
                  formatter={(value: string) => (
                    <span className="text-[11px] text-neutral-500">{value}</span>
                  )}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ──────── CHARTS ROW 2 ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Enrollment per Course */}
        <ChartCard icon={<BarChart3 className="w-4 h-4" />} title="Enrollment by Course" subtitle="Students per course">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" className="dark:opacity-20" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="course" tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" fill={COLORS.blue} radius={[0, 4, 4, 0]} name="Students" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Payment Analytics */}
        <ChartCard icon={<Wallet className="w-4 h-4" />} title="Payment Analytics" subtitle="Collected vs Outstanding">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" className="dark:opacity-20" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} name="Amount (₦)" barSize={40}>
                  {paymentChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ──────── BOTTOM ROW ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Recent Registrations */}
        <div className="lg:col-span-3 rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] overflow-hidden">
          <SectionHeader icon={<Activity className="w-4 h-4" />} title="Recent Registrations" subtitle="Latest applicants" href="/admin/students" />
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-5">
              <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-neutral-400" />
              </div>
              <p className="text-[15px] font-medium text-neutral-500">No registrations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {students.slice(0, 5).map((student) => (
                <Link key={student.id} href="/admin/students"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors duration-150">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                    {getInitials(student.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-neutral-900 dark:text-white truncate">{student.full_name}</p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">{student.course_applying_for}</p>
                  </div>
                  <StatusBadge status={student.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}  
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {/* Courses Summary */}
          <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[8px] bg-violet-500/10 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">Courses</h3>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Quick overview</p>
                </div>
              </div>
              <Link href="/admin/courses" className="text-[11px] font-medium text-blue-500 hover:underline flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-2">
              <RowItem label="Total Courses" value={String(totalCourses)} />
              <RowItem label="Active" value={String(activeCourses)} color="text-emerald-600 dark:text-emerald-400" />
              <RowItem label="Total Weeks" value={String(courses.reduce((s, c) => s + c.total_weeks, 0))} color="text-amber-600 dark:text-amber-400" />
              <RowItem label="Total Students" value={String(totalStudents)} color="text-violet-600 dark:text-violet-400" />
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[8px] bg-amber-500/10 flex items-center justify-center"><Bell className="w-3.5 h-3.5 text-amber-500" /></div>
                <div>
                  <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">Notifications</h3>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Latest updates</p>
                </div>
              </div>
              <Link href="/admin/notifications" className="text-[11px] font-medium text-blue-500 hover:underline flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-[13px] text-neutral-400 text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 4).map((n) => (
                  <Link key={n.id} href="/admin/notifications"
                    className={`flex items-start gap-3 p-2.5 rounded-[10px] transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/30 ${n.status === "unread" ? "bg-neutral-50 dark:bg-neutral-800/20" : ""}`}>
                    <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 ${
                      n.category === "student" ? "bg-violet-500/10 text-violet-500" :
                      n.category === "payment" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                    }`}>
                      {n.category === "student" ? <UserPlus className="w-3.5 h-3.5" /> :
                       n.category === "payment" ? <CreditCard className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-neutral-900 dark:text-white truncate">{n.title}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{timeAgo(n.created_at)}</p>
                    </div>
                    {n.status === "unread" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between py-3 border-t border-neutral-200/40 dark:border-neutral-800/30">
        <span className="text-[12px] text-neutral-400"><span className="font-medium text-neutral-700 dark:text-neutral-300">{totalStudents}</span> total registrations</span>
        <div className="flex items-center gap-4">
          <FooterDot label="Enrolled" count={enrolledStudents} color="bg-emerald-500" />
          <FooterDot label="Pending" count={pendingStudents} color="bg-amber-500" />
          <FooterDot label="Courses" count={totalCourses} color="bg-violet-500" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════ */
function KpiCard({ icon, label, value, subtitle, color, href }: {
  icon: React.ReactNode; label: string; value: string; subtitle: string; color: string; href: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5 transition-all hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500">{label}</span>
          <div className="w-8 h-8 rounded-[10px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:scale-105 transition-transform">{icon}</div>
        </div>
        <p className={`text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] ${color}`}>{value}</p>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">{subtitle}</p>
      </div>
    </Link>
  );
}

function ChartCard({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-[8px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">{icon}</div>
        <div>
          <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">{title}</h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, href }: { icon: React.ReactNode; title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-[8px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">{icon}</div>
        <div>
          <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{subtitle}</p>}
        </div>
      </div>
      {href && (
        <Link href={href} className="text-[11px] font-medium text-blue-500 hover:underline flex items-center gap-0.5">
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    enrolled: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-[6px] ${styles[status] || "bg-neutral-500/10 text-neutral-500"}`}>{status}</span>;
}

function RowItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-neutral-100 dark:bg-neutral-800/50">
      <span className="text-[12px] text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className={`text-[13px] font-semibold ${color || "text-neutral-900 dark:text-white"}`}>{value}</span>
    </div>
  );
}

function FooterDot({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-neutral-500">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {count} {label.toLowerCase()}
    </span>
  );
}