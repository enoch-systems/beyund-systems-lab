"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

const studentNames = ["Sarah Johnson", "Michael Chen", "Amanda Williams", "David Okafor", "Chioma Nwosu", "Emeka Obi", "Folake Adeyemi", "Tunde Balogun", "Ngozi Eze", "Kofi Mensah"];
const courses = ["Full Stack Fundamentals", "React & Next.js", "Database Design"];

type AttendanceStatus = "present" | "absent" | "late" | "excused";

const initialAttendance: { id: number; name: string; email: string; status: AttendanceStatus; course: string }[] = studentNames.map((name, i) => ({
  id: i + 1,
  name,
  email: name.toLowerCase().replace(/\s/g, ".") + "@example.com",
  status: "present" as AttendanceStatus,
  course: courses[i % 3],
}));

export default function AttendancePage() {
  const [records, setRecords] = useState<{ id: number; name: string; email: string; status: AttendanceStatus; course: string }[]>(initialAttendance);
  const [courseFilter, setCourseFilter] = useState("all");
  const [search, setSearch] = useState("");

  const toggleStatus = (id: number) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { present: "absent" as const, absent: "late" as const, late: "excused" as const, excused: "present" as const };
        return { ...r, status: next[r.status] };
      })
    );
  };

  const filtered = records
    .filter((r) => courseFilter === "all" || r.course === courseFilter)
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const presentCount = filtered.filter((r) => r.status === "present").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Attendance</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Mark and track student attendance for today's sessions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10" />
        </div>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10"
          style={{ colorScheme: "dark" }}>
          <option value="all">All Courses</option>
          {courses.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-600 mb-2">
        <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Present</span>
        <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-500" /> Absent</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> Late</span>
        <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-blue-500" /> Excused</span>
        <span className="ml-auto font-medium text-neutral-700 dark:text-neutral-300">{presentCount}/{filtered.length} Present</span>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 divide-y divide-neutral-100 dark:divide-neutral-800/50">
        {filtered.map((r) => (
          <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors cursor-pointer" onClick={() => toggleStatus(r.id)}>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-neutral-900 dark:text-white">{r.name}</p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-600">{r.course}</p>
            </div>
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
              r.status === "present" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : r.status === "absent" ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : r.status === "late" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            }`}>
              {r.status === "present" ? <CheckCircle className="w-3 h-3" />
                : r.status === "absent" ? <XCircle className="w-3 h-3" />
                  : r.status === "late" ? <Clock className="w-3 h-3" />
                    : <AlertCircle className="w-3 h-3" />}
              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}