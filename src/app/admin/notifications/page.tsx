"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  Bell,
  BellRing,
  Megaphone,
  Users,
  UserPlus,
  BookOpen,
  CreditCard,
  Settings,
  Loader2,
  X,
  Plus,
  Send,
  ChevronDown,
  Search,
  CheckCheck,
  Clock,
  Zap,
} from "lucide-react";

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
type NotificationCategory = "student" | "academic" | "payment" | "system" | "announcement";

type Notification = {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  status: "unread" | "read";
  student_id: string | null;
  link: string;
  created_at: string;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  created_by: string | null;
  created_at: string;
};

type StatusFilter = "all" | "unread" | "read";
type CategoryFilter = "all" | NotificationCategory;

/* ═══════════════════════════════════════
   Helpers
   ═══════════════════════════════════════ */
const categoryConfig: Record<NotificationCategory, { label: string; color: string; icon: React.ReactNode }> = {
  student: {
    label: "Student",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    icon: <UserPlus className="w-4 h-4" />,
  },
  academic: {
    label: "Academic",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: <BookOpen className="w-4 h-4" />,
  },
  payment: {
    label: "Payment",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: <CreditCard className="w-4 h-4" />,
  },
  system: {
    label: "System",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: <Settings className="w-4 h-4" />,
  },
  announcement: {
    label: "Announcement",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    icon: <Megaphone className="w-4 h-4" />,
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

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return d >= weekStart;
}

function isThisMonth(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */
export default function NotificationsPage() {
  const supabase = createSupabaseBrowserClient();

  // Data
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  // Announcement modal
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceMessage, setAnnounceMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Seen tracking
  const [seenMap, setSeenMap] = useState<Set<string>>(new Set());

  /* ═══════════════════════════════════════
     Data Loading
     ═══════════════════════════════════════ */
  const loadData = useCallback(async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) setCurrentUserId(session.user.id);

    // Load notifications (latest 100)
    const { data: notifs } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    // Load announcements
    const { data: anns } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    // Load seen records for current user
    if (session?.user?.id) {
      const { data: seen } = await supabase
        .from("notification_seen")
        .select("notification_id")
        .eq("user_id", session.user.id);

      if (seen) {
        setSeenMap(new Set(seen.map((s) => s.notification_id)));
      }
    }

    if (notifs) setNotifications(notifs as Notification[]);
    if (anns) setAnnouncements(anns as Announcement[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time subscription for new notifications
  useEffect(() => {
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  /* ═══════════════════════════════════════
     Computed
     ═══════════════════════════════════════ */
  const allItems = [
    ...announcements.map((a) => ({
      id: `ann-${a.id}`,
      title: a.title,
      message: a.message,
      category: "announcement" as NotificationCategory,
      status: "read" as const,
      student_id: null,
      link: "",
      created_at: a.created_at,
      isAnnouncement: true,
    })),
    ...notifications,
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filtered = allItems.filter((item) => {
    // Status filter
    if (statusFilter === "unread" && item.status !== "unread") return false;
    if (statusFilter === "read" && item.status !== "read") return false;

    // Category filter
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

    // Date filter
    if (dateFilter === "today" && !isToday(item.created_at)) return false;
    if (dateFilter === "week" && !isThisWeek(item.created_at)) return false;
    if (dateFilter === "month" && !isThisMonth(item.created_at)) return false;

    return true;
  });

  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const studentNotifs = notifications.filter((n) => n.category === "student").length;
  const academicNotifs = notifications.filter((n) => n.category === "academic").length;
  const paymentNotifs = notifications.filter((n) => n.category === "payment").length;

  /* ═══════════════════════════════════════
     Actions
     ═══════════════════════════════════════ */
  const handleMarkAsRead = async (id: string) => {
    // Update status in DB
    await supabase.from("notifications").update({ status: "read" }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await supabase
      .from("notifications")
      .update({ status: "read" })
      .eq("status", "unread");

    setNotifications((prev) =>
      prev.map((n) => (n.status === "unread" ? { ...n, status: "read" } : n))
    );
  };

  const handleTrackSeen = async (notificationId: string) => {
    if (!currentUserId || seenMap.has(notificationId)) return;
    await supabase.from("notification_seen").insert({
      notification_id: notificationId,
      user_id: currentUserId,
    });
    setSeenMap((prev) => new Set(prev).add(notificationId));
  };

  const handleCreateAnnouncement = async () => {
    if (!announceTitle.trim() || !announceMessage.trim()) return;
    setSubmitting(true);

    await supabase.from("announcements").insert({
      title: announceTitle.trim(),
      message: announceMessage.trim(),
      created_by: currentUserId,
    });

    // Also create a notification for it
    await supabase.from("notifications").insert({
      title: announceTitle.trim(),
      message: announceMessage.trim(),
      category: "announcement",
      status: "unread",
    });

    setAnnounceTitle("");
    setAnnounceMessage("");
    setShowAnnounceModal(false);
    setSubmitting(false);
    loadData();
  };

  /* ═══════════════════════════════════════
     Loading State
     ═══════════════════════════════════════ */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <p className="text-sm text-neutral-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     Render
     ═══════════════════════════════════════ */
  return (
    <div className="max-w-[1200px] space-y-6 sm:space-y-8">
      {/* ──────── HEADER ──────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
            Notifications
          </h1>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 h-[36px] px-3.5 rounded-[10px] border border-neutral-200 dark:border-neutral-700 text-[12px] font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowAnnounceModal(true)}
            className="inline-flex items-center gap-1.5 h-[36px] px-3.5 rounded-[10px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Announce
          </button>
        </div>
      </div>

      {/* ──────── KPI GRID ──────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={<Bell className="w-4 h-4" />}
          label="Total Notifications"
          value={String(notifications.length)}
          color="text-neutral-900 dark:text-white"
        />
        <KpiCard
          icon={<BellRing className="w-4 h-4" />}
          label="Unread"
          value={String(unreadCount)}
          color="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          icon={<Megaphone className="w-4 h-4" />}
          label="Announcements"
          value={String(announcements.length)}
          color="text-rose-600 dark:text-rose-400"
        />
        <KpiCard
          icon={<Zap className="w-4 h-4" />}
          label="Student Activity"
          value={String(studentNotifs + paymentNotifs)}
          color="text-violet-600 dark:text-violet-400"
        />
      </div>

      {/* ──────── FILTERS ──────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category pills */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-[10px] overflow-x-auto">
          {(["all", "student", "academic", "payment", "system", "announcement"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1.5 rounded-[8px] text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {cat === "all" ? "All" : categoryConfig[cat as NotificationCategory]?.label || cat}
            </button>
          ))}
        </div>

        {/* Status + date filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-[10px]">
            {(["all", "unread", "read"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1.5 rounded-[8px] text-[11px] font-medium transition-all cursor-pointer ${
                  statusFilter === s
                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
            className="h-[34px] px-2.5 rounded-[8px] bg-neutral-100 dark:bg-neutral-800/50 border-0 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 focus:outline-none cursor-pointer"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div>
      </div>

      {/* ──────── NOTIFICATION LIST ──────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e]">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            No notifications
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
            You're all caught up! New notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const catCfg = categoryConfig[item.category as NotificationCategory] || categoryConfig.system;
            const isUnread = "status" in item && item.status === "unread";
            const isSeen = "isAnnouncement" in item || seenMap.has(item.id.replace("ann-", ""));

            return (
              <div
                key={item.id}
                className={`group rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5 transition-all hover:shadow-sm cursor-pointer ${
                  isUnread ? "border-l-[3px] border-l-blue-500" : ""
                }`}
                onClick={() => {
                  if (isUnread) handleMarkAsRead(item.id.replace("ann-", ""));
                  if (!isSeen) handleTrackSeen(item.id.replace("ann-", ""));
                }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${
                      catCfg.color
                    }`}
                  >
                    {catCfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-[6px] ${catCfg.color}`}>
                        {catCfg.label}
                      </span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[14px] font-semibold text-neutral-900 dark:text-white mt-1">
                      {item.title}
                    </p>
                    <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-600 whitespace-nowrap">
                      {timeAgo(item.created_at)}
                    </span>
                    {isUnread && (
                      <span className="text-[10px] text-blue-500 font-medium">New</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════
         ANNOUNCEMENT MODAL
         ═══════════════════════════════════════ */}
      {showAnnounceModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setShowAnnounceModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-[20px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[10px] bg-rose-500/10 flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-rose-500" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-neutral-900 dark:text-white tracking-[-0.01em]">
                    New Announcement
                  </h3>
                </div>
                <button
                  onClick={() => setShowAnnounceModal(false)}
                  className="w-8 h-8 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center text-neutral-400 hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Upcoming Workshop"
                    value={announceTitle}
                    onChange={(e) => setAnnounceTitle(e.target.value)}
                    className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                    Message
                  </label>
                  <textarea
                    placeholder="Write your announcement..."
                    value={announceMessage}
                    onChange={(e) => setAnnounceMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3.5 py-3 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 resize-none"
                  />
                </div>
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    onClick={() => setShowAnnounceModal(false)}
                    className="flex-1 h-[40px] rounded-[10px] text-[13px] font-medium text-neutral-500 bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAnnouncement}
                    disabled={submitting || !announceTitle.trim() || !announceMessage.trim()}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-[40px] rounded-[10px] bg-rose-500 text-white text-[13px] font-semibold hover:bg-rose-600 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Publish
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   KPI Card
   ═══════════════════════════════════════ */
function KpiCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5 transition-all hover:shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500">
          {label}
        </span>
        <div className="w-8 h-8 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center text-neutral-500">
          {icon}
        </div>
      </div>
      <p className={`text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] ${color}`}>
        {value}
      </p>
    </div>
  );
}