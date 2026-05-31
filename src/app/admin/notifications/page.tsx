"use client";

import { useState } from "react";

const notifications = [
  { id: 1, type: "student", title: "New Registration", message: "Sarah Johnson submitted a registration for Full Stack Development", time: "2 min ago", read: false },
  { id: 2, type: "assignment", title: "Assignment Overdue", message: "3 students haven't submitted the REST API assignment", time: "1 hour ago", read: false },
  { id: 3, type: "system", title: "System Update", message: "Dashboard has been updated with new analytics features", time: "3 hours ago", read: false },
  { id: 4, type: "student", title: "New Registration", message: "Michael Chen submitted a registration for Full Stack Development", time: "5 hours ago", read: true },
  { id: 5, type: "assignment", title: "Assignment Submitted", message: "8 students submitted the React Component Library assignment", time: "1 day ago", read: true },
  { id: 6, type: "student", title: "Status Updated", message: "Emily Davis status changed to Enrolled", time: "1 day ago", read: true },
  { id: 7, type: "system", title: "Maintenance Scheduled", message: "System maintenance on June 5th from 2:00 AM to 4:00 AM", time: "2 days ago", read: true },
  { id: 8, type: "assignment", title: "Assignment Created", message: "New assignment 'Database Schema Design' added for Database Design course", time: "3 days ago", read: true },
  { id: 9, type: "student", title: "New Registration", message: "Amanda Williams submitted a registration for React & Next.js", time: "3 days ago", read: true },
  { id: 10, type: "system", title: "Welcome", message: "Welcome to the Beyund Systems admin dashboard", time: "5 days ago", read: true },
];

const iconMap = {
  student: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  assignment: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  system: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [items, setItems] = useState(notifications);

  const filtered = filter === "unread" ? items.filter((n) => !n.read) : items;
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Notifications</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {unreadCount} unread notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg w-fit">
        {(["all", "unread"] as const).map((tab) => (
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

      {/* Notifications */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 divide-y divide-neutral-100 dark:divide-neutral-800/50">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-neutral-400 dark:text-neutral-600 text-sm">
            No notifications to show
          </div>
        ) : (
          filtered.map((notification) => (
            <div key={notification.id} className={`px-5 py-4 flex items-start gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors ${!notification.read ? "bg-neutral-50/50 dark:bg-neutral-800/10" : ""}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                notification.type === "student" ? "bg-violet-500/10 text-violet-500" :
                  notification.type === "assignment" ? "bg-amber-500/10 text-amber-500" :
                    "bg-blue-500/10 text-blue-500"
              }`}>
                {iconMap[notification.type as keyof typeof iconMap]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-neutral-900 dark:text-white">{notification.title}</p>
                  {!notification.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mt-0.5">{notification.message}</p>
              </div>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-600 whitespace-nowrap shrink-0">{notification.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}