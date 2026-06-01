"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  ArrowLeft,
  Download,
  Share2,
  Clock,
  FileText,
  Calendar,
  Trash2,
  Loader2,
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  due_date: string;
  status: "active" | "submitted" | "overdue";
  created_at: string;
}

interface AssignmentDetailViewProps {
  assignmentId: string;
  onBack: () => void;
  onUpdated: () => void;
}

export default function AssignmentDetailView({
  assignmentId,
  onBack,
  onUpdated,
}: AssignmentDetailViewProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    loadAssignment();
  }, [assignmentId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-share-menu]")) {
        setShareMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  async function loadAssignment() {
    setLoading(true);
    const { data } = await supabase
      .from("assignments")
      .select("*")
      .eq("id", assignmentId)
      .single();
    if (data) setAssignment(data);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this assignment? This action cannot be undone.")) return;
    setDeleting(true);
    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", assignmentId);
    if (!error) {
      onUpdated();
      onBack();
    }
    setDeleting(false);
  }

  function getCountdown(dueDate: string): { text: string; overdue: boolean } {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    const overdue = diffMs < 0;
    const absMs = Math.abs(diffMs);
    const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return {
        text: overdue
          ? `Overdue by ${days} day${days > 1 ? "s" : ""}`
          : `Due in ${days} day${days > 1 ? "s" : ""}`,
        overdue,
      };
    }
    if (hours > 0) {
      return {
        text: overdue
          ? `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`
          : `Due in ${hours} hour${hours > 1 ? "s" : ""}`,
        overdue,
      };
    }
    return {
      text: overdue ? "Overdue" : "Due soon",
      overdue,
    };
  }

  function getStatusIcon() {
    const statusIcons: Record<string, React.ReactNode> = {
      active: <PlayCircle className="w-4 h-4" />,
      submitted: <CheckCircle className="w-4 h-4" />,
      overdue: <AlertTriangle className="w-4 h-4" />,
    };
    return statusIcons[assignment?.status || "active"];
  }

  function getStatusColor(): string {
    const colors: Record<string, string> = {
      active: "bg-[#30d158]/10 text-[#30d158] dark:text-[#30d158]",
      submitted: "bg-[#0a84ff]/10 text-[#0a84ff] dark:text-[#0a84ff]",
      overdue: "bg-[#ff453a]/10 text-[#ff453a] dark:text-[#ff453a]",
    };
    return colors[assignment?.status || "active"];
  }

  async function copyShareLink() {
    if (!assignment) return;
    const link = `${window.location.origin}/admin/assignments?id=${assignment.id}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Assignment link copied to clipboard!");
    } catch {
      alert("Could not copy link. Please copy the URL manually.");
    }
    setShareMenuOpen(false);
  }

  function shareViaWhatsApp() {
    if (!assignment) return;
    const due = new Date(assignment.due_date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const message = `📚 *New Assignment: ${assignment.title}*\n\n📅 Due: ${due}\n📎 File: ${assignment.file_url || "No file attached"}\n\nComplete and submit before the deadline.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
    setShareMenuOpen(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#86868b] animate-spin" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-24">
        <p className="text-[17px] text-[#86868b]">Assignment not found</p>
        <button onClick={onBack} className="mt-4 text-[14px] text-[#8940fa] hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const countdown = getCountdown(assignment.due_date);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </button>

      {/* Card */}
      <div className="rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#f2f2f7] dark:border-[#2c2c2e]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-10 h-10 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#8940fa]" />
                </div>
                <div>
                  <h1 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white leading-snug">
                    {assignment.title}
                  </h1>
                  <p className="text-[12px] text-[#86868b] dark:text-[#98989d] mt-0.5">
                    Created {new Date(assignment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {/* Status pill */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[11px] font-medium ${getStatusColor()}`}
                >
                  {getStatusIcon()}
                  <span className="capitalize">{assignment.status}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[11px] font-medium ${
                    countdown.overdue
                      ? "bg-[#ff453a]/10 text-[#ff453a]"
                      : "bg-[#ff9f0a]/10 text-[#ff9f0a]"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {countdown.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-5">
          {/* Due date */}
          <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
            <Calendar className="w-5 h-5 text-[#8940fa]" />
            <div>
              <p className="text-[12px] text-[#86868b] dark:text-[#98989d]">Due Date</p>
              <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-white">
                {new Date(assignment.due_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* File */}
          {assignment.file_url && (
            <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
              <div className="w-10 h-10 rounded-[10px] bg-white dark:bg-[#1c1c1e] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0a84ff]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-white truncate">
                  {assignment.file_name || "Assignment File"}
                </p>
                <p className="text-[11px] text-[#86868b] dark:text-[#98989d]">
                  Click to download
                </p>
              </div>
              <a
                href={assignment.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-9 h-9 rounded-lg bg-white dark:bg-[#1c1c1e] flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
              </a>
              <a
                href={assignment.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-9 h-9 rounded-lg bg-white dark:bg-[#1c1c1e] flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:shadow-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* No file */}
          {!assignment.file_url && (
            <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
              <FileText className="w-5 h-5 text-[#86868b]" />
              <p className="text-[13px] text-[#86868b] dark:text-[#98989d]">No file attached</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-[#f2f2f7] dark:border-[#2c2c2e]">
          {/* Share button */}
          <div className="relative" data-share-menu>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareMenuOpen(!shareMenuOpen);
              }}
              className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[10px] border border-[#e5e5ea] dark:border-[#38383a] text-[13px] font-medium text-[#1d1d1f] dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {shareMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-[240px] rounded-[12px] bg-white dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] overflow-hidden z-10">
                <button
                  onClick={copyShareLink}
                  className="flex items-center gap-3 w-full px-4 py-3 text-[13px] text-[#1d1d1f] dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#38383a] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy assignment link
                </button>
                <button
                  onClick={shareViaWhatsApp}
                  className="flex items-center gap-3 w-full px-4 py-3 text-[13px] text-[#1d1d1f] dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#38383a] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Share via WhatsApp
                </button>
              </div>
            )}
          </div>

          {/* Download button */}
          {assignment.file_url && (
            <a
              href={assignment.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[10px] border border-[#e5e5ea] dark:border-[#38383a] text-[13px] font-medium text-[#1d1d1f] dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          )}

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto inline-flex items-center gap-2 h-[38px] px-4 rounded-[10px] text-[13px] font-medium text-[#ff453a] hover:bg-[#ff453a]/10 transition-all disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}