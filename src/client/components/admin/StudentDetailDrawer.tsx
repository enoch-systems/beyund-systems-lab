"use client";

import { useState } from "react";
import type { StudentRegistration } from "@/shared/types";

interface StudentDetailDrawerProps {
  student: StudentRegistration | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: StudentRegistration["status"]) => void;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-neutral-100 dark:border-neutral-800/50 last:border-0">
      <span className="text-[12px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider sm:w-40 shrink-0">
        {label}
      </span>
      <span className="text-[13px] text-neutral-900 dark:text-white break-words">
        {value || <span className="text-neutral-300 dark:text-neutral-700 italic">Not provided</span>}
      </span>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy {label}
        </>
      )}
    </button>
  );
}

const statusOptions = ["pending", "contacted", "enrolled", "rejected"] as const;

export default function StudentDetailDrawer({
  student,
  onClose,
  onDelete,
  onStatusUpdate,
}: StudentDetailDrawerProps) {
  if (!student) return null;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this student record?")) {
      onDelete(student.id);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-[#0a0a0a] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {student.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">{student.full_name}</h2>
              <p className="text-[12px] text-neutral-400 dark:text-neutral-600">{student.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Status + Actions */}
          <div className="flex items-center gap-3 mb-6">
            <select
              value={student.status}
              onChange={(e) => onStatusUpdate(student.id, e.target.value as StudentRegistration["status"])}
              className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10 ${
                student.status === "enrolled"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : student.status === "contacted"
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : student.status === "rejected"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <CopyButton text={student.email} label="Email" />
            <CopyButton text={student.phone_whatsapp} label="Phone" />
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mb-3">
              Personal Information
            </h3>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/50 px-4">
              <DetailRow label="Full Name" value={student.full_name} />
              <DetailRow label="Email" value={student.email} />
              <DetailRow label="Phone / WhatsApp" value={student.phone_whatsapp} />
              <DetailRow label="Sex" value={student.sex?.charAt(0).toUpperCase() + (student.sex?.slice(1) || "")} />
              <DetailRow label="Country" value={student.country} />
              <DetailRow label="State" value={student.state} />
            </div>
          </div>

          {/* Academic Profile */}
          <div className="mb-6">
            <h3 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mb-3">
              Academic Profile
            </h3>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/50 px-4">
              <DetailRow label="Course" value={student.course_applying_for} />
              <DetailRow label="Employment Status" value={student.employment_status?.charAt(0).toUpperCase() + (student.employment_status?.slice(1) || "")} />
              <DetailRow label="Has Laptop" value={student.has_laptop?.charAt(0).toUpperCase() + (student.has_laptop?.slice(1) || "")} />
            </div>
          </div>

          {/* Application Context */}
          <div className="mb-6">
            <h3 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mb-3">
              Application Context
            </h3>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/50 px-4">
              <DetailRow label="How They Found Us" value={student.heard_about_us?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} />
              <DetailRow label="Learning Reason" value={student.learning_reason} />
            </div>
          </div>

          {/* Metadata */}
          <div className="mb-6">
            <h3 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mb-3">
              Record Info
            </h3>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/50 px-4">
              <DetailRow
                label="Registration Date"
                value={new Date(student.created_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <DetailRow label="Record ID" value={student.id} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={handleDelete}
            className="w-full py-2.5 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-600 dark:text-red-400 text-[13px] font-medium hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Student Record
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
}