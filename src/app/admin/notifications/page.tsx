"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { UserPlus, CreditCard, Loader2 } from "lucide-react";

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

  // Real-time
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
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  const filtered = filter === "all"
    ? notifications
    : notifications.filter((n) => n.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="max-w-[900px] space-y-5">
      <div>
        <h1 className="text-[28px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
          Notifications
        </h1>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-[10px] w-fit">
        {(["all", "student", "payment"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer ${
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
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e]">
          <p className="text-sm text-neutral-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const cfg = categoryConfig[item.category];
            return (
              <div
                key={item.id}
                className={`rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5 transition-all hover:shadow-sm ${
                  item.status === "unread" ? "border-l-[3px] border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-[6px] ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {item.status === "unread" && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-[14px] font-semibold text-neutral-900 dark:text-white mt-1">
                      {item.title}
                    </p>
                    <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {item.message}
                    </p>
                  </div>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-600 whitespace-nowrap shrink-0">
                    {timeAgo(item.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}