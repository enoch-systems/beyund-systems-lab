"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { useTheme } from "@/contexts/theme-context";
import { getColors, type Colors } from "@/config/theme-colors";
import {
  BookOpen, Calendar, CheckCircle, Clock,
  ChevronDown, ChevronRight, PlayCircle,
  Lock, FileText,
} from "lucide-react";

interface CourseData {
  id: string;
  title: string;
  code: string;
  description: string;
  instructor: string;
  cohort: string;
  start_date: string;
  end_date: string;
}

interface WeekData {
  id: string;
  week_number: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: string;
}

interface ProgressData {
  week_id: string;
  completed: boolean;
  attendance_status: string;
  notes?: string;
}

interface AssignmentData {
  id: string;
  title: string;
  week_id?: string;
  due_date: string;
  status: string;
}

interface SubmissionData {
  assignment_id: string;
  status: string;
  grade?: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { theme } = useTheme();
  const C = getColors(theme);

  const [course, setCourse] = useState<CourseData | null>(null);
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  useEffect(() => {
    document.title = "My Courses — Student Portal";
  }, []);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/students-portal/login"); return; }

      const { data: sData } = await supabase
        .from("students")
        .select("*")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!sData) { router.push("/students-portal/login"); return; }

      if (sData.course_id) {
        const { data: cData } = await supabase
          .from("courses")
          .select("*")
          .eq("id", sData.course_id)
          .single();
        if (cData) setCourse(cData as CourseData);

        const { data: wData } = await supabase
          .from("course_weeks")
          .select("*")
          .eq("course_id", sData.course_id)
          .order("week_number", { ascending: true });
        if (wData) setWeeks(wData as WeekData[]);

        const { data: pData } = await supabase
          .from("weekly_progress")
          .select("*")
          .eq("student_id", sData.id);
        if (pData) setProgress(pData as ProgressData[]);

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

  const toggleWeek = (weekId: string) => {
    setExpandedWeek(expandedWeek === weekId ? null : weekId);
  };

  const getWeekAssignments = (weekId: string) =>
    assignments.filter(a => a.week_id === weekId);

  const getWeekProgress = (weekId: string) =>
    progress.find(p => p.week_id === weekId);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.dim}`, borderTopColor: C.teal }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
          My Course
        </h1>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
          {course ? `${course.title} · ${course.cohort}` : "No course assigned"}
        </p>
      </div>

      {!course ? (
        <div style={{
          padding: "40px 20px", textAlign: "center",
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
        }}>
          <BookOpen size={32} color={C.dim} style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>No course assigned yet</p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Contact the admin to get enrolled in a course.</p>
        </div>
      ) : (
        <>
          {/* Course Overview */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
            padding: 14, marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: C.teal, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <BookOpen size={16} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{course.title}</p>
                <p style={{ fontSize: 10, color: C.muted, margin: "2px 0 0" }}>{course.code}</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px", lineHeight: 1.5 }}>{course.description}</p>
            <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "6px 8px", borderRadius: 4, background: C.bg, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Instructor</span>
                <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: "2px 0 0" }}>{course.instructor}</p>
              </div>
              <div style={{ padding: "6px 8px", borderRadius: 4, background: C.bg, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Duration</span>
                <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: "2px 0 0" }}>
                  {new Date(course.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {course.end_date ? ` — ${new Date(course.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Weeks */}
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: "0 0 10px" }}>
            Course Weeks ({weeks.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {weeks.length === 0 ? (
              <div style={{
                padding: "20px", textAlign: "center",
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
              }}>
                <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>No weeks have been created yet.</p>
              </div>
            ) : (
              weeks.map((week) => {
                const isExpanded = expandedWeek === week.id;
                const weekProgress = getWeekProgress(week.id);
                const weekAssignments = getWeekAssignments(week.id);
                const isCompleted = weekProgress?.completed || week.status === "completed";
                const isActive = week.status === "active";

                return (
                  <div key={week.id} style={{
                    background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
                    overflow: "hidden",
                  }}>
                    <button
                      onClick={() => toggleWeek(week.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 12px", background: "transparent", border: "none",
                        cursor: "pointer", textAlign: "left", color: C.text,
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isCompleted ? C.green : isActive ? C.teal : C.dim,
                        color: "#fff",
                      }}>
                        {isCompleted ? (
                          <CheckCircle size={13} />
                        ) : isActive ? (
                          <PlayCircle size={13} />
                        ) : (
                          <Lock size={11} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{
                            fontSize: 9, fontWeight: 600, color: C.muted,
                            fontFamily: "'JetBrains Mono','SF Mono',monospace", flexShrink: 0,
                          }}>
                            W{String(week.week_number).padStart(2, "0")}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
                            {week.title}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                          {weekProgress?.attendance_status && weekProgress.attendance_status !== "pending" && (
                            <span style={{
                              fontSize: 8, fontWeight: 500, padding: "1px 4px", borderRadius: 2,
                              background: weekProgress.attendance_status === "present"
                                ? "rgba(34,197,94,0.15)" : weekProgress.attendance_status === "excused"
                                ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                              color: weekProgress.attendance_status === "present"
                                ? C.green : weekProgress.attendance_status === "excused"
                                ? C.amber : C.red,
                            }}>
                              {weekProgress.attendance_status}
                            </span>
                          )}
                          <span style={{ fontSize: 9, color: C.muted }}>
                            {weekAssignments.length} assignment{weekAssignments.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown size={14} color={C.muted} /> : <ChevronRight size={14} color={C.muted} />}
                    </button>

                    {isExpanded && (
                      <div style={{
                        padding: "0 12px 10px", borderTop: `1px solid ${C.border}`,
                      }}>
                        {week.description && (
                          <p style={{ fontSize: 11, color: C.muted, margin: "8px 0", lineHeight: 1.4 }}>
                            {week.description}
                          </p>
                        )}

                        {weekAssignments.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, margin: "0 0 6px" }}>
                              Assignments
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {weekAssignments.map(a => {
                                const sub = submissions.find(s => s.assignment_id === a.id);
                                const isSubmitted = sub && sub.status !== "draft";
                                return (
                                  <div key={a.id} style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "6px 8px", borderRadius: 4, background: C.bg,
                                    border: `1px solid ${C.border}`,
                                  }}>
                                    <FileText size={11} color={isSubmitted ? C.green : C.muted} />
                                    <span style={{ fontSize: 11, color: C.text, flex: 1, minWidth: 0 }}>
                                      {a.title}
                                    </span>
                                    {isSubmitted ? (
                                      <span style={{
                                        fontSize: 8, fontWeight: 600, padding: "1px 4px", borderRadius: 2,
                                        background: "rgba(34,197,94,0.15)", color: C.green,
                                      }}>
                                        {sub?.grade !== null && sub?.grade !== undefined ? `${sub.grade}/100` : "Submitted"}
                                      </span>
                                    ) : (
                                      <span style={{
                                        fontSize: 8, fontWeight: 500, padding: "1px 4px", borderRadius: 2,
                                        background: "rgba(245,158,11,0.15)", color: C.amber,
                                      }}>
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {weekProgress?.notes && (
                          <div style={{
                            marginTop: 8, padding: "6px 8px", borderRadius: 4,
                            background: C.bg, border: `1px solid ${C.border}`,
                          }}>
                            <p style={{ fontSize: 9, color: C.muted, margin: "0 0 2px" }}>Notes</p>
                            <p style={{ fontSize: 11, color: C.text, margin: 0 }}>{weekProgress.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}