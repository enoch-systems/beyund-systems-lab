"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { StudentRegistration } from "@/lib/types";
import {
  Bell,
  ClipboardList,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  CheckSquare,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  BarChart3,
  FileText,
  Activity,
  Ellipsis,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import {
  apple,
  statusStyle,
  statusDot,
  statusLabel,
} from "@/lib/admin-design-system";

interface DashboardStats {
  totalStudents: number;
  pendingCount: number;
  enrolledCount: number;
  contactedCount: number;
  rejectedCount: number;
}

const scheduleItems = [
  { time: "09:00-09:45", course: "Full Stack Fundamentals", section: "Cohort A", room: "Lab 2.14", status: "in_progress" },
  { time: "10:00-10:45", course: "React & Next.js", section: "Cohort B", room: "Lab 3.01", status: "upcoming" },
  { time: "11:00-11:45", course: "Database Design", section: "Cohort A", room: "Lab 2.14", status: "upcoming" },
  { time: "13:00-13:45", course: "API Development", section: "Cohort C", room: "Computing Lab", status: "cancelled" },
  { time: "14:00-14:45", course: "Deployment & DevOps", section: "Cohort B", room: "Lab 3.01", status: "upcoming" },
];

const upcomingEvents = [
  { month: "JUN", day: "6", title: "Student Exhibition", time: "9:00 AM - 12:30 PM", tag: "On Campus" },
  { month: "JUN", day: "9", title: "Mentor Review Session", time: "2:00 PM - 5:00 PM", tag: "Meeting" },
  { month: "JUN", day: "12", title: "Inter-Cohort Hackathon", time: "9:00 AM - 4:00 PM", tag: "Event" },
  { month: "JUN", day: "15", title: "Mid-Program Assessment", time: "9:00 AM - 12:00 PM", tag: "Exam" },
];

const performanceData = [
  { label: "Cohort A", course: "Full Stack", score: 84, fill: "bg-[#8940fa] dark:bg-[#bf5af2]" },
  { label: "Cohort B", course: "React", score: 78, fill: "bg-[#30b94e] dark:bg-[#30d158]" },
  { label: "Cohort C", course: "Backend", score: 80, fill: "bg-[#007aff] dark:bg-[#0a84ff]" },
];

const assignmentData = [
  { label: "G11A", overdue: 3, pending: 8, submitted: 15 },
  { label: "G11B", overdue: 1, pending: 6, submitted: 18 },
  { label: "G11C", overdue: 4, pending: 10, submitted: 12 },
  { label: "G11D", overdue: 2, pending: 7, submitted: 16 },
  { label: "G11E", overdue: 5, pending: 9, submitted: 14 },
];

function getGreeting(): string {
  // Use Nigeria timezone (UTC+1)
  const now = new Date();
  const nigeriaTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
  const h = nigeriaTime.getHours();
  if (h >= 4 && h < 12) return "Good morning";
  if (h >= 12 && h < 16) return "Good afternoon";
  return "Good evening";
}

function StatSkeleton() {
  return (
    <div className={`${apple.radius.card} ${apple.surface.card} ${apple.border} p-5 animate-pulse`}>
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-20 bg-[#e5e5ea] dark:bg-[#38383a] rounded-[4px]" />
        <div className="w-8 h-8 rounded-[10px] bg-[#e5e5ea] dark:bg-[#38383a]" />
      </div>
      <div className="h-8 w-16 bg-[#e5e5ea] dark:bg-[#38383a] rounded-[6px] mb-2" />
      <div className="h-3 w-28 bg-[#e5e5ea] dark:bg-[#38383a] rounded-[4px]" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0, pendingCount: 0, enrolledCount: 0, contactedCount: 0, rejectedCount: 0,
  });
  const [recentStudents, setRecentStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    document.title = "Admin LMS — Beyund Labs Academy";
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();

      // Load admin name from saved settings first, fallback to email prefix
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

      const { data: students } = await supabase
        .from("student_registrations")
        .select("*")
        .order("created_at", { ascending: false });
      if (students) {
        setStats({
          totalStudents: students.length,
          pendingCount: students.filter((s) => s.status === "pending").length,
          enrolledCount: students.filter((s) => s.status === "enrolled").length,
          contactedCount: students.filter((s) => s.status === "contacted").length,
          rejectedCount: students.filter((s) => s.status === "rejected").length,
        });
        setRecentStudents(students.slice(0, 6));
      }
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  const maxSubmitted = Math.max(...assignmentData.map((d) => d.submitted));

  if (loading) return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-2">
        <div className="h-9 w-56 bg-[#e5e5ea] dark:bg-[#38383a] rounded-[8px]" />
        <div className="h-4 w-72 bg-[#e5e5ea] dark:bg-[#38383a] rounded-[6px]" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)}
      </div>
      <div className="h-64 bg-[#e5e5ea]/50 dark:bg-[#38383a]/30 rounded-[14px] animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className={`${apple.text.hero} leading-tight`}>
            {getGreeting()}, <span className="text-[#1d1d1f] dark:text-white">{adminName}</span>
          </h1>
          <p className={`${apple.text.caption} mt-1`}>
            Here's your overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href="/admin/messages"
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 ${apple.radius.button} ${apple.surface.card} ${apple.border} ${apple.text.caption} font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-all duration-200`}
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Announce</span>
          </a>
          <a
            href="/admin/assignments"
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 ${apple.radius.button} bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] ${apple.text.caption} font-medium hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all duration-200 ${apple.shadow.sm}`}
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Assign</span>
          </a>
        </div>
      </div>

      {/* ── KPI Stats ── */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Enrolled" value={stats.enrolledCount} change="+2.8%" changeType="positive" subtitle={`of ${stats.totalStudents} total`} icon={<Users className="w-4 h-4" />} />
        <StatCard title="Pending" value={stats.pendingCount} change="+1.1%" changeType="positive" subtitle="awaiting review" icon={<Clock className="w-4 h-4" />} />
        <StatCard title="Contacted" value={stats.contactedCount} subtitle={`${stats.totalStudents > 0 ? Math.round((stats.contactedCount / stats.totalStudents) * 100) : 0}% rate`} icon={<Bell className="w-4 h-4" />} />
        <StatCard title="Rejected" value={stats.rejectedCount} change={stats.rejectedCount > 0 ? `+${stats.rejectedCount}` : undefined} changeType={stats.rejectedCount > 0 ? "negative" : "neutral"} subtitle="declined" icon={<AlertCircle className="w-4 h-4" />} />
      </div>

      {/* Mobile KPI */}
      <div className="grid grid-cols-2 gap-2.5 sm:hidden">
        <MobileKPI icon={<Users className="w-3.5 h-3.5" />} label="Enrolled" value={stats.enrolledCount} up />
        <MobileKPI icon={<Clock className="w-3.5 h-3.5" />} label="Pending" value={stats.pendingCount} up />
        <MobileKPI icon={<Bell className="w-3.5 h-3.5" />} label="Contacted" value={stats.contactedCount} />
        <MobileKPI icon={<AlertCircle className="w-3.5 h-3.5" />} label="Rejected" value={stats.rejectedCount} down={stats.rejectedCount > 0} />
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Schedule */}
        <div className={`lg:col-span-3 ${apple.radius.card} ${apple.surface.card} ${apple.border} ${apple.shadow.sm} overflow-hidden`}>
          <SectionHeader icon={<Calendar className="w-4 h-4" />} title="Schedule" subtitle="Today" />
          <div className="divide-y divide-[#e5e5ea]/50 dark:divide-[#38383a]/40">
            {scheduleItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 px-5 py-3.5 hover:bg-[#f9f9f9] dark:hover:bg-white/[0.03] transition-colors duration-150">
                <div className={`w-1 h-10 rounded-full ${item.status === "in_progress" ? "bg-[#30d158]" : item.status === "cancelled" ? "bg-[#ff453a]" : "bg-[#ff9f0a]"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[13px] font-mono ${apple.text.caption}`}>{item.time}</span>
                    <span className={`${apple.text.body} font-medium truncate`}>{item.course}</span>
                  </div>
                  <p className={`${apple.text.micro} mt-0.5`}>{item.section} · {item.room}</p>
                </div>
                <span className={`hidden sm:inline-flex items-center gap-1.5 ${apple.text.badge} px-2.5 py-1 ${apple.radius.pill} ${statusStyle(item.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot(item.status)}`} />
                  {statusLabel(item.status)}
                </span>
                <span className={`sm:hidden text-[11px] font-medium px-2 py-0.5 rounded-[6px] ${statusStyle(item.status)}`}>
                  {item.status === "in_progress" ? "Live" : item.status === "cancelled" ? "X" : "Up"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments */}
        <div className={`lg:col-span-2 ${apple.radius.card} ${apple.surface.card} ${apple.border} ${apple.shadow.sm} overflow-hidden`}>
          <SectionHeader icon={<FileText className="w-4 h-4" />} title="Assignments" subtitle="By cohort" />
          <div className="px-5 pt-0.5">
            <div className="flex items-center gap-4 pb-2.5 mb-3 border-b border-[#e5e5ea]/50 dark:border-[#38383a]/40 overflow-x-auto">
              {["Overdue", "Pending", "Submitted"].map((label) => (
                <span key={label} className={`flex items-center gap-1.5 shrink-0 ${apple.text.micro}`}>
                  <span className={`w-2 h-2 rounded-sm ${label === "Overdue" ? "bg-[#ff453a]" : label === "Pending" ? "bg-[#86868b]" : "bg-[#30d158]"}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="px-5 pb-5 space-y-3.5">
            {assignmentData.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className={`${apple.text.micro} font-mono font-medium w-8 shrink-0`}>{d.label}</span>
                <div className="flex-1 h-6 rounded-[6px] overflow-hidden bg-[#f2f2f7] dark:bg-[#2c2c2e] flex">
                  {d.overdue > 0 && (
                    <div className="h-full bg-[#ff453a]" style={{ width: `${(d.overdue / maxSubmitted) * 100}%`, minWidth: d.overdue > 0 ? "4px" : "0" }} />
                  )}
                  {d.pending > 0 && (
                    <div className="h-full bg-[#86868b]" style={{ width: `${(d.pending / maxSubmitted) * 100}%`, minWidth: "4px" }} />
                  )}
                  {d.submitted > 0 && (
                    <div className="h-full bg-[#30d158]" style={{ width: `${(d.submitted / maxSubmitted) * 100}%`, minWidth: "4px" }} />
                  )}
                </div>
                <span className={`${apple.text.micro} font-mono w-7 text-right shrink-0`}>{d.submitted}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Performance */}
        <div className={`${apple.radius.card} ${apple.surface.card} ${apple.border} ${apple.shadow.sm} overflow-hidden`}>
          <SectionHeader icon={<TrendingUp className="w-4 h-4" />} title="Performance" subtitle="Cohort averages" />
          <div className="px-5 pb-5 space-y-5">
            {performanceData.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${d.fill.split(" ")[0]}`} />
                    <span className={`${apple.text.body} font-medium`}>{d.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`${apple.text.body} font-semibold`}>{d.score}%</span>
                    <ArrowUpRight className={`w-3.5 h-3.5 ${apple.semantic.green}`} />
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] overflow-hidden">
                  <div className={`h-full rounded-full ${d.fill} transition-all duration-700 ease-out`} style={{ width: `${d.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className={`${apple.radius.card} ${apple.surface.card} ${apple.border} ${apple.shadow.sm} overflow-hidden`}>
          <SectionHeader icon={<Calendar className="w-4 h-4" />} title="Events" subtitle="Next 2 weeks" />
          <div className="divide-y divide-[#e5e5ea]/50 dark:divide-[#38383a]/40">
            {upcomingEvents.map((e, i) => (
              <div key={i} className="flex items-start gap-3 sm:gap-4 px-5 py-3.5 hover:bg-[#f9f9f9] dark:hover:bg-white/[0.03] transition-colors duration-150">
                <div className="text-center shrink-0 w-10">
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${apple.semantic.blue}`}>{e.month}</p>
                  <p className={`text-xl font-bold text-[#1d1d1f] dark:text-white leading-none mt-0.5`}>{e.day}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${apple.text.body} font-medium`}>{e.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-[#86868b] shrink-0" />
                    <p className={`${apple.text.micro}`}>{e.time}</p>
                  </div>
                </div>
                <span className={`${apple.text.micro} px-2 py-1 rounded-[6px] bg-[#f2f2f7] dark:bg-[#2c2c2e] text-[#86868b] shrink-0`}>
                  {e.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registrations */}
        <div className={`md:col-span-2 lg:col-span-1 ${apple.radius.card} ${apple.surface.card} ${apple.border} ${apple.shadow.sm} overflow-hidden`}>
          <SectionHeader icon={<Users className="w-4 h-4" />} title="Registrations" subtitle="Latest applicants" href="/admin/students" />
          {recentStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-5">
              <div className="w-14 h-14 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-[#86868b]" />
              </div>
              <p className={`${apple.text.body} font-medium text-[#86868b]`}>No registrations yet</p>
              <p className={`${apple.text.micro} mt-1`}>New applicants will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-[#e5e5ea]/50 dark:divide-[#38383a]/40">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#f9f9f9] dark:hover:bg-white/[0.03] transition-colors duration-150 cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8940fa] to-[#007aff] flex items-center justify-center text-sm font-semibold text-white shrink-0">
                    {student.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${apple.text.body} font-medium truncate`}>{student.full_name}</p>
                    <p className={`${apple.text.micro} truncate mt-0.5`}>{student.email}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 ${apple.text.badge} px-2.5 py-1 ${apple.radius.pill} ${statusStyle(student.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(student.status)}`} />
                    {statusLabel(student.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between py-3 border-t border-[#e5e5ea]/40 dark:border-[#38383a]/30">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#86868b]" />
          <span className={`${apple.text.micro}`}>
            <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{stats.totalStudents}</span> total registrations
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[13px] text-[#30b94e] dark:text-[#30d158]">
            <span className="w-2 h-2 rounded-full bg-[#30d158]" />
            {stats.enrolledCount} enrolled
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-[#d49a2a] dark:text-[#ff9f0a]">
            <span className="w-2 h-2 rounded-full bg-[#ff9f0a]" />
            {stats.pendingCount} pending
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon, title, subtitle, href }: { icon: React.ReactNode; title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-[8px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center text-[#86868b] dark:text-[#98989d]">
          {icon}
        </div>
        <div>
          <h3 className={`${apple.text.title}`}>{title}</h3>
          {subtitle && <p className={`${apple.text.micro}`}>{subtitle}</p>}
        </div>
      </div>
      {href && (
        <a href={href} className={`${apple.text.micro} font-medium text-[#007aff] dark:text-[#0a84ff] hover:underline flex items-center gap-0.5`}>
          View all <ChevronRight className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

/* ── Mobile KPI ── */
function MobileKPI({ icon, label, value, up, down }: { icon: React.ReactNode; label: string; value: number; up?: boolean; down?: boolean }) {
  return (
    <div className={`${apple.radius.card} ${apple.surface.card} ${apple.border} ${apple.shadow.sm} p-3.5 active:scale-[0.98] transition-transform`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`${apple.text.micro} uppercase tracking-[0.04em]`}>{label}</span>
        <div className="w-6 h-6 rounded-[8px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center text-[#86868b]">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-white">{value}</span>
        {up && <ArrowUpRight className="w-3.5 h-3.5 text-[#30b94e] dark:text-[#30d158]" />}
        {down && <ArrowDownRight className="w-3.5 h-3.5 text-[#d6453e] dark:text-[#ff453a]" />}
      </div>
    </div>
  );
}