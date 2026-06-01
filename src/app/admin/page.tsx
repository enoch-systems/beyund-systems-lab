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
  GraduationCap,
  DollarSign,
  Layers,
  Clock,
} from "lucide-react";
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
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

function formatCurrency(amount: number): string {
  if (amount === 0) return "₦0";
  return `₦${amount.toLocaleString()}`;
}

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
  surface: "#f2f2f7", darkSurface: "#2c2c2e",
};

/* ═══════════════════════════════════════
   Dashboard Page
   ═══════════════════════════════════════ */
export default function AdminDashboardPage() {
  const supabase = createSupabaseBrowserClient();
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [paymentProfiles, setPaymentProfiles] = useState<PaymentProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prevTotal, setPrevTotal] = useState(0);

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

      if (s) {
        setStudents(s as Student[]);
        setPrevTotal((s as Student[]).length);
      }
      if (c) setCourses(c as Course[]);
      if (p) setPaymentProfiles(p as PaymentProfile[]);
      if (n) setNotifications(n as Notification[]);
      setLoading(false);
    }
    loadAll();
  }, [supabase]);

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

  const hasStudents = totalStudents > 0;
  const hasPayments = paymentProfiles.length > 0;
  const trend = prevTotal > 0 ? ((totalStudents - prevTotal) / prevTotal * 100).toFixed(1) : "0";

  /* ── Chart Data ── */
  const statusData = [
    { name: "Enrolled", value: enrolledStudents || 0, color: COLORS.enrolled },
    { name: "Contacted", value: contactedStudents || 0, color: COLORS.contacted },
    { name: "Pending", value: pendingStudents || 0, color: COLORS.pending },
    { name: "Rejected", value: rejectedStudents || 0, color: COLORS.rejected },
  ].filter((d) => d.value > 0);

  // If no students, show a placeholder status
  const displayStatusData = hasStudents ? statusData : [{ name: "No Data", value: 1, color: "#e5e5ea" }];

  const courseCounts: Record<string, number> = {};
  students.forEach((s) => {
    courseCounts[s.course_applying_for] = (courseCounts[s.course_applying_for] || 0) + 1;
  });
  const courseData = Object.entries(courseCounts)
    .map(([course, count]) => ({ course: course.length > 18 ? course.slice(0, 18) + "…" : course, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const last14Days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-NG", { weekday: "short", day: "numeric" });
    const count = students.filter((s) => s.created_at?.startsWith(dateStr)).length;
    last14Days.push({ date: dateStr, count, label });
  }

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
    <div className="space-y-5 sm:space-y-7">
      {/* ──────── HEADER ──────── */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
              {getGreeting()}, {adminName}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
              <ArrowUpRight className="w-3 h-3" />
              {trend}%
            </span>
          </div>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">
            {totalStudents} total student{totalStudents !== 1 ? "s" : ""} · {activeCourses} active course{activeCourses !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ──────── KPI GRID ──────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={<GraduationCap className="w-4 h-4" />}
          label="Students"
          value={String(totalStudents)}
          trend={`${enrolledStudents} enrolled`}
          color="text-neutral-900 dark:text-white"
          href="/admin/students"
        />
        <KpiCard
          icon={<BookOpen className="w-4 h-4" />}
          label="Courses"
          value={String(activeCourses)}
          trend={`${totalCourses} total`}
          color="text-violet-600 dark:text-violet-400"
          href="/admin/courses"
        />
        <KpiCard
          icon={<DollarSign className="w-4 h-4" />}
          label="Revenue"
          value={formatCurrency(totalCollected)}
          trend={`${fullyPaid} paid`}
          color="text-emerald-600 dark:text-emerald-400"
          href="/admin/payments"
        />
        <KpiCard
          icon={<Bell className="w-4 h-4" />}
          label="Activity"
          value={String(notifications.length)}
          trend={`${unreadNotifs} unread`}
          color="text-amber-600 dark:text-amber-400"
          href="/admin/notifications"
        />
      </div>

      {/* ──────── CHARTS SECTION ──────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-violet-500" />
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">Analytics</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Student Growth */}
          <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-[10px] bg-violet-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">Student Growth</p>
                <p className="text-[11px] text-neutral-400">Last 14 days</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">{totalStudents}</p>
                <p className="text-[10px] text-neutral-400">Total</p>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last14Days} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.violet} stopOpacity={0.12} />
                      <stop offset="95%" stopColor={COLORS.violet} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" className="dark:opacity-20" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} interval={1} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" stroke={COLORS.violet} strokeWidth={2} fill="url(#growthGrad)" name="Registrations" dot={hasStudents ? { r: 3, fill: COLORS.violet, stroke: "white", strokeWidth: 2 } : false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Registration Status */}
          <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-[10px] bg-blue-500/10 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">Registration Status</p>
                <p className="text-[11px] text-neutral-400">Status breakdown</p>
              </div>
            </div>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={displayStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {displayStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={25}
                    formatter={(value: string) => <span className="text-[11px] text-neutral-500">{value}</span>}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            {!hasStudents && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-[13px] text-neutral-400 bg-white/80 dark:bg-[#1c1c1e]/80 px-3 py-1 rounded-[8px]">No data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ──────── SECONDARY CHARTS ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Enrollment by Course */}
        <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-[10px] bg-amber-500/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">Enrollment by Course</p>
              <p className="text-[11px] text-neutral-400">Students per course</p>
            </div>
          </div>
          {courseData.length === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-center">
              <Layers className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
              <p className="text-[13px] text-neutral-400">No enrollments yet</p>
            </div>
          ) : (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" className="dark:opacity-20" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="course" tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={COLORS.blue} radius={[0, 4, 4, 0]} name="Students" barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Payment Analytics */}
        <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-[10px] bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">Payment Analytics</p>
              <p className="text-[11px] text-neutral-400">Collected vs Outstanding</p>
            </div>
          </div>
          {!hasPayments ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-center">
              <Wallet className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
              <p className="text-[13px] text-neutral-400">No payment data yet</p>
            </div>
          ) : (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" className="dark:opacity-20" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#86868b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} name="Amount" barSize={36}>
                    {paymentChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ──────── BOTTOM ROW ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Recent Registrations */}
        <div className="lg:col-span-3 rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">Recent</p>
                <p className="text-[11px] text-neutral-400">Latest applicants</p>
              </div>
            </div>
            <Link href="/admin/students" className="text-[11px] font-medium text-blue-500 hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-5">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-[14px] font-medium text-neutral-500">No registrations yet</p>
              <p className="text-[12px] text-neutral-400 mt-1">New applicants will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {students.slice(0, 5).map((student) => (
                <Link key={student.id} href="/admin/students"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                    {getInitials(student.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-neutral-900 dark:text-white truncate">{student.full_name}</p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">{student.course_applying_for}</p>
                  </div>
                  <StatusBadge status={student.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-3">
          {/* Courses Summary */}
          <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[8px] bg-violet-500/10 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">Courses</p>
                  <p className="text-[11px] text-neutral-400">Overview</p>
                </div>
              </div>
              <Link href="/admin/courses" className="text-[11px] font-medium text-blue-500 hover:underline">View all</Link>
            </div>
            <div className="space-y-1.5">
              <MetricRow label="Total" value={String(totalCourses)} />
              <MetricRow label="Active" value={String(activeCourses)} color="text-emerald-600" />
              <MetricRow label="Weeks" value={String(courses.reduce((s, c) => s + c.total_weeks, 0))} color="text-amber-600" />
              <MetricRow label="Students" value={String(totalStudents)} color="text-violet-600" />
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[8px] bg-amber-500/10 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">Notifications</p>
                  <p className="text-[11px] text-neutral-400">Latest</p>
                </div>
              </div>
              <Link href="/admin/notifications" className="text-[11px] font-medium text-blue-500 hover:underline">View all</Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-[13px] text-neutral-400 text-center py-4">No notifications yet</p>
            ) : (
              <div className="space-y-1.5">
                {notifications.slice(0, 4).map((n) => (
                  <Link key={n.id} href="/admin/notifications"
                    className={`flex items-start gap-2.5 p-2 rounded-[8px] transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/30 ${n.status === "unread" ? "bg-neutral-50 dark:bg-neutral-800/20" : ""}`}>
                    <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 ${
                      n.category === "student" ? "bg-violet-500/10 text-violet-500" :
                      n.category === "payment" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                    }`}>
                      {n.category === "student" ? <UserPlus className="w-3 h-3" /> :
                       n.category === "payment" ? <CreditCard className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-neutral-900 dark:text-white truncate leading-tight">{n.title}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{timeAgo(n.created_at)}</p>
                    </div>
                    {n.status === "unread" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1" />}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between py-2.5 border-t border-neutral-200/40 dark:border-neutral-800/30">
        <span className="text-[11px] text-neutral-400">
          <span className="font-medium text-neutral-600 dark:text-neutral-300">{totalStudents}</span> total registrations
        </span>
        <div className="flex items-center gap-3">
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

function KpiCard({ icon, label, value, trend, color, href }: {
  icon: React.ReactNode; label: string; value: string; trend: string; color: string; href: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 transition-all hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400">{label}</span>
          <div className="w-7 h-7 rounded-[8px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:scale-105 transition-transform">
            {icon}
          </div>
        </div>
        <p className={`text-[22px] font-semibold tracking-[-0.02em] ${color}`}>{value}</p>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">{trend}</p>
      </div>
    </Link>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-[#1c1c1e] border border-neutral-200 dark:border-neutral-800 rounded-[10px] shadow-lg px-3 py-2">
      {label && <p className="text-[11px] text-neutral-500 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-[12px] font-medium text-neutral-900 dark:text-white">
          {p.name}: {typeof p.value === "number" && p.value > 100000 ? `₦${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
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

function MetricRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-[8px] bg-neutral-50 dark:bg-neutral-800/30">
      <span className="text-[12px] text-neutral-500">{label}</span>
      <span className={`text-[13px] font-semibold ${color || "text-neutral-900 dark:text-white"}`}>{value}</span>
    </div>
  );
}

function FooterDot({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {count} {label.toLowerCase()}
    </span>
  );
}