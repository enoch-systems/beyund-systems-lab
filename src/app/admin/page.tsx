"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { StudentRegistration } from "@/lib/types";
import StatCard from "@/components/admin/StatCard";

interface DashboardStats {
  totalStudents: number;
  pendingCount: number;
  enrolledCount: number;
  contactedCount: number;
  rejectedCount: number;
}

const scheduleItems = [
  { time: "09:00 - 09:45", date: "Sunday, 31 May", course: "Full Stack Fundamentals", section: "Cohort A", room: "Lab 2.14", status: "in_progress" },
  { time: "10:00 - 10:45", date: "Sunday, 31 May", course: "React & Next.js", section: "Cohort B", room: "Lab 3.01", status: "upcoming" },
  { time: "11:00 - 11:45", date: "Sunday, 31 May", course: "Database Design", section: "Cohort A", room: "Lab 2.14", status: "upcoming" },
  { time: "13:00 - 13:45", date: "Sunday, 31 May", course: "API Development", section: "Cohort C", room: "Computing Lab", status: "cancelled" },
  { time: "14:00 - 14:45", date: "Sunday, 31 May", course: "Deployment & DevOps", section: "Cohort B", room: "Lab 3.01", status: "upcoming" },
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

export default function AdminDashboardPage() {
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
        setRecentStudents(students.slice(0, 5));
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white" />
      </div>
    );
  }

  const maxSubmitted = Math.max(...assignmentData.map((d) => d.submitted));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Academy Dashboard
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Good morning, Admin. Here's a quick overview of today's activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex items-center gap-2">
            <span>📢</span> New Announcement
          </button>
          <button className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex items-center gap-2">
            <span>📊</span> Gradebook
          </button>
          <button className="px-3 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2">
            <span>+</span> Add Assignment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Students Enrolled"
          value={stats.enrolledCount}
          change="+2.8%"
          changeType="positive"
          subtitle={`of ${stats.totalStudents} total registrations`}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingCount}
          change="+1.1%"
          changeType="positive"
          subtitle="awaiting admin review"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Contacted"
          value={stats.contactedCount}
          subtitle={`${stats.totalStudents > 0 ? Math.round((stats.contactedCount / stats.totalStudents) * 100) : 0}% response rate`}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Rejected"
          value={stats.rejectedCount}
          change={stats.rejectedCount > 0 ? `${stats.rejectedCount}` : undefined}
          changeType={stats.rejectedCount > 0 ? "negative" : "neutral"}
          subtitle="applications declined"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />
      </div>

      {/* Middle Row: Schedule + Assignment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Class Schedule */}
        <div className="lg:col-span-3 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Class Schedule</h3>
            <button className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
              View Full Schedule →
            </button>
          </div>
          <div className="space-y-1">
            {scheduleItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                <div className="w-1 h-10 rounded-full shrink-0" style={{
                  backgroundColor: item.status === "in_progress" ? "#22c55e" : item.status === "cancelled" ? "#ef4444" : "#f59e0b"
                }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {item.time}
                    </span>
                    <span className="text-[13px] font-medium text-neutral-900 dark:text-white">
                      {item.course}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-0.5">
                    {item.section} · {item.room}
                  </p>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded shrink-0 ${
                  item.status === "in_progress"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : item.status === "cancelled"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}>
                  {item.status === "in_progress" ? "In Progress" : item.status === "cancelled" ? "Cancelled" : "Upcoming"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Status Chart */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Assignment Status</h3>
            <button className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
              View Report →
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-red-400" />
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Overdue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-neutral-400 dark:bg-neutral-600" />
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-emerald-400" />
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Submitted</span>
            </div>
          </div>
          <div className="space-y-3">
            {assignmentData.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="text-[11px] text-neutral-400 dark:text-neutral-600 w-8 shrink-0">{d.label}</span>
                <div className="flex-1 flex items-center gap-0.5 h-6">
                  {d.overdue > 0 && (
                    <div
                      className="h-full bg-red-400/80 rounded-l-sm"
                      style={{ width: `${(d.overdue / maxSubmitted) * 100}%`, minWidth: d.overdue > 0 ? "4px" : "0" }}
                    />
                  )}
                  {d.pending > 0 && (
                    <div
                      className="h-full bg-neutral-400 dark:bg-neutral-600"
                      style={{ width: `${(d.pending / maxSubmitted) * 100}%`, minWidth: "4px" }}
                    />
                  )}
                  {d.submitted > 0 && (
                    <div
                      className="h-full bg-emerald-400/80 rounded-r-sm"
                      style={{ width: `${(d.submitted / maxSubmitted) * 100}%`, minWidth: "4px" }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Performance + Events + Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance Highlights */}
        <div className="lg:col-span-1 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Performance Highlights</h3>
            <button className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
              View Insights →
            </button>
          </div>
          <div className="space-y-4">
            {performanceData.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{d.label}</span>
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{d.score}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div className={`h-full rounded-full ${d.color} transition-all duration-500`} style={{ width: `${d.score}%` }} />
                  </div>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-600 whitespace-nowrap">{d.course}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-1 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Upcoming Events</h3>
            <button className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
              View Calendar →
            </button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((e, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                <div className="text-center shrink-0">
                  <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase">{e.month}</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white leading-none">{e.day}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-neutral-900 dark:text-white">{e.title}</p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-0.5">{e.time}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 shrink-0">
                  {e.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="lg:col-span-1 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Registrations</h3>
            <a href="/admin/students" className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
              View All →
            </a>
          </div>
          <div className="space-y-1">
            {recentStudents.length === 0 ? (
              <p className="text-sm text-neutral-400 dark:text-neutral-600 text-center py-8">No registrations yet</p>
            ) : (
              recentStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 dark:from-violet-500/10 dark:to-indigo-500/10 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-sm font-medium text-neutral-700 dark:text-neutral-300 shrink-0">
                    {student.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-neutral-900 dark:text-white truncate">{student.full_name}</p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-600 truncate">{student.email}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded shrink-0 ${
                    student.status === "enrolled"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : student.status === "contacted"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : student.status === "rejected"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}>
                    {student.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}