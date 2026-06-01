"use client";

import { useState } from "react";

const initialAssignments = [
  { id: 1, title: "Build a REST API", course: "Full Stack Fundamentals", cohort: "Cohort A", dueDate: "2026-06-05", submitted: 12, total: 15, status: "active" },
  { id: 2, title: "React Component Library", course: "React & Next.js", cohort: "Cohort B", dueDate: "2026-06-08", submitted: 8, total: 14, status: "active" },
  { id: 3, title: "Database Schema Design", course: "Database Design", cohort: "Cohort A", dueDate: "2026-06-10", submitted: 0, total: 15, status: "upcoming" },
  { id: 4, title: "Full Stack Project", course: "Full Stack Fundamentals", cohort: "Cohort A", dueDate: "2026-06-13", submitted: 0, total: 15, status: "upcoming" },
  { id: 5, title: "Deploy to Production", course: "Deployment & DevOps", cohort: "Cohort B", dueDate: "2026-06-20", submitted: 0, total: 14, status: "upcoming" },
  { id: 6, title: "Authentication Flow", course: "Full Stack Fundamentals", cohort: "Cohort A", dueDate: "2026-05-28", submitted: 15, total: 15, status: "completed" },
  { id: 7, title: "CSS Grid Layout", course: "React & Next.js", cohort: "Cohort B", dueDate: "2026-05-25", submitted: 13, total: 14, status: "completed" },
];

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "completed">("all");

  const filtered = filter === "all" ? initialAssignments : initialAssignments.filter((a) => a.status === filter);

  const counts = {
    active: initialAssignments.filter((a) => a.status === "active").length,
    upcoming: initialAssignments.filter((a) => a.status === "upcoming").length,
    completed: initialAssignments.filter((a) => a.status === "completed").length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Assignments</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage and track student assignments across all courses.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase">Total</p>
          <p className="text-xl font-bold text-neutral-900 dark:text-white mt-1">{initialAssignments.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase">Active</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{counts.active}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase">Upcoming</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{counts.upcoming}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase">Completed</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{counts.completed}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg w-fit">
        {(["all", "active", "upcoming", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
              filter === tab
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {filtered.map((assignment) => {
          const progress = assignment.total > 0 ? Math.round((assignment.submitted / assignment.total) * 100) : 0;
          const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div key={assignment.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      assignment.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : assignment.status === "upcoming" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}>
                      {assignment.status}
                    </span>
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-600">{assignment.cohort}</span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white">{assignment.title}</h3>
                  <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mt-0.5">{assignment.course}</p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-600">Due</p>
                    <p className="text-[13px] font-medium text-neutral-900 dark:text-white">
                      {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    {assignment.status !== "completed" && (
                      <p className={`text-[10px] mt-0.5 ${daysLeft < 0 ? "text-red-500" : daysLeft <= 3 ? "text-amber-500" : "text-neutral-400 dark:text-neutral-600"}`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                      </p>
                    )}
                  </div>
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{assignment.submitted}/{assignment.total}</span>
                      <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">{progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div className="h-full rounded-full bg-neutral-900 dark:bg-white transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}