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
  Clock,
  CheckCircle,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Loader2,
  Sparkles,
} from "lucide-react";
import { apple } from "@/lib/admin-design-system";

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
type Student = {
  id: string;
  full_name: string;
  email: string;
  course_applying_for: string;
  status: string;
  created_at: string;
};

type Course = {
  id: string;
  title: string;
  total_weeks: number;
  status: string;
};

type PaymentProfile = {
  id: string;
  student_id: string;
  total_fee: number;
  amount_paid: number;
  balance: number;
  payment_status: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  category: string;
  status: string;
  created_at: string;
};

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
  return `₦${amount.toLocaleString()}`;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
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
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ═══════════════════════════════════════
   Dashboard Page
   ═══════════════════════════════════════ */
export default function AdminDashboardPage() {
  const supabase = createSupabaseBrowserClient();

  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);

  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [paymentProfiles, setPaymentProfiles] = useState<PaymentProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);

  useEffect(() => {
    document.title = "Admin LMS — Beyund Labs Academy";

    async function loadAll() {
      const { data: { session } } = await supabase.auth.getSession();

      // Admin name
      if (session?.user?.email) {
        const { data: settings } = await supabase
          .from("admin_settings")
          .select("value")
          .eq("key", "admin_name")
          .single();

        if (settings?.value) {
          setAdminName(settings.value);
        } else {
          const prefix = session.user.email.split("@")[0];
          setAdminName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
        }
      }

      // Load all data in parallel
      const [
        { data: studentsData },
        { data: coursesData },
        { data: profilesData },
        { data: notifsData },
      ] = await Promise.all([
        supabase.from("student_registrations").select("*").order("created_at", { ascending: false }),
        supabase.from("courses").select("*").order("created_at", { ascending: false }),
        supabase.from("student_payment_profiles").select("*"),
        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      if (studentsData) {
        setStudents(studentsData as Student[]);
        setRecentStudents((studentsData as Student[]).slice(0, 5));
      }
      if (coursesData) setCourses(coursesData as Course[]);
      if (profilesData) setPaymentProfiles(profilesData as PaymentProfile[]);
      if (notifsData) setNotifications(notifsData as Notification[]);

      setLoading(false);
    }
    loadAll();
  }, [supabase]);

  /* ── Computed metrics ── */
  const totalStudents = students.length;
  const enrolledStudents = students.filter((s) => s.status === "enrolled").length;
  const pendingStudents = students.filter((s) => s.status === "pending").length;

  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.status === "active").length;

  const totalCollected = paymentProfiles.reduce((sum, p) => sum + p.amount_paid, 0);
  const fullyPaid = paymentProfiles.filter((p) => p.payment_status === "paid").length;
  const totalOutstanding = paymentProfiles.reduce((sum, p) => sum + p.balance, 0);

  const unreadNotifs = notifications.filter((n) => n.status === "unread").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white animate-spin" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ──────── HEADER ──────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em] leading-tight">
            {getGreeting()}, <span className="text-neutral-900 dark:text-white">{adminName}</span>
          </h1>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">
            Here's your overview for today.
          </p>
        </div>
      </div>

      {/* ──────── KPI GRID ──────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={<Users className="w-4 h-4" />}
          label="Total Students"
          value={String(totalStudents)}
          subtitle={`${enrolledStudents} enrolled · ${pendingStudents} pending`}
          color="text-neutral-900 dark:text-white"
          href="/admin/students"
        />
        <KpiCard
          icon={<BookOpen className="w-4 h-4" />}
          label="Courses"
          value={String(totalCourses)}
          subtitle={`${activeCourses} active`}
          color="text-violet-600 dark:text-violet-400"
          href="/admin/courses"
        />
        <KpiCard
          icon={<Wallet className="w-4 h-4" />}
          label="Total Collected"
          value={formatCurrency(totalCollected)}
          subtitle={`${fullyPaid} fully paid · ${formatCurrency(totalOutstanding)} outstanding`}
          color="text-emerald-600 dark:text-emerald-400"
          href="/admin/payments"
        />
        <KpiCard
          icon={<Bell className="w-4 h-4" />}
          label="Notifications"
          value={String(notifications.length)}
          subtitle={`${unreadNotifs} unread`}
          color="text-amber-600 dark:text-amber-400"
          href="/admin/notifications"
        />
      </div>

      {/* ──────── BOTTOM ROW ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* ── Registration Activity ── */}
        <div className="lg:col-span-3 rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] overflow-hidden">
          <SectionHeader
            icon={<Activity className="w-4 h-4" />}
            title="Recent Registrations"
            subtitle="Latest applicants"
            href="/admin/students"
          />
          {recentStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-5">
              <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-neutral-400" />
              </div>
              <p className="text-[15px] font-medium text-neutral-500">No registrations yet</p>
              <p className="text-[13px] text-neutral-400 mt-1">New applicants will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {recentStudents.map((student) => (
                <Link
                  key={student.id}
                  href="/admin/students"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors duration-150"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                    {getInitials(student.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-neutral-900 dark:text-white truncate">
                      {student.full_name}
                    </p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                      {student.course_applying_for} · {student.email}
                    </p>
                  </div>
                  <StatusBadge status={student.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column ── */}
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
              <Link href="/admin/courses" className="text-[11px] font-medium text-violet-500 hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-[10px] bg-neutral-100 dark:bg-neutral-800/50">
                <span className="text-[13px] text-neutral-600 dark:text-neutral-400">Total Courses</span>
                <span className="text-[15px] font-semibold text-neutral-900 dark:text-white">{totalCourses}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-[10px] bg-emerald-500/10">
                <span className="text-[13px] text-emerald-600 dark:text-emerald-400">Active</span>
                <span className="text-[15px] font-semibold text-emerald-600 dark:text-emerald-400">{activeCourses}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-[10px] bg-amber-500/10">
                <span className="text-[13px] text-amber-600 dark:text-amber-400">Total Weeks</span>
                <span className="text-[15px] font-semibold text-amber-600 dark:text-amber-400">
                  {courses.reduce((sum, c) => sum + c.total_weeks, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[8px] bg-amber-500/10 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">Notifications</h3>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Latest updates</p>
                </div>
              </div>
              <Link href="/admin/notifications" className="text-[11px] font-medium text-amber-500 hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-[13px] text-neutral-400 text-center py-4">No notifications yet</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 4).map((n) => (
                  <Link
                    key={n.id}
                    href="/admin/notifications"
                    className={`flex items-start gap-3 p-2.5 rounded-[10px] transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/30 ${
                      n.status === "unread" ? "bg-neutral-50 dark:bg-neutral-800/20" : ""
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 ${
                      n.category === "student" ? "bg-violet-500/10 text-violet-500" :
                      n.category === "payment" ? "bg-emerald-500/10 text-emerald-500" :
                      "bg-blue-500/10 text-blue-500"
                    }`}>
                      {n.category === "student" ? <UserPlus className="w-3.5 h-3.5" /> :
                       n.category === "payment" ? <CreditCard className="w-3.5 h-3.5" /> :
                       <Bell className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-neutral-900 dark:text-white truncate">{n.title}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{timeAgo(n.created_at)}</p>
                    </div>
                    {n.status === "unread" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer Stats ── */}
      <div className="flex items-center justify-between py-3 border-t border-neutral-200/40 dark:border-neutral-800/30">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[12px] text-neutral-400">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{totalStudents}</span> total registrations
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[12px] text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {enrolledStudents} enrolled
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {pendingStudents} pending
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-violet-600 dark:text-violet-400">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            {totalCourses} courses
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   KPI Card
   ═══════════════════════════════════════ */
function KpiCard({
  icon, label, value, subtitle, color, href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: string;
  href: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5 transition-all hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500">
            {label}
          </span>
          <div className="w-8 h-8 rounded-[10px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:scale-105 transition-transform">
            {icon}
          </div>
        </div>
        <p className={`text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] ${color}`}>
          {value}
        </p>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">{subtitle}</p>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════
   Status Badge
   ═══════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    enrolled: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-[6px] ${styles[status] || "bg-neutral-500/10 text-neutral-500"}`}>
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════
   Section Header
   ═══════════════════════════════════════ */
function SectionHeader({ icon, title, subtitle, href }: { icon: React.ReactNode; title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-[8px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
          {icon}
        </div>
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