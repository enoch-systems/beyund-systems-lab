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

  const statusStyles: Record<string, string> = {
    sent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    failed: "bg-red-500/10 text-red-600 dark:text-red-400",
    bounced: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    opened: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white" />
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
          <h1 className="text-[13px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
            📧 Email History
          </h1>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[30px] pl-8 pr-3 rounded-[6px] bg-white dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1a1a1a] text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[30px] px-3 rounded-[6px] bg-white dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1a1a1a] text-[11px] text-neutral-700 dark:text-neutral-300 cursor-pointer"
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
          className="h-[30px] px-3 rounded-[6px] bg-white dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1a1a1a] text-[11px] text-neutral-700 dark:text-neutral-300 cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="welcome">Welcome</option>
          <option value="enrollment">Enrollment</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-[16px] border border-[#e2e8f0] dark:border-[#1a1a1a] bg-white dark:bg-[#121212] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Student</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Email</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Type</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Status</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Date</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[12px] text-neutral-400 dark:text-neutral-600">
                    No email logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const reg = registrations.get(log.registration_id);
                  return (
                    <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-2.5">
                        <p className="text-[12px] font-semibold text-neutral-900 dark:text-white truncate max-w-[160px]">
                          {reg?.full_name || "Unknown"}
                        </p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate max-w-[160px]">
                          {reg?.course_applying_for || ""}
                        </p>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-neutral-600 dark:text-neutral-400">
                        {log.recipient_email}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] font-medium capitalize text-neutral-700 dark:text-neutral-300">
                          {log.email_type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-[6px] ${statusStyles[log.status] || ""}`}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-neutral-400 dark:text-neutral-600 whitespace-nowrap">
                        {new Date(log.sent_at).toLocaleDateString("en-US", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-red-500 max-w-[200px] truncate" title={log.error_message || ""}>
                        {log.error_message || <span className="text-neutral-300 dark:text-neutral-700">—</span>}
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
    <div className="rounded-[12px] border border-[#e2e8f0] dark:border-[#1a1a1a] bg-white dark:bg-[#121212] p-3">
      <p className="text-[10px] text-neutral-500 dark:text-neutral-500 font-medium">{label}</p>
      <p className="text-[18px] font-bold mt-1" style={{ color, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{value}</p>
    </div>
  );
}