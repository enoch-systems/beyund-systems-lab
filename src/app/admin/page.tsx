"use client";

import { useEffect, useState, useRef } from "react";
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
  GraduationCap,
  FileText,
  Activity,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { cn } from "@/lib/admin-design-system";

interface DashboardStats {
  totalStudents: number;
  pendingCount: number;
  enrolledCount: number;
  contactedCount: number;
  rejectedCount: number;
}

const scheduleItems = [
  { time: "09:00 - 09:45", course: "Full Stack Fundamentals", section: "Cohort A", room: "Lab 2.14", status: "in_progress" },
  { time: "10:00 - 10:45", course: "React & Next.js", section: "Cohort B", room: "Lab 3.01", status: "upcoming" },
  { time: "11:00 - 11:45", course: "Database Design", section: "Cohort A", room: "Lab 2.14", status: "upcoming" },
  { time: "13:00 - 13:45", course: "API Development", section: "Cohort C", room: "Computing Lab", status: "cancelled" },
  { time: "14:00 - 14:45", course: "Deployment & DevOps", section: "Cohort B", room: "Lab 3.01", status: "upcoming" },
];

const upcomingEvents = [
  { month: "JUN", day: "6", title: "Student Exhibition", time: "09:00 AM - 12:30 PM", tag: "On Campus" },
  { month: "JUN", day: "9", title: "Mentor Review Session", time: "02:00 PM - 05:00 PM", tag: "Meeting" },
  { month: "JUN", day: "12", title: "Inter-Cohort Hackathon", time: "09:00 AM - 04:00 PM", tag: "Event" },
  { month: "JUN", day: "15", title: "Mid-Program Assessment", time: "09:00 AM - 12:00 PM", tag: "Exam" },
];

const performanceData = [
  { label: "Cohort A", course: "Full Stack", score: 84, color: "bg-violet-500" },
  { label: "Cohort B", course: "React", score: 78, color: "bg-emerald-500" },
  { label: "Cohort C", course: "Backend", score: 80, color: "bg-blue-500" },
];

