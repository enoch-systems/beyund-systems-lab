"use client";

import { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const schedule: Record<string, { time: string; course: string; cohort: string; room: string; instructor: string }[]> = {
  Monday: [
    { time: "09:00 - 09:45", course: "Full Stack Fundamentals", cohort: "Cohort A", room: "Lab 2.14", instructor: "Enoch" },
    { time: "10:00 - 10:45", course: "React & Next.js", cohort: "Cohort B", room: "Lab 3.01", instructor: "Enoch" },
    { time: "14:00 - 14:45", course: "Database Design", cohort: "Cohort A", room: "Lab 2.14", instructor: "Enoch" },
  ],
  Tuesday: [
    { time: "09:00 - 09:45", course: "API Development", cohort: "Cohort C", room: "Computing Lab", instructor: "Enoch" },
    { time: "11:00 - 11:45", course: "Deployment & DevOps", cohort: "Cohort B", room: "Lab 3.01", instructor: "Enoch" },
  ],
  Wednesday: [
    { time: "09:00 - 09:45", course: "Full Stack Fundamentals", cohort: "Cohort A", room: "Lab 2.14", instructor: "Enoch" },
    { time: "10:00 - 10:45", course: "React & Next.js", cohort: "Cohort B", room: "Lab 3.01", instructor: "Enoch" },
    { time: "13:00 - 13:45", course: "Database Design", cohort: "Cohort C", room: "Computing Lab", instructor: "Enoch" },
  ],
  Thursday: [
    { time: "10:00 - 10:45", course: "API Development", cohort: "Cohort C", room: "Computing Lab", instructor: "Enoch" },
    { time: "14:00 - 14:45", course: "Deployment & DevOps", cohort: "Cohort B", room: "Lab 3.01", instructor: "Enoch" },
  ],
  Friday: [
    { time: "09:00 - 11:45", course: "Full Stack Project Workshop", cohort: "All Cohorts", room: "Computing Lab", instructor: "Enoch" },
    { time: "14:00 - 15:45", course: "Mentor Review Session", cohort: "All Cohorts", room: "Seminar Room 1", instructor: "Enoch" },
  ],
};

const courseColors: Record<string, string> = {
  "Full Stack Fundamentals": "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  "React & Next.js": "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400",
  "Database Design": "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  "API Development": "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
  "Deployment & DevOps": "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
  "Full Stack Project Workshop": "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  "Mentor Review Session": "bg-neutral-500/10 border-neutral-500/20 text-neutral-600 dark:text-neutral-400",
};

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Class Schedule</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Weekly class timetable for all cohorts and courses.
        </p>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg w-fit overflow-x-auto">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap ${
              selectedDay === day
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 overflow-hidden">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
          {timeSlots.map((slot) => {
            const classesForSlot = (schedule[selectedDay] || []).filter((c) =>
              c.time.startsWith(slot)
            );
            return (
              <div key={slot} className="flex items-stretch min-h-[72px]">
                <div className="w-20 shrink-0 px-4 py-3 flex items-start pt-4">
                  <span className="text-[12px] font-mono text-neutral-400 dark:text-neutral-600">{slot}</span>
                </div>
                <div className="flex-1 px-4 py-3 border-l border-neutral-100 dark:border-neutral-800/50">
                  {classesForSlot.length > 0 ? (
                    <div className="space-y-2">
                      {classesForSlot.map((cls, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${courseColors[cls.course] || "bg-neutral-50 dark:bg-neutral-800/20 border-neutral-200 dark:border-neutral-700"}`}>
                          <p className="text-[13px] font-medium">{cls.course}</p>
                          <p className="text-[11px] opacity-70 mt-0.5">{cls.time} · {cls.cohort} · {cls.room}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center">
                      <span className="text-[12px] text-neutral-300 dark:text-neutral-700">—</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}