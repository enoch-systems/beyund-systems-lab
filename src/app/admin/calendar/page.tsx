"use client";

import { useState } from "react";

const events = [
  { date: "2026-06-02", title: "Full Stack Fundamentals", time: "09:00 - 09:45", type: "class", color: "bg-blue-500" },
  { date: "2026-06-02", title: "React & Next.js", time: "10:00 - 10:45", type: "class", color: "bg-blue-500" },
  { date: "2026-06-03", title: "Database Design", time: "09:00 - 09:45", type: "class", color: "bg-blue-500" },
  { date: "2026-06-05", title: "Assignment: Build a REST API", time: "Due 11:59 PM", type: "deadline", color: "bg-amber-500" },
  { date: "2026-06-06", title: "Student Exhibition", time: "09:00 AM - 12:30 PM", type: "event", color: "bg-emerald-500" },
  { date: "2026-06-09", title: "Mentor Review Session", time: "02:00 PM - 05:00 PM", type: "event", color: "bg-emerald-500" },
  { date: "2026-06-10", title: "API Development Workshop", time: "10:00 - 11:45", type: "class", color: "bg-blue-500" },
  { date: "2026-06-12", title: "Inter-Cohort Hackathon", time: "09:00 AM - 04:00 PM", type: "event", color: "bg-emerald-500" },
  { date: "2026-06-13", title: "Assignment: Full Stack Project", time: "Due 11:59 PM", type: "deadline", color: "bg-amber-500" },
  { date: "2026-06-15", title: "Mid-Program Assessment", time: "09:00 AM - 12:00 PM", type: "event", color: "bg-red-500" },
  { date: "2026-06-16", title: "Deployment & DevOps", time: "14:00 - 14:45", type: "class", color: "bg-blue-500" },
  { date: "2026-06-20", title: "Assignment: Deploy to Production", time: "Due 11:59 PM", type: "deadline", color: "bg-amber-500" },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const formatDate = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getEventsForDate = (day: number) => {
    const dateStr = formatDate(day);
    return events.filter((e) => e.date === dateStr);
  };

  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const selectedDayEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : [];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Calendar</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          View class schedules, events, and assignment deadlines.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[12px] text-neutral-500 dark:text-neutral-400">Classes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[12px] text-neutral-500 dark:text-neutral-400">Events</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-[12px] text-neutral-500 dark:text-neutral-400">Deadlines</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800/50 rounded-lg overflow-hidden">
            {daysOfWeek.map((day) => (
              <div key={day} className="bg-neutral-50 dark:bg-neutral-900/80 px-2 py-2 text-center text-[11px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase">
                {day}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="bg-white dark:bg-neutral-900/50 min-h-[80px]" />;
              const dayEvents = getEventsForDate(day);
              const dateStr = formatDate(day);
              const isSelected = selectedDate === dateStr;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`bg-white dark:bg-neutral-900/50 min-h-[80px] p-1.5 cursor-pointer transition-colors ${
                    isSelected ? "ring-2 ring-neutral-900 dark:ring-white/20" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  }`}
                >
                  <span className={`text-[12px] font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    isToday(day) ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900" : "text-neutral-700 dark:text-neutral-300"
                  }`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev, j) => (
                      <div key={j} className={`h-1.5 rounded-full ${ev.color} opacity-80`} />
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-neutral-400">+{dayEvents.length - 2}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
            {selectedDate
              ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
              : "Select a date"}
          </h3>
          {selectedDayEvents.length === 0 ? (
            <p className="text-sm text-neutral-400 dark:text-neutral-600">
              {selectedDate ? "No events on this date" : "Click a date to see events"}
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.map((ev, i) => (
                <div key={i} className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-800/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${ev.color}`} />
                    <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase">{ev.type}</span>
                  </div>
                  <p className="text-[13px] font-medium text-neutral-900 dark:text-white">{ev.title}</p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-0.5">{ev.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}