const assignmentData = [
  { label: "G11A", overdue: 3, pending: 8, submitted: 15 },
  { label: "G11B", overdue: 1, pending: 6, submitted: 18 },
  { label: "G11C", overdue: 4, pending: 10, submitted: 12 },
  { label: "G11D", overdue: 2, pending: 7, submitted: 16 },
  { label: "G11E", overdue: 5, pending: 9, submitted: 14 },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    in_progress: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
    upcoming: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20",
    cancelled: "bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20",
    enrolled: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
    contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20",
  };
  const labels: Record<string, string> = {
    in_progress: "In Progress",
    upcoming: "Upcoming",
    cancelled: "Cancelled",
    enrolled: "Enrolled",
    contacted: "Contacted",
    pending: "Pending",
    rejected: "Rejected",
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${styles[status] || "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 ring-1 ring-neutral-300 dark:ring-neutral-700"}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        ["in_progress", "enrolled"].includes(status) ? "bg-emerald-500" :
        ["upcoming", "pending"].includes(status) ? "bg-amber-500" :
        ["cancelled", "rejected"].includes(status) ? "bg-red-500" :
        "bg-blue-500"
      }`} />
      {labels[status] || status}
    </span>
  );
}

function KPICardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
      </div>
      <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-700 rounded mb-1" />
      <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-700 rounded" />
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
  const [selectedKPI, setSelectedKPI] = useState<number | null>(null);
  const kpiScrollRef = useRef<HTMLDivElement>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    document.title = "Admin LMS - Beyund Labs Academy | Dashboard";
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const prefix = session.user.email.split("@")[0];
        setAdminName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
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

  if (loading) {
    return (
      <div className="space-y-6 px-0 sm:px-0">
        {/* Skeleton Header */}
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-2" />
          <div className="h-4 w-72 bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {[1, 2, 3, 4].map((i) => <KPICardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 h-64 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 animate-pulse" />
          <div className="lg:col-span-2 h-64 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8 px-0 sm:px-0">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex h-8 w-8 rounded-lg bg-neutral-900 dark:bg-white items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white dark:text-neutral-900" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 ml-0 sm:ml-10">
            {getGreeting()}, <span className="font-medium text-neutral-700 dark:text-neutral-300">{adminName}</span>. Here's your overview.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/admin/messages"
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Announcement</span>
          </a>
          <a
            href="/admin/assignments"
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm"
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Add Assignment</span>
          </a>
        </div>
      </div>

      {/* ═══ KPI Stats — Horizontally scrollable on mobile ═══ */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard
          title="Students Enrolled"
          value={stats.enrolledCount}
          change="+2.8%"
          changeType="positive"
          subtitle={`of ${stats.totalStudents} total`}
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingCount}
          change="+1.1%"
          changeType="positive"
          subtitle="awaiting review"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          title="Contacted"
          value={stats.contactedCount}
          subtitle={`${stats.totalStudents > 0 ? Math.round((stats.contactedCount / stats.totalStudents) * 100) : 0}% response`}
          icon={<Bell className="w-4 h-4" />}
        />
        <StatCard
          title="Rejected"
          value={stats.rejectedCount}
          change={stats.rejectedCount > 0 ? `+${stats.rejectedCount}` : undefined}
          changeType={stats.rejectedCount > 0 ? "negative" : "neutral"}
          subtitle="applications declined"
          icon={<AlertCircle className="w-4 h-4" />}
        />
      </div>

      {/* Mobile KPI: compact grid with mini cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:hidden">
        <MobileKPI icon={<Users className="w-3.5 h-3.5" />} label="Enrolled" value={stats.enrolledCount} trend="up" />
        <MobileKPI icon={<Clock className="w-3.5 h-3.5" />} label="Pending" value={stats.pendingCount} trend="up" />
        <MobileKPI icon={<Bell className="w-3.5 h-3.5" />} label="Contacted" value={stats.contactedCount} />
        <MobileKPI icon={<AlertCircle className="w-3.5 h-3.5" />} label="Rejected" value={stats.rejectedCount} trend={stats.rejectedCount > 0 ? "down" : undefined} />
      </div>

      {/* ═══ Middle Row ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-5">
        {/* Class Schedule */}
        <div className="lg:col-span-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm">
          <div className="flex items-center justify-between p-4 sm:p-5 pb-3 sm:pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Schedule</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">Today's classes</p>
              </div>
            </div>
            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors flex items-center gap-1">
              <span className="hidden sm:inline">View full</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-4 sm:px-5 pb-1 sm:pb-0">
            {scheduleItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 sm:gap-4 py-3 sm:py-3.5 ${
                  i < scheduleItems.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800/60" : ""
                }`}
              >
                <div
                  className={`w-1 h-10 sm:h-11 rounded-full shrink-0 ${
                    item.status === "in_progress" ? "bg-emerald-500 shadow-sm shadow-emerald-500/30" :
                    item.status === "cancelled" ? "bg-red-500 shadow-sm shadow-red-500/30" :
                    "bg-amber-500 shadow-sm shadow-amber-500/30"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {item.time}
                    </span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {item.course}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5 truncate">
                    {item.section} &middot; {item.room}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <StatusBadge status={item.status} />
                </div>
                <span className={`sm:hidden text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.status === "in_progress" ? "bg-emerald-500/10 text-emerald-600" :
                  item.status === "cancelled" ? "bg-red-500/10 text-red-600" :
                  "bg-amber-500/10 text-amber-600"
                }`}>
                  {item.status === "in_progress" ? "Live" : item.status === "cancelled" ? "X" : "Up"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Status */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm">
          <div className="flex items-center justify-between p-4 sm:p-5 pb-3 sm:pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Assignments</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">By cohort</p>
              </div>
            </div>
            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors flex items-center gap-1">
              <span className="hidden sm:inline">Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Mobile scrollable legend */}
          <div className="px-4 sm:px-5">
            <div className="flex items-center gap-4 pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-400" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Overdue</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-sm bg-neutral-400" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Pending</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Submitted</span>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 sm:space-y-4">
            {assignmentData.map((d) => (
              <div key={d.label} className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400 w-7 sm:w-9 shrink-0">
                  {d.label}
                </span>
                <div className="flex-1 flex items-center gap-0.5 h-6 sm:h-7 rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-800/60">
                  {d.overdue > 0 && (
                    <div
                      className="h-full bg-red-400"
                      style={{ width: `${(d.overdue / maxSubmitted) * 100}%`, minWidth: d.overdue > 0 ? "4px" : "0" }}
                    />
                  )}
                  {d.pending > 0 && (
                    <div
                      className="h-full bg-neutral-400"
                      style={{ width: `${(d.pending / maxSubmitted) * 100}%`, minWidth: "4px" }}
                    />
                  )}
                  {d.submitted > 0 && (
                    <div
                      className="h-full bg-emerald-400"
                      style={{ width: `${(d.submitted / maxSubmitted) * 100}%`, minWidth: "4px" }}
                    />
                  )}
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 w-8 text-right shrink-0 font-mono">
                  {d.submitted}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Bottom Row ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {/* Performance */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm">
          <div className="flex items-center justify-between p-4 sm:p-5 pb-3 sm:pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Performance</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">Cohort averages</p>
              </div>
            </div>
            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors flex items-center gap-1">
              Insights
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 sm:space-y-5">
            {performanceData.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${d.color.replace('-500', '-400')}`} />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{d.score}%</span>
                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
                <div className="relative">
                  <div className="h-2 sm:h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.color} transition-all duration-700 ease-out`}
                      style={{ width: `${d.score}%` }}
                    />
                  </div>
                  <span className="absolute -top-5 right-0 text-[10px] text-neutral-400 hidden sm:block">{d.course}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm">
          <div className="flex items-center justify-between p-4 sm:p-5 pb-3 sm:pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Events</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">Next 2 weeks</p>
              </div>
            </div>
            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors flex items-center gap-1">
              <span className="hidden sm:inline">Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-0">
            {upcomingEvents.map((e, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 ${
                  i < upcomingEvents.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800/60" : ""
                } hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors`}
              >
                <div className="text-center shrink-0 w-10 sm:w-11">
                  <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {e.month}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white leading-none mt-0.5">
                    {e.day}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{e.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate">{e.time}</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 sm:px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shrink-0 border border-neutral-200 dark:border-neutral-700">
                  {e.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="md:col-span-2 lg:col-span-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm">
          <div className="flex items-center justify-between p-4 sm:p-5 pb-3 sm:pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Registrations</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">Latest applicants</p>
              </div>
            </div>
            <a
              href="/admin/students"
              className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
          {recentStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-400 dark:text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">No registrations yet</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">New applicants will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs sm:text-sm font-semibold text-white shrink-0 shadow-sm">
                    {student.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {student.full_name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate">
                      {student.email}
                    </p>
                  </div>
                  <StatusBadge status={student.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Activity Summary Footer ═══ */}
      <div className="flex items-center justify-between py-3 px-4 sm:px-0 border-t border-neutral-100 dark:border-neutral-800/60">
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <Activity className="w-3.5 h-3.5" />
          <span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{stats.totalStudents}</span> total registrations
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {stats.enrolledCount} enrolled
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {stats.pendingCount} pending
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile KPI Mini Card ── */
function MobileKPI({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-3.5 shadow-sm active:scale-[0.98] transition-transform">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span className={`inline-flex items-center text-xs font-medium ${
            trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}>
            {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          </span>
        )}
      </div>
    </div>
  );
}