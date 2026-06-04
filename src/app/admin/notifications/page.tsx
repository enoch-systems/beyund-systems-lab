"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { UserPlus, CreditCard, Loader2, CheckCheck, Check, MailOpen } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  category: "student" | "payment";
  status: "unread" | "read";
  created_at: string;
};

const categoryConfig = {
  student: {
    label: "Student Registration",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    icon: <UserPlus className="w-4 h-4" />,
  },
  payment: {
    label: "Payment",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: <CreditCard className="w-4 h-4" />,
  },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export default function NotificationsPage() {
  const supabase = createSupabaseBrowserClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "student" | "payment">("all");
  const [markingAll, setMarkingAll] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .in("category", ["student", "payment"])
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) setNotifications(data as Notification[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const channel = supabase
      .channel("notifications-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const n = payload.new as Notification;
          if (n.category === "student" || n.category === "payment") {
            setNotifications((prev) => [n, ...prev]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        (payload) => {
          const updated = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  // ── Mark single notification as read ──
  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" as const } : n))
    );
    await supabase
      .from("notifications")
      .update({ status: "read" })
      .eq("id", id);
  };

  // ── Mark all visible (unread) as read ──
  const markAllAsRead = async () => {
    const unreadIds = filtered
      .filter((n) => n.status === "unread")
      .map((n) => n.id);
    if (unreadIds.length === 0) return;

    setMarkingAll(true);
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (unreadIds.includes(n.id) ? { ...n, status: "read" as const } : n))
    );
    await supabase
      .from("notifications")
      .update({ status: "read" })
      .in("id", unreadIds);
    setMarkingAll(false);
  };

  const filtered = filter === "all"
    ? notifications
    : notifications.filter((n) => n.category === filter);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
            Notifications
          </h1>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            Stay updated with student registrations and payments.
            {unreadCount > 0 && (
              <span className="ml-1.5 text-blue-500 font-medium">
                · {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={markingAll}
            className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[6px] bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold hover:bg-blue-500/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 shrink-0"
          >
            {markingAll ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CheckCheck className="w-3 h-3" />
            )}
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-[8px] w-fit">
        {(["all", "student", "payment"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-[6px] text-[11px] font-medium transition-all cursor-pointer ${
              filter === f
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            {f === "all" ? "All" : f === "student" ? "Registration" : "Payment"}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#111827]">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">No notifications yet</p>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">New notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const cfg = categoryConfig[item.category];
            return (
              <div
                key={item.id}
                className={`rounded-[12px] border border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-4 transition-all hover:shadow-sm ${
                  item.status === "unread" ? "border-l-[3px] border-l-blue-500" : "border-l-[3px] border-l-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[6px] ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {item.status === "unread" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-[12px] font-semibold text-neutral-900 dark:text-white mt-0.5">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {item.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600 whitespace-nowrap">
                      {timeAgo(item.created_at)}
                    </span>
                    {item.status === "unread" && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-0 p-0"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                        Read
                      </button>
                    )}
                    {item.status === "read" && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400">
                        <MailOpen className="w-3 h-3" />
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}