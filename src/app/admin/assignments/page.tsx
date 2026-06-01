"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  Plus,
  Search,
  FileText,
  Clock,
  Loader2,
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";
import CreateAssignmentModal from "@/components/admin/CreateAssignmentModal";
import AssignmentDetailView from "@/components/admin/AssignmentDetailView";

interface Assignment {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  due_date: string;
  status: "active" | "submitted" | "overdue";
  created_at: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [viewAssignment, setViewAssignment] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    setLoading(true);
    const { data } = await supabase
      .from("assignments")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAssignments(data);
    setLoading(false);
  }

  // Compute real-time statuses
  const now = new Date();
  const computedAssignments = assignments.map((a) => {
    const due = new Date(a.due_date);
    // Determine status based on due date
    let status = a.status;
    if (due < now && a.status !== "submitted") {
      status = "overdue";
    }
    return { ...a, status: status as Assignment["status"] };
  });

  const filtered = computedAssignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = computedAssignments.filter((a) => a.status === "active").length;
  const submittedCount = computedAssignments.filter((a) => a.status === "submitted").length;
  const overdueCount = computedAssignments.filter((a) => a.status === "overdue").length;

  // If viewing assignment detail
  if (viewAssignment) {
    return (
      <AssignmentDetailView
        assignmentId={viewAssignment}
        onBack={() => setViewAssignment(null)}
        onUpdated={loadAssignments}
      />
    );
  }

  function getCountdown(dueDate: string): { text: string; overdue: boolean; label: string } {
    const nowDate = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - nowDate.getTime();
    const overdue = diffMs < 0;
    const absMs = Math.abs(diffMs);
    const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return {
        text: overdue ? `Overdue by ${days}d` : `Due in ${days}d`,
        label: overdue ? `${days} day${days > 1 ? "s" : ""} overdue` : `${days} day${days > 1 ? "s" : ""}`,
        overdue,
      };
    }
    if (hours > 0) {
      return {
        text: overdue ? `Overdue by ${hours}h` : `Due in ${hours}h`,
        label: overdue ? `${hours} hour${hours > 1 ? "s" : ""} overdue` : `${hours} hour${hours > 1 ? "s" : ""}`,
        overdue,
      };
    }
    return {
      text: overdue ? "Overdue" : "Due soon",
      label: overdue ? "Overdue" : "Due soon",
      overdue,
    };
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "active": return <PlayCircle className="w-3.5 h-3.5" />;
      case "submitted": return <CheckCircle className="w-3.5 h-3.5" />;
      case "overdue": return <AlertTriangle className="w-3.5 h-3.5" />;
      default: return <PlayCircle className="w-3.5 h-3.5" />;
    }
  }

  function getStatusPillClass(status: string): string {
    switch (status) {
      case "active":
        return "bg-[#30d158]/10 text-[#30d158]";
      case "submitted":
        return "bg-[#0a84ff]/10 text-[#0a84ff]";
      case "overdue":
        return "bg-[#ff453a]/10 text-[#ff453a]";
      default:
        return "bg-[#86868b]/10 text-[#86868b]";
    }
  }

  return (
    <div className="space-y-8">
      {/* ═══════════════════════════════════════════
         HEADER
         ═══════════════════════════════════════════ */}
      {/* Desktop: single row */}
      <div className="hidden lg:flex items-center justify-between gap-5">
        <div className="shrink-0">
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em] leading-tight">
            Assignments
          </h1>
          <p className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-0.5">
            {computedAssignments.length} assignment{computedAssignments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative flex-1 max-w-[420px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
          <input
            type="text"
            placeholder="Search assignments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[42px] pl-10 pr-10 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[14px] text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#8940fa]/25 focus:border-[#8940fa]/40 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="shrink-0 inline-flex items-center justify-center gap-2 h-[42px] px-5 rounded-[10px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all active:scale-[0.98] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]"
        >
          <Plus className="w-4 h-4" />
          Add Assignment
        </button>
      </div>

      {/* Tablet: stacked */}
      <div className="hidden md:flex lg:hidden flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[26px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em] leading-tight">
              Assignments
            </h1>
            <p className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-0.5">
              {computedAssignments.length} assignment{computedAssignments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center gap-2 h-[40px] px-4 rounded-[10px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all active:scale-[0.98] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]"
          >
            <Plus className="w-4 h-4" />
            Add Assignment
          </button>
        </div>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
          <input
            type="text"
            placeholder="Search assignments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[42px] pl-10 pr-10 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[14px] text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#8940fa]/25 focus:border-[#8940fa]/40 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile: full-width stacked */}
      <div className="md:hidden flex flex-col gap-3">
        <div>
          <h1 className="text-[24px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em] leading-tight">
            Assignments
          </h1>
          <p className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-0.5">
            {computedAssignments.length} assignment{computedAssignments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
          <input
            type="text"
            placeholder="Search assignments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[42px] pl-10 pr-10 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[14px] text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#8940fa]/25 focus:border-[#8940fa]/40 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-full inline-flex items-center justify-center gap-2 h-[42px] rounded-[10px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all active:scale-[0.98] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]"
        >
          <Plus className="w-4 h-4" />
          Add Assignment
        </button>
      </div>

      {/* ═══════════════════════════════════════════
         STATS ROW
         ═══════════════════════════════════════════ */}
      {!loading && computedAssignments.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[12px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-4">
            <div className="flex items-center gap-2 mb-1">
              <PlayCircle className="w-3.5 h-3.5 text-[#30d158]" />
              <span className="text-[11px] font-medium text-[#86868b] dark:text-[#98989d]">Active</span>
            </div>
            <p className="text-[22px] font-semibold text-[#1d1d1f] dark:text-white">{activeCount}</p>
          </div>
          <div className="rounded-[12px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#0a84ff]" />
              <span className="text-[11px] font-medium text-[#86868b] dark:text-[#98989d]">Submitted</span>
            </div>
            <p className="text-[22px] font-semibold text-[#1d1d1f] dark:text-white">{submittedCount}</p>
          </div>
          <div className="rounded-[12px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#ff453a]" />
              <span className="text-[11px] font-medium text-[#86868b] dark:text-[#98989d]">Overdue</span>
            </div>
            <p className="text-[22px] font-semibold text-[#1d1d1f] dark:text-white">{overdueCount}</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
         CONTENT
         ═══════════════════════════════════════════ */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#86868b] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 px-4">
          <div className="w-16 h-16 mx-auto mb-5 rounded-[18px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center">
            <FileText className="w-8 h-8 text-[#86868b]" />
          </div>
          <p className="text-[17px] text-[#1d1d1f] dark:text-white font-semibold">
            {search ? "No assignments match your search" : "No assignments yet"}
          </p>
          <p className="text-[14px] text-[#86868b] dark:text-[#98989d] mt-1.5 max-w-sm mx-auto">
            {search
              ? "Try a different search term or clear the filter"
              : "Create your first assignment to share with students"}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 inline-flex items-center gap-2 h-[42px] px-5 rounded-[10px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all active:scale-[0.98] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]"
            >
              <Plus className="w-4 h-4" />
              Create Assignment
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((assignment) => {
            const countdown = getCountdown(assignment.due_date);
            return (
              <button
                key={assignment.id}
                onClick={() => setViewAssignment(assignment.id)}
                className="group text-left rounded-[14px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-5 hover:border-[#d0d0d5] dark:hover:border-[#4a4a4c] hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)] transition-all duration-200 active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center group-hover:bg-[#e8e8ed] dark:group-hover:bg-[#38383a] transition-colors">
                    <FileText className="w-5 h-5 text-[#8940fa]" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#d0d0d5] dark:text-[#4a4a4c] group-hover:text-[#86868b] transition-colors shrink-0 mt-1" />
                </div>

                <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white leading-snug line-clamp-2 mb-3">
                  {assignment.title}
                </h3>

                {/* Status + Countdown pills */}
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[10px] font-medium ${getStatusPillClass(assignment.status)}`}
                  >
                    {getStatusIcon(assignment.status)}
                    <span className="capitalize">{assignment.status}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[10px] font-medium ${
                      countdown.overdue
                        ? "bg-[#ff453a]/10 text-[#ff453a]"
                        : "bg-[#ff9f0a]/10 text-[#ff9f0a]"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {countdown.text}
                  </span>
                </div>

                {/* Due date */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#86868b] dark:text-[#98989d]">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(assignment.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={loadAssignments}
      />
    </div>
  );
}