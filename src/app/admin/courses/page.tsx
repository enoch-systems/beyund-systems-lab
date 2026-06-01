"use client";

import { useState } from "react";
import { BookOpen, Users, Calendar, Plus, Search, MoreHorizontal } from "lucide-react";

const initialCourses = [
  { id: 1, title: "Full Stack Fundamentals", code: "FS-101", instructor: "Enoch", cohort: "Cohort A", start: "2026-05-01", end: "2026-07-30", students: 15, status: "active", color: "bg-blue-500" },
  { id: 2, title: "React & Next.js", code: "RN-201", instructor: "Enoch", cohort: "Cohort B", start: "2026-05-15", end: "2026-08-15", students: 14, status: "active", color: "bg-violet-500" },
  { id: 3, title: "Database Design", code: "DB-301", instructor: "Enoch", cohort: "Cohort A", start: "2026-06-01", end: "2026-09-01", students: 15, status: "active", color: "bg-emerald-500" },
  { id: 4, title: "API Development", code: "AP-401", instructor: "Enoch", cohort: "Cohort C", start: "2026-06-15", end: "2026-09-15", students: 12, status: "upcoming", color: "bg-amber-500" },
  { id: 5, title: "Deployment & DevOps", code: "DD-501", instructor: "Enoch", cohort: "Cohort B", start: "2026-07-01", end: "2026-10-01", students: 14, status: "upcoming", color: "bg-red-500" },
  { id: 6, title: "Introduction to Programming", code: "IP-001", instructor: "Enoch", cohort: "Cohort A", start: "2026-01-10", end: "2026-04-10", students: 15, status: "completed", color: "bg-neutral-500" },
];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "completed">("all");

  const filtered = initialCourses
    .filter((c) => filter === "all" || c.status === filter)
    .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Courses</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{initialCourses.length} courses across all cohorts</p>
        </div>
        <button className="px-3 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10" />
        </div>
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
          {(["all", "active", "upcoming", "completed"] as const).map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${filter === tab ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => (
          <div key={course.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${course.color} flex items-center justify-center`}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                course.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : course.status === "upcoming" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400"
              }`}>
                {course.status}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{course.title}</h3>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mt-0.5">{course.code}</p>
            <div className="mt-3 flex items-center gap-4 text-[12px] text-neutral-400 dark:text-neutral-600">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(course.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}