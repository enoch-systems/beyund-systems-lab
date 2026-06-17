"use client";

import { useState, useEffect, useCallback } from "react";
import type { StudentRegistration } from "@/shared/types";

interface StudentDetailDrawerProps {
  student: StudentRegistration | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: StudentRegistration["status"]) => void;
}

interface EmailLog {
  id: string;
  email_type: "welcome" | "enrollment" | "other";
  recipient_email: string;
  status: "sent" | "failed" | "bounced" | "opened";
  error_message?: string;
  sent_at: string;
  created_at: string;
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

const statusOptions = ["pending", "enrolled", "restricted"] as const;

export default function StudentDetailDrawer({
  student,
  onClose,
  onDelete,
  onStatusUpdate,
}: StudentDetailDrawerProps) {
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [emailFeedback, setEmailFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch email logs when student changes (MUST be before early return)
  const fetchEmailLogs = useCallback(async () => {
    if (!student?.id) return;
    try {
      const res = await fetch(`/api/admin/email-logs?registrationId=${student.id}`);
      const data = await res.json();
      if (data.data) setEmailLogs(data.data);
    } catch (err) {
      console.error("Failed to fetch email logs:", err);
    }
  }, [student?.id]);

  useEffect(() => {
    if (student?.id) {
      fetchEmailLogs();
    }
  }, [student?.id, fetchEmailLogs]);

  if (!student) return null;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this student record?")) {
      onDelete(student.id);
      onClose();
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    setEnrollError("");
    try {
      const res = await fetch("/api/admin/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: student.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to enroll");
      onStatusUpdate(student.id, "enrolled");
      alert(`✅ Student enrolled successfully!\n\nEmail: ${student.email}\nDefault PIN: 123456\n\nYou can now send the Enrollment email using the button below.`);
    } catch (err: any) {
      setEnrollError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleSendEmail = async (emailType: "welcome" | "enrollment") => {
    setSendingEmail(emailType);
    setEmailFeedback(null);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: student.id, emailType }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailFeedback({ type: "success", message: `${emailType === "welcome" ? "Welcome" : "Enrollment"} email sent successfully!` });
        setTimeout(() => setEmailFeedback(null), 5000);
        fetchEmailLogs();
      } else {
        setEmailFeedback({ type: "error", message: data.error || `Failed to send ${emailType} email` });
        setTimeout(() => setEmailFeedback(null), 5000);
      }
    } catch (err: any) {
      setEmailFeedback({ type: "error", message: err.message || "Failed to send email" });
      setTimeout(() => setEmailFeedback(null), 5000);
    } finally {
      setSendingEmail(null);
    }
  };

  // Email stats
  const welcomeSent = emailLogs.find(l => l.email_type === "welcome" && l.status === "sent");
  const welcomeFailed = emailLogs.find(l => l.email_type === "welcome" && l.status === "failed");
  const enrollmentSent = emailLogs.find(l => l.email_type === "enrollment" && l.status === "sent");
  const enrollmentFailed = emailLogs.find(l => l.email_type === "enrollment" && l.status === "failed");

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

        {/* Content - Scrollable */}
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

          {/* ── EMAIL MANAGEMENT ── */}
          <div className="mb-6">
              <h3 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider mb-3">
              📧 Email Management
            </h3>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/50 p-4 space-y-3">
              {/* Email feedback */}
              {emailFeedback && (
                <div className={`px-3 py-2 rounded-lg text-[11px] font-medium ${
                  emailFeedback.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
                }`}>
                  {emailFeedback.message}
                </div>
              )}

              {/* Send Welcome Email */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-neutral-800 dark:text-neutral-200">Welcome Email</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-500 mt-0.5">
                    Payment instructions, account details, WhatsApp admin
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {welcomeSent && (
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sent
                    </span>
                  )}
                  {welcomeFailed && (
                    <span className="text-[10px] font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Failed
                    </span>
                  )}
                  <button
                    onClick={() => handleSendEmail("welcome")}
                    disabled={sendingEmail === "welcome"}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-teal-200 dark:border-teal-500/20 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[11px] font-medium hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingEmail === "welcome" ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700/50" />

              {/* Send Enrollment Email */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-neutral-800 dark:text-neutral-200">Enrollment Email</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-500 mt-0.5">
                    Login credentials, PIN, dashboard link
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {student.status === "enrolled" ? (
                    <>
                      {enrollmentSent && (
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Sent
                        </span>
                      )}
                      {enrollmentFailed && (
                        <span className="text-[10px] font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Failed
                        </span>
                      )}
                      <button
                        onClick={() => handleSendEmail("enrollment")}
                        disabled={sendingEmail === "enrollment"}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingEmail === "enrollment" ? (
                          <>
                            <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600 italic">
                      Enroll first
                    </span>
                  )}
                </div>
              </div>

              {/* Email Log */}
              {emailLogs.length > 0 && (
                <div className="border-t border-neutral-200 dark:border-neutral-700/50 pt-3">
                  <p className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider mb-2">
                    Email History ({emailLogs.length})
                  </p>
                  <div className="space-y-1.5">
                    {emailLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md bg-white dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-700/50">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            log.status === "sent" ? "bg-emerald-500" :
                            log.status === "failed" ? "bg-red-500" :
                            log.status === "bounced" ? "bg-orange-500" :
                            "bg-blue-500"
                          }`} />
                          <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                            {log.email_type}
                          </span>
                          <span className={`text-[9px] font-medium capitalize ${
                            log.status === "sent" ? "text-emerald-600 dark:text-emerald-400" :
                            log.status === "failed" ? "text-red-600 dark:text-red-400" :
                            log.status === "bounced" ? "text-orange-600 dark:text-orange-400" :
                            "text-blue-600 dark:text-blue-400"
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <span className="text-[9px] text-neutral-400 dark:text-neutral-600 shrink-0">
                          {new Date(log.sent_at).toLocaleString("en-US", {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                        {log.error_message && (
                          <span title={log.error_message} className="text-[9px] text-red-500 truncate max-w-[100px]">
                            {log.error_message}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          {enrollError && (
            <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 text-[11px] text-red-600 dark:text-red-400">
              {enrollError}
            </div>
          )}
          {student.status !== "enrolled" && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full py-2.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[13px] font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrolling ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enrolling...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Enroll Student
                </>
              )}
            </button>
          )}
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