"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import {
  Mail, Search, ChevronDown, Filter,
} from "lucide-react";

interface EmailLog {
  id: string;
  registration_id: string;
  student_id: string | null;
  email_type: "welcome" | "enrollment" | "other";
  recipient_email: string;
  status: "sent" | "failed" | "bounced" | "opened";
  error_message?: string;
  sent_at: string;
  created_at: string;
}

interface Registration {
  id: string;
  full_name: string;
  course_applying_for: string;
}

export default function EmailHistoryPage() {
  const supabase = createSupabaseBrowserClient();
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [registrations, setRegistrations] = useState<Map<string, Registration>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    document.title = "Email History — Admin";
  }, []);

  useEffect(() => {
    async function load() {
      const { data: logsData } = await supabase
        .from("email_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (logsData) setLogs(logsData as EmailLog[]);

      const { data: regsData } = await supabase
        .from("student_registrations")
        .select("id, full_name, course_applying_for");
      if (regsData) {
        const map = new Map<string, Registration>();
        regsData.forEach(r => map.set(r.id, r));
        setRegistrations(map);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  const filtered = logs.filter(log => {
    const reg = registrations.get(log.registration_id);
    const nameMatch = reg?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const emailMatch = log.recipient_email.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === "all" || log.status === statusFilter;
    const typeMatch = typeFilter === "all" || log.email_type === typeFilter;
    return (nameMatch || emailMatch) && statusMatch && typeMatch;
  });

  const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    sent: { bg: "rgba(16, 185, 129, 0.1)", text: "#10b981", dot: "#10b981" },
    failed: { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444", dot: "#ef4444" },
    bounced: { bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b", dot: "#f59e0b" },
    opened: { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6", dot: "#3b82f6" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Loading email history...</p>
        </div>
      </div>
    );
  }

  // Stats
  const sentCount = logs.filter(l => l.status === "sent").length;
  const failedCount = logs.filter(l => l.status === "failed").length;
  const bouncedCount = logs.filter(l => l.status === "bounced").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            📧 Email History
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            {logs.length} total emails · {sentCount} sent · {failedCount} failed · {bouncedCount} bounced
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Sent" value={String(sentCount)} color="#10b981" />
        <StatCard label="Failed" value={String(failedCount)} color="#ef4444" />
        <StatCard label="Bounced" value={String(bouncedCount)} color="#f59e0b" />
        <StatCard label="Opened" value={String(logs.filter(l => l.status === "opened").length)} color="#3b82f6" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg text-xs transition-all"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs cursor-pointer transition-all"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-default)",
            color: "var(--color-text-secondary)",
          }}
        >
          <option value="all">All Status</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="bounced">Bounced</option>
          <option value="opened">Opened</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs cursor-pointer transition-all"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-default)",
            color: "var(--color-text-secondary)",
          }}
        >
          <option value="all">All Types</option>
          <option value="welcome">Welcome</option>
          <option value="enrollment">Enrollment</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border-default)" }}>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Student</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Email</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Date</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Error</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ "--tw-divide-opacity": "1", divideColor: "var(--color-border-subtle)" } as any}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                    No email logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const reg = registrations.get(log.registration_id);
                  const statusStyle = statusStyles[log.status] || { bg: "transparent", text: "var(--color-text-secondary)", dot: "var(--color-text-tertiary)" };
                  return (
                    <tr key={log.id} className="transition-colors" style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                          {reg?.full_name || "Unknown"}
                        </p>
                        <p className="text-[11px] truncate" style={{ color: "var(--color-text-tertiary)" }}>
                          {reg?.course_applying_for || ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {log.recipient_email}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium capitalize" style={{ color: "var(--color-text-secondary)" }}>
                          {log.email_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          <span className="w-1 h-1 rounded-full" style={{ background: statusStyle.dot }} />
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--color-text-tertiary)" }}>
                        {new Date(log.sent_at).toLocaleDateString("en-US", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-xs max-w-[200px] truncate" style={{ color: log.error_message ? "#ef4444" : "var(--color-text-tertiary)" }} title={log.error_message || ""}>
                        {log.error_message || <span style={{ color: "var(--color-text-disabled)" }}>—</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>{label}</p>
      <p className="text-lg font-bold mt-1" style={{ color, fontFamily: "var(--font-mono)" }}>{value}</p>
    </div>
  );
}