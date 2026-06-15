"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { useTheme } from "@/contexts/theme-context";
import { getColors, type Colors } from "@/config/theme-colors";
import {
  BookOpen, ClipboardList, Calendar, TrendingUp,
  CheckCircle, Clock, Award, ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface StudentData {
  id: string;
  full_name: string;
  email: string;
  course_id?: string;
  cohort?: string;
}

interface CourseData {
  id: string;
  title: string;
  code: string;
  description: string;
  instructor: string;
  cohort: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface WeekData {
  id: string;
  week_number: number;
  title: string;
  status: string;
}

interface AssignmentData {
  id: string;
  title: string;
  course_id: string;
  due_date: string;
  status: string;
  week_id?: string;
}

interface SubmissionData {
  id: string;
  assignment_id: string;
  status: string;
  grade?: number;
  submitted_at: string;
}

interface ProgressData {
  week_id: string;
  completed: boolean;
  attendance_status: string;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { theme } = useTheme();
  const C = getColors(theme);

  const [student, setStudent] = useState<StudentData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard — Student Portal";
  }, []);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/students-portal/login"); return; }

      // Get student
      const { data: sData } = await supabase
        .from("students")
        .select("*")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!sData) { router.push("/students-portal/login"); return; }
      setStudent(sData);

      // Get course if assigned
      if (sData.course_id) {
        const { data: cData } = await supabase
          .from("courses")
          .select("*")
          .eq("id", sData.course_id)
          .single();
        if (cData) setCourse(cData as CourseData);

        // Get weeks
        const { data: wData } = await supabase
          .from("course_weeks")
          .select("*")
          .eq("course_id", sData.course_id)
          .order("week_number", { ascending: true });
        if (wData) setWeeks(wData as WeekData[]);

        // Get assignments
        const { data: aData } = await supabase
          .from("assignments")
          .select("*")
          .eq("course_id", sData.course_id)
          .order("created_at", { ascending: false });
        if (aData) setAssignments(aData as AssignmentData[]);

        // Get submissions
        const { data: subData } = await supabase
          .from("submissions")
          .select("*")
          .eq("student_id", sData.id);
        if (subData) setSubmissions(subData as SubmissionData[]);

        // Get weekly progress
        const { data: pData } = await supabase
          .from("weekly_progress")
          .select("*")
          .eq("student_id", sData.id);
        if (pData) setProgress(pData as ProgressData[]);
      }

      setLoading(false);
    }
    load();
  }, [router, supabase]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.dim}`, borderTopColor: C.teal }} />
    </div>
  );

  // Stats
  const completedWeeks = weeks.filter(w => w.status === "completed").length;
  const activeWeeks = weeks.filter(w => w.status === "active").length;
  const totalWeeks = weeks.length;
  const progressPercent = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

  const submittedIds = new Set(submissions.filter(s => s.status !== "draft").map(s => s.assignment_id));
  const gradedSubmissions = submissions.filter(s => s.grade !== null && s.grade !== undefined);
  const averageGrade = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length)
    : null;

  const upcomingAssignments = assignments
    .filter(a => !submittedIds.has(a.id) && a.status !== "completed")
    .slice(0, 5);

  const recentSubmissions = submissions
    .filter(s => s.status !== "draft")
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Welcome */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
          Welcome back, {student?.full_name?.split(" ")[0] || "Student"}
        </h1>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
          {course ? course.title : "No course assigned"} · {student?.cohort || "Cohort"}
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gap: 10, marginBottom: 20 }} className="sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          icon={<BookOpen size={14} />}
          label="Course Progress"
          value={`${progressPercent}%`}
          sub={`${completedWeeks}/${totalWeeks} weeks`}
          color={C.teal}
          C={C}
        />
        <StatCard
          icon={<ClipboardList size={14} />}
          label="Assignments"
          value={String(assignments.length)}
          sub={`${submittedIds.size} submitted`}
          color="#3b82f6"
          C={C}
        />
        <StatCard
          icon={<Award size={14} />}
          label="Average Grade"
          value={averageGrade !== null ? `${averageGrade}%` : "—"}
          sub={gradedSubmissions.length > 0 ? `${gradedSubmissions.length} graded` : "No grades yet"}
          color="#f59e0b"
          C={C}
        />
        <StatCard
          icon={<Calendar size={14} />}
          label="Active Weeks"
          value={String(activeWeeks)}
          sub={activeWeeks === 1 ? "current week" : `${activeWeeks} current weeks`}
          color="#8b5cf6"
          C={C}
        />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gap: 16 }} className="md:grid-cols-2">
        {/* Upcoming Assignments */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <ClipboardList size={13} color={C.muted} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Upcoming Assignments</span>
            <Link href="/students-portal/assignments" style={{
              marginLeft: "auto", fontSize: 10, color: C.teal, textDecoration: "none", fontWeight: 500,
            }}>
              View all <ArrowRight size={10} style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          </div>
          {upcomingAssignments.length === 0 ? (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
                {submittedIds.size === assignments.length && assignments.length > 0
                  ? "All assignments submitted! 🎉"
                  : "No upcoming assignments"}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {upcomingAssignments.map(a => {
                const dueDate = a.due_date ? new Date(a.due_date) : null;
                const isOverdue = dueDate && dueDate < new Date();
                const daysLeft = dueDate ? Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                return (
                  <div key={a.id} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px", borderRadius: 4, background: C.bg,
                    border: `1px solid ${C.border}`,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                      background: isOverdue ? C.red : C.teal,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.title}
                      </p>
                      <p style={{ fontSize: 9, color: C.muted, margin: "1px 0 0" }}>
                        {isOverdue ? "Overdue" : daysLeft !== null ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left` : "No due date"}
                      </p>
                    </div>
                    <Link href="/students-portal/assignments" style={{
                      fontSize: 9, color: C.teal, textDecoration: "none", fontWeight: 500, flexShrink: 0,
                    }}>
                      Submit
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <CheckCircle size={13} color={C.muted} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Recent Submissions</span>
          </div>
          {recentSubmissions.length === 0 ? (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>No submissions yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recentSubmissions.map(s => {
                const assignment = assignments.find(a => a.id === s.assignment_id);
                return (
                  <div key={s.id} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px", borderRadius: 4, background: C.bg,
                    border: `1px solid ${C.border}`,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                      background: s.grade !== null ? C.green : C.amber,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {assignment?.title || "Unknown assignment"}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <p style={{ fontSize: 9, color: C.muted, margin: "1px 0 0" }}>
                          {new Date(s.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                        {s.grade !== null && s.grade !== undefined && (
                          <span style={{
                            fontSize: 8, fontWeight: 600, padding: "1px 4px", borderRadius: 2,
                            background: "rgba(34,197,94,0.15)", color: C.green,
                            fontFamily: "'JetBrains Mono','SF Mono',monospace",
                          }}>
                            {s.grade}/100
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly Progress */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <TrendingUp size={13} color={C.muted} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Weekly Progress</span>
            <Link href="/students-portal/courses" style={{
              marginLeft: "auto", fontSize: 10, color: C.teal, textDecoration: "none", fontWeight: 500,
            }}>
              View weeks <ArrowRight size={10} style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          </div>
          {weeks.length === 0 ? (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>No weeks available yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
                {weeks.slice(0, 12).map(w => {
                  const prog = progress.find(p => p.week_id === w.id);
                  const isCompleted = prog?.completed || w.status === "completed";
                  const isActive = w.status === "active";
                  return (
                    <div
                      key={w.id}
                      title={`Week ${w.week_number}: ${w.title} ${isCompleted ? "✓" : ""}`}
                      style={{
                        flex: 1, height: 8, borderRadius: 2,
                        background: isCompleted ? C.green : isActive ? C.teal : C.dim,
                        opacity: isCompleted ? 1 : isActive ? 0.8 : 0.4,
                        cursor: "pointer",
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: C.green }} />
                  <span style={{ fontSize: 8, color: C.muted }}>Done</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: C.teal, opacity: 0.8 }} />
                  <span style={{ fontSize: 8, color: C.muted }}>Active</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: C.dim, opacity: 0.4 }} />
                  <span style={{ fontSize: 8, color: C.muted }}>Upcoming</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Course Info */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <BookOpen size={13} color={C.muted} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Course Info</span>
          </div>
          {course ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{
                padding: "8px 10px", borderRadius: 4, background: C.bg,
                border: `1px solid ${C.border}`,
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{course.title}</p>
                <p style={{ fontSize: 10, color: C.muted, margin: 0, lineHeight: 1.4 }}>{course.description}</p>
              </div>
              <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ padding: "6px 8px", borderRadius: 4, background: C.bg, border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Instructor</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: 0 }}>{course.instructor}</p>
                </div>
                <div style={{ padding: "6px 8px", borderRadius: 4, background: C.bg, border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Cohort</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: 0 }}>{course.cohort}</p>
                </div>
              </div>
              {course.start_date && (
                <div style={{ padding: "6px 8px", borderRadius: 4, background: C.bg, border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Duration</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: 0 }}>
                    {new Date(course.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {course.end_date ? ` — ${new Date(course.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>No course assigned yet.</p>
              <p style={{ fontSize: 10, color: C.muted, margin: "4px 0 0" }}>Contact your admin to get enrolled in a course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, C }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; C: Colors;
}) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
      padding: "12px 14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
          {icon}
        </div>
        <span style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>{label}</span>
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 2px", fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>
        {value}
      </p>
      <p style={{ fontSize: 9, color: C.muted, margin: 0 }}>{sub}</p>
    </div>
  );
}