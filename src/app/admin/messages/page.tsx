"use client";

import { useState } from "react";
import { MessageSquare, Send, Bell, Users, Search, ChevronDown } from "lucide-react";

const announcements = [
  { id: 1, title: "Welcome to the Program", message: "All students are now onboarded. Cohort A starts Full Stack Fundamentals this week.", type: "system", priority: "medium", date: "2 days ago", read: false },
  { id: 2, title: "Assignment Deadline Extended", message: "The REST API assignment deadline has been extended to June 8th for Cohort B.", type: "academic", priority: "high", date: "1 day ago", read: false },
  { id: 3, title: "Schedule Change", message: "Friday's session is moved to 10:00 AM. All cohorts please adjust.", type: "system", priority: "urgent", date: "5 hours ago", read: true },
  { id: 4, title: "Hackathon Registration Open", message: "Inter-Cohort Hackathon on June 12th. Register by June 10th.", type: "academic", priority: "low", date: "1 day ago", read: true },
  { id: 5, title: "Profile Update Reminder", message: "All students should update their profiles with current phone numbers.", type: "admin", priority: "medium", date: "3 days ago", read: true },
];

const colorMap = { system: "bg-blue-500/10 text-blue-500", academic: "bg-amber-500/10 text-amber-500", admin: "bg-violet-500/10 text-violet-500" };
const priorityLabels = { low: "text-neutral-400", medium: "text-amber-500", high: "text-red-500", urgent: "text-red-500 font-bold" };

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"announcements" | "new">("announcements");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"system" | "academic" | "admin">("academic");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [items, setItems] = useState(announcements);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    const newAnnouncement = {
      id: items.length + 1,
      title,
      message,
      type,
      priority,
      date: "Just now",
      read: false,
    };
    setItems([newAnnouncement, ...items]);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Messages & Announcements</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Broadcast messages to students and cohorts.</p>
      </div>

      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg w-fit">
        {(["announcements", "new"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-colors ${activeTab === tab ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500"}`}>
            {tab === "announcements" ? "Announcements" : "New Message"}
          </button>
        ))}
      </div>

      {activeTab === "announcements" ? (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className={`rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5 ${!a.read ? "ring-1 ring-neutral-900/5 dark:ring-white/10" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${colorMap[a.type]}`}>{a.type}</span>
                    <span className={`text-[10px] ${priorityLabels[a.priority]}`}>
                      {a.priority.toUpperCase()}
                    </span>
                    {!a.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{a.title}</h3>
                  <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mt-1">{a.message}</p>
                </div>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-600 whitespace-nowrap shrink-0">{a.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-6">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">New Announcement</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div>
                <label className="block text-[12px] font-medium text-neutral-500 mb-1.5">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900">
                  <option value="system">System</option>
                  <option value="academic">Academic</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-neutral-500 mb-1.5">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-neutral-500 mb-1.5">Target</label>
                <select className="px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900">
                  <option value="all">All Students</option>
                  <option value="cohortA">Cohort A</option>
                  <option value="cohortB">Cohort B</option>
                  <option value="cohortC">Cohort C</option>
                </select>
              </div>
            </div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title..."
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write your announcement..."
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none" />
            <button onClick={handleSend}
              className="px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" /> Send Announcement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}