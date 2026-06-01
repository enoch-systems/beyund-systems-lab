"use client";

import { BarChart3, TrendingUp, TrendingDown, Users, BookOpen, Award, AlertTriangle } from "lucide-react";

export default function AnalyticsPage() {
  const weeklyData = [
    { week: "Week 1", registrations: 4, active: 3 },
    { week: "Week 2", registrations: 7, active: 6 },
    { week: "Week 3", registrations: 5, active: 5 },
    { week: "Week 4", registrations: 9, active: 8 },
    { week: "Week 5", registrations: 6, active: 6 },
    { week: "Week 6", registrations: 8, active: 7 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Analytics</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Key insights and trends across the academy.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-[11px] text-neutral-400 dark:text-neutral-600">Total Students</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">42</p>
          <p className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> +12% this month</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-violet-500" />
            <span className="text-[11px] text-neutral-400 dark:text-neutral-600">Active</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">35</p>
          <p className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> 83% active rate</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] text-neutral-400 dark:text-neutral-600">Completion</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">76%</p>
          <p className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> +5% vs last cohort</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-[11px] text-neutral-400 dark:text-neutral-600">Drop-off</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">7</p>
          <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1"><TrendingDown className="w-3 h-3" /> 16.7% drop rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Weekly Registrations</h3>
          <div className="flex items-end gap-2 h-32">
            {weeklyData.map((w, i) => {
              const max = Math.max(...weeklyData.map((d) => d.registrations));
              const height = (w.registrations / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-neutral-400">{w.registrations}</span>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-t-md relative" style={{ height: "100px" }}>
                    <div className="absolute bottom-0 w-full bg-violet-500 rounded-t-md transition-all" style={{ height: `${height}%` }} />
                  </div>
                  <span className="text-[9px] text-neutral-500 truncate w-full text-center">{w.week}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Most Applied Courses</h3>
          <div className="space-y-3">
            {[
              { course: "Full Stack Development", count: 18, color: "bg-violet-500" },
              { course: "React & Next.js", count: 12, color: "bg-blue-500" },
              { course: "Backend Engineering", count: 8, color: "bg-emerald-500" },
              { course: "Database Design", count: 4, color: "bg-amber-500" },
            ].map((c, i) => {
              const maxCount = 18;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-neutral-600 dark:text-neutral-400">{c.course}</span>
                    <span className="text-[12px] font-medium text-neutral-900 dark:text-white">{c.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${(c.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}