"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { StudentRegistration } from "@/lib/types";
import { Bell, ClipboardList, TrendingUp, TrendingDown, Minus, Calendar, Clock, Users, BookOpen, CheckSquare, AlertCircle } from "lucide-react";
import StatCard from "@/components/admin/StatCard";

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
    in_progress: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    upcoming: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
    enrolled: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
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
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${styles[status] || "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"}`}>
      {labels[status] || status}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    document.title = "Admin LMS - Beyund Labs Academy | Dashboard";
  }, []);

  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    pendingCount: 0,
    enrolledCount: 0,
    contactedCount: 0,
    rejectedCount: 0,
  });
  const [recentStudents, setRecentStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function fetchDashboardData() {
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
          pendingCount: students.filter((s: StudentRegistration) => s.status === "pending").length,
          enrolledCount: students.filter((s: StudentRegistration) => s.status === "enrolled").length,
          contactedCount: students.filter((s: StudentRegistration) => s.status === "contacted").length,
          rejectedCount: students.filter((s: StudentRegistration) => s.status === "rejected").length,
        });
        setRecentStudents(students.slice(0, 6));
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white" />
      </div>
    );
  }

  const maxSubmitted = Math.max(...assignmentData.map((d) => d.submitted));

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {getGreeting()}, {adminName}. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/messages"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Announcement
          </a>
          <a
            href="/admin/assignments"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            Add Assignment
          </a>
        </div>
      </div>

      {/* ── KPI Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Students Enrolled"
          value={stats.enrolledCount}
          change="+2.8%"
          changeType="positive"
          subtitle={`of ${stats.totalStudents} total registrations`}
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingCount}
          change="+1.1%"
          changeType="positive"
          subtitle="awaiting admin review"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          title="Contacted"
          value={stats.contactedCount}
          subtitle={`${stats.totalStudents > 0 ? Math.round((stats.contactedCount / stats.totalStudents) * 100) : 0}% response rate`}
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

      {/* ── Middle Row: Schedule + Assignment Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Class Schedule */}
        <div className="lg:col-span-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Class Schedule</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Today's classes</p>
              </div>
            </div>
            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors">
              View full schedule &rarr;
            </button>
          </div>
          <div className="space-y-2">
            {scheduleItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <div
                  className={`w-1 h-11 rounded-full shrink-0 ${
                    item.status === "in_progress"
                      ? "bg-emerald-500"
                      : item.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-amber-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {item.time}
                    </span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {item.course}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                    {item.section} &middot; {item.room}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Status */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Assignment Status</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">By cohort group</p>
              </div>
            </div>
            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors">
              Report &rarr;
            </button>
          </div>
          <div className="flex items-center gap-5 mb-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Overdue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Submitted</span>
            </div>
          </div>
          <div className="space-y-4">
            {assignmentData.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-9 shrink-0">
                  {d.label}
                </span>
                <div className="flex-1 flex items-center gap-0.5 h-7 rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-800">
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
                <span className="text-xs text-neutral-500 dark:text-neutral-400 w-8 text-right shrink-0">
                  {d.submitted}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Performance + Events + Recent Students ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Performance Highlights */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Performance</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Cohort averages</p>
              </div>
            </div>
            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors">
              Insights &rarr;
            </button>
          </div>
          <div className="space-y-5">
            {performanceData.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">{d.label}</span>
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{d.score}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.color} transition-all duration-500`}
                      style={{ width: `${d.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 w-16 text-right">{d.course}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Upcoming Events</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Next 2 weeks</p>
              </div>
            </div>
            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors">
              Calendar &rarr;
            </button>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((e, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <div className="text-center shrink-0 w-11">
                  <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {e.month}
                  </p>
                  <p className="text-xl font-bold text-neutral-900 dark:text-white leading-none mt-0.5">
                    {e.day}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{e.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">{e.time}</p>
                </div>
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 shrink-0">
                  {e.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Registrations</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Latest applicants</p>
              </div>
            </div>
            <a
              href="/admin/students"
              className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
            >
              View all &rarr;
            </a>
          </div>
          {recentStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-3" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No registrations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                    {student.full_name.charAt(0)}
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
    </div>
  );
}