"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
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
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.1)",
    icon: <UserPlus className="w-4 h-4" />,
  },
  payment: {
    label: "Payment",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
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
        (payload: any) => {
          const n = payload.new as Notification;
          if (n.category === "student" || n.category === "payment") {
            setNotifications((prev) => [n, ...prev]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        (payload: any) => {
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
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" as const } : n))
    );
    await supabase
      .from("notifications")
      .update({ status: "read" })
      .eq("id", id);
    window.dispatchEvent(new CustomEvent("notifications-updated"));
  };

  // ── Mark all visible (unread) as read ──
  const markAllAsRead = async () => {
    const unreadIds = filtered
      .filter((n) => n.status === "unread")
      .map((n) => n.id);
    if (unreadIds.length === 0) return;

    setMarkingAll(true);
    setNotifications((prev) =>
      prev.map((n) => (unreadIds.includes(n.id) ? { ...n, status: "read" as const } : n))
    );
    await supabase
      .from("notifications")
      .update({ status: "read" })
      .in("id", unreadIds);
    setMarkingAll(false);
    window.dispatchEvent(new CustomEvent("notifications-updated"));
  };

  const filtered = filter === "all"
    ? notifications
    : notifications.filter((n) => n.category === filter);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            Notifications
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            Stay updated with student registrations and payments.
            {unreadCount > 0 && (
              <span className="ml-1.5 font-medium" style={{ color: "var(--color-accent-teal)" }}>
                · {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={markingAll}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 shrink-0"
            style={{
              background: "var(--color-accent-teal)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {markingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5" />
            )}
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 p-1 rounded-lg w-fit" style={{ background: "var(--color-bg-secondary)" }}>
        {(["all", "student", "payment"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer"
            style={
              filter === f
                ? {
                    background: "var(--color-bg-elevated)",
                    color: "var(--color-text-primary)",
                    boxShadow: "var(--shadow-sm)",
                  }
                : {
                    color: "var(--color-text-tertiary)",
                  }
            }
          >
            {f === "all" ? "All" : f === "student" ? "Registration" : "Payment"}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--color-bg-secondary)" }}>
            <CreditCard className="w-6 h-6" style={{ color: "var(--color-text-tertiary)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>No notifications yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>New notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const cfg = categoryConfig[item.category];
            return (
              <div
                key={item.id}
                className="rounded-xl border p-4 transition-all"
                style={{
                  borderColor: item.status === "unread" ? "var(--color-accent-teal)" : "var(--color-border-default)",
                  background: "var(--color-bg-elevated)",
                  borderLeftWidth: item.status === "unread" ? "3px" : "1px",
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      {item.status === "unread" && (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-accent-teal)" }} />
                      )}
                    </div>
                    <p className="text-sm font-semibold mt-1" style={{ color: "var(--color-text-primary)" }}>
                      {item.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                      {item.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] whitespace-nowrap" style={{ color: "var(--color-text-tertiary)" }}>
                      {timeAgo(item.created_at)}
                    </span>
                    {item.status === "unread" && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold transition-colors"
                        style={{ color: "var(--color-accent-teal)" }}
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                        Read
                      </button>
                    )}
                    {item.status === "read" && (
                      <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
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