"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { useTheme } from "@/contexts/theme-context";
import { getColors, type Colors } from "@/config/theme-colors";
import {
  ClipboardList, FileText, CheckCircle, Clock,
  Upload, X, ArrowRight, AlertCircle,
  ExternalLink, Loader2,
} from "lucide-react";
import Link from "next/link";

interface AssignmentData {
  id: string;
  title: string;
  description?: string;
  course_id: string;
  week_id?: string;
  due_date: string;
  total_points: number;
  status: string;
}

interface SubmissionData {
  id: string;
  assignment_id: string;
  submission_url?: string;
  submission_text?: string;
  submitted_at: string;
  status: string;
  grade?: number;
  feedback?: string;
  graded_at?: string;
}

interface WeekData {
  id: string;
  week_number: number;
  title: string;
}

export default function AssignmentsPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { theme } = useTheme();
  const C = getColors(theme);

  const [studentId, setStudentId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit modal state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentData | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    document.title = "Assignments — Student Portal";
  }, []);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/students-portal/login"); return; }

      const { data: sData } = await supabase
        .from("students")
        .select("id, course_id")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!sData) { router.push("/students-portal/login"); return; }
      setStudentId(sData.id);

      if (sData.course_id) {
        const { data: wData } = await supabase
          .from("course_weeks")
          .select("id, week_number, title")
          .eq("course_id", sData.course_id)
          .order("week_number", { ascending: true });
        if (wData) setWeeks(wData as WeekData[]);

        const { data: aData } = await supabase
          .from("assignments")
          .select("*")
          .eq("course_id", sData.course_id)
          .order("created_at", { ascending: false });
        if (aData) setAssignments(aData as AssignmentData[]);

        const { data: subData } = await supabase
          .from("submissions")
          .select("*")
          .eq("student_id", sData.id);
        if (subData) setSubmissions(subData as SubmissionData[]);
      }

      setLoading(false);
    }
    load();
  }, [router, supabase]);

  const getWeekName = (weekId?: string) => {
    if (!weekId) return null;
    const week = weeks.find(w => w.id === weekId);
    return week ? `Week ${week.week_number}: ${week.title}` : null;
  };

  const getSubmission = (assignmentId: string) =>
    submissions.find(s => s.assignment_id === assignmentId);

  const openSubmitModal = (assignment: AssignmentData) => {
    const existing = getSubmission(assignment.id);
    setSelectedAssignment(assignment);
    setSubmissionUrl(existing?.submission_url || "");
    setSubmissionText(existing?.submission_text || "");
    setSubmitError("");
    setSubmitModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !studentId) return;
    if (!submissionUrl && !submissionText) {
      setSubmitError("Please provide either a URL or text submission.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const existing = getSubmission(selectedAssignment.id);
      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("submissions")
          .update({
            submission_url: submissionUrl || null,
            submission_text: submissionText || null,
            status: "submitted",
            submitted_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from("submissions")
          .insert({
            student_id: studentId,
            assignment_id: selectedAssignment.id,
            submission_url: submissionUrl || null,
            submission_text: submissionText || null,
            status: "submitted",
          });

        if (error) throw error;
      }

      // Refresh submissions
      const { data: subData } = await supabase
        .from("submissions")
        .select("*")
        .eq("student_id", studentId);
      if (subData) setSubmissions(subData as SubmissionData[]);

      setSubmitModalOpen(false);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (assignmentId: string) => {
    const sub = getSubmission(assignmentId);
    if (!sub || sub.status === "draft") {
      return { label: "Pending", color: C.amber, bg: "rgba(245,158,11,0.15)" };
    }
    if (sub.grade !== null && sub.grade !== undefined) {
      return { label: `${sub.grade}/100`, color: C.green, bg: "rgba(34,197,94,0.15)" };
    }
    return { label: "Submitted", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" };
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.dim}`, borderTopColor: C.teal }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
          Assignments
        </h1>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
          {assignments.length} total · {submissions.filter(s => s.status !== "draft").length} submitted
        </p>
      </div>

      {assignments.length === 0 ? (
        <div style={{
          padding: "40px 20px", textAlign: "center",
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
        }}>
          <ClipboardList size={32} color={C.dim} style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>No assignments yet</p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Assignments will appear here once your instructor creates them.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {assignments.map((assignment) => {
            const sub = getSubmission(assignment.id);
            const statusStyle = getStatusStyle(assignment.id);
            const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
            const isOverdue = dueDate && dueDate < new Date() && (!sub || sub.status === "draft");
            const weekName = getWeekName(assignment.week_id);
            const hasFeedback = sub?.feedback;

            return (
              <div key={assignment.id} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
                padding: "12px 14px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: sub && sub.status !== "draft" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                    color: sub && sub.status !== "draft" ? C.green : C.amber,
                  }}>
                    {sub && sub.status !== "draft" ? <CheckCircle size={14} /> : <FileText size={14} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{assignment.title}</span>
                      <span style={{
                        fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 2,
                        background: statusStyle.bg, color: statusStyle.color,
                        fontFamily: "'JetBrains Mono','SF Mono',monospace", flexShrink: 0,
                      }}>
                        {statusStyle.label}
                      </span>
                    </div>

                    {weekName && (
                      <p style={{ fontSize: 9, color: C.muted, margin: "0 0 6px" }}>
                        {weekName}
                      </p>
                    )}

                    {assignment.description && (
                      <p style={{ fontSize: 10, color: C.muted, margin: "0 0 8px", lineHeight: 1.4 }}>
                        {assignment.description}
                      </p>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      {dueDate && (
                        <span style={{
                          fontSize: 9, color: isOverdue ? C.red : C.muted,
                          display: "flex", alignItems: "center", gap: 3,
                        }}>
                          <Clock size={9} />
                          Due: {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}

                      <span style={{
                        fontSize: 9, color: C.muted,
                        fontFamily: "'JetBrains Mono','SF Mono',monospace",
                      }}>
                        {assignment.total_points} pts
                      </span>
                    </div>

                    {/* Feedback */}
                    {hasFeedback && (
                      <div style={{
                        marginTop: 8, padding: "6px 8px", borderRadius: 4,
                        background: C.bg, border: `1px solid ${C.border}`,
                      }}>
                        <p style={{ fontSize: 9, color: C.muted, margin: "0 0 2px" }}>Instructor Feedback</p>
                        <p style={{ fontSize: 10, color: C.text, margin: 0, whiteSpace: "pre-wrap" }}>
                          {sub?.feedback}
                        </p>
                      </div>
                    )}

                    {/* Submission Info */}
                    {sub && sub.status !== "draft" && sub.submission_url && (
                      <div style={{ marginTop: 6 }}>
                        <a href={sub.submission_url} target="_blank" rel="noopener noreferrer"
                          style={{
                            fontSize: 9, color: C.teal, textDecoration: "none",
                            display: "inline-flex", alignItems: "center", gap: 3,
                          }}>
                          <ExternalLink size={9} />
                          View submission
                        </a>
                      </div>
                    )}
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    {sub && sub.status !== "draft" ? (
                      <button onClick={() => openSubmitModal(assignment)}
                        style={{
                          padding: "5px 10px", borderRadius: 4, border: `1px solid ${C.border}`,
                          background: "transparent", color: C.muted, fontSize: 9, fontWeight: 500,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = C.sidebarActive; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        Edit
                      </button>
                    ) : (
                      <button onClick={() => openSubmitModal(assignment)}
                        style={{
                          padding: "5px 10px", borderRadius: 4, border: "none",
                          background: C.teal, color: "#fff", fontSize: 9, fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9" as any; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" as any; }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Modal */}
      {submitModalOpen && selectedAssignment && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99999,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }} onClick={() => !submitting && setSubmitModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "24px", maxWidth: 480, width: "100%",
            boxShadow: "0 20px 48px rgba(0,0,0,0.45)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>Submit Assignment</h2>
                <p style={{ fontSize: 11, color: C.muted, margin: "4px 0 0" }}>{selectedAssignment.title}</p>
              </div>
              <button onClick={() => setSubmitModalOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted, display: "flex" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
                  Submission URL (GitHub, Google Drive, etc.)
                </label>
                <input
                  type="url"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://github.com/your-username/repo"
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 5,
                    border: `1px solid ${C.border}`, background: C.bg, color: C.text,
                    fontSize: 12, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
                  Or paste your submission text
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Paste your assignment content here..."
                  rows={5}
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 5,
                    border: `1px solid ${C.border}`, background: C.bg, color: C.text,
                    fontSize: 12, outline: "none", resize: "vertical",
                    fontFamily: "'JetBrains Mono','SF Mono',monospace",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {submitError && (
                <div style={{
                  padding: "6px 10px", borderRadius: 4,
                  background: "rgba(239,68,68,0.1)", border: `1px solid ${C.red}`,
                  fontSize: 11, color: C.red,
                }}>
                  {submitError}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button onClick={() => setSubmitModalOpen(false)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 5,
                    border: `1px solid ${C.border}`, background: "transparent",
                    color: C.text, fontSize: 11, fontWeight: 500, cursor: "pointer",
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 5,
                    border: "none", background: submitting ? C.dim : C.teal,
                    color: "#fff", fontSize: 11, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}