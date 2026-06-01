"use client";

import { useState, useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  X,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  Pencil,
  Save,
  Trash2,
  Loader2,
  Upload,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  total_weeks: number;
  status: string;
  created_at: string;
}

interface CourseWeek {
  id: string;
  course_id: string;
  week_number: number;
  title: string;
  scheme_of_work: string;
  resources: string;
  status: string;
}

interface Props {
  courseId: string | null;
  onBack: () => void;
  onUpdated: () => void;
}

export default function CourseDetailView({ courseId, onBack, onUpdated }: Props) {
  const [course, setCourse] = useState<Course | null>(null);
  const [weeks, setWeeks] = useState<CourseWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [weekCountInput, setWeekCountInput] = useState("");
  const [settingWeeks, setSettingWeeks] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [editingWeek, setEditingWeek] = useState<{ num: number; field: "title" | "scheme" | "resources" } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingWeek, setSavingWeek] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (courseId) loadCourse();
  }, [courseId]);

  async function loadCourse() {
    setLoading(true);
    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();
    if (courseData) {
      setCourse(courseData);
      setTitleValue(courseData.title);
      setWeekCountInput(courseData.total_weeks.toString());
    }
    const { data: weeksData } = await supabase
      .from("course_weeks")
      .select("*")
      .eq("course_id", courseId)
      .order("week_number", { ascending: true });
    if (weeksData) setWeeks(weeksData);
    setLoading(false);
  }

  async function handleSaveTitle() {
    if (!course || !titleValue.trim()) return;
    await supabase.from("courses").update({ title: titleValue.trim() }).eq("id", course.id);
    setCourse({ ...course, title: titleValue.trim() });
    setEditingTitle(false);
    onUpdated();
  }

  async function handleSetWeeks() {
    if (!course) return;
    const count = parseInt(weekCountInput);
    if (isNaN(count) || count < 1 || count > 52) return;
    setSettingWeeks(true);

    // Update course total_weeks
    await supabase.from("courses").update({ total_weeks: count }).eq("id", course.id);
    setCourse({ ...course, total_weeks: count });

    // Delete existing weeks beyond new count
    await supabase.from("course_weeks").delete().eq("course_id", course.id).gte("week_number", count + 1);

    // Add missing weeks
    for (let i = 1; i <= count; i++) {
      const exists = weeks.find((w) => w.week_number === i);
      if (!exists) {
        await supabase.from("course_weeks").insert({
          course_id: course.id,
          week_number: i,
          title: `Week ${i}`,
          scheme_of_work: "",
          resources: "",
          status: "not_started",
        });
      }
    }

    await loadCourse();
    setSettingWeeks(false);
  }

  const weekFieldMap: Record<string, keyof CourseWeek> = {
    title: "title",
    scheme: "scheme_of_work",
    resources: "resources",
  };

  function startEditWeek(weekNum: number, field: "title" | "scheme" | "resources") {
    const week = weeks.find((w) => w.week_number === weekNum);
    if (!week) return;
    setEditingWeek({ num: weekNum, field });
    setEditValue(String(week[weekFieldMap[field]] || ""));
  }

  async function handleSaveWeek() {
    if (!editingWeek) return;
    setSavingWeek(true);
    const { num, field } = editingWeek;
    const dbField = weekFieldMap[field];
    const update: Record<string, string> = {};
    update[dbField] = editValue;
    await supabase.from("course_weeks").update(update).eq("course_id", courseId).eq("week_number", num);
    setWeeks((prev) => prev.map((w) => (w.week_number === num ? { ...w, [dbField]: editValue } : w)));
    setEditingWeek(null);
    setSavingWeek(false);
  }

  async function handleStatusToggle(weekNum: number, currentStatus: string) {
    const nextStatus =
      currentStatus === "not_started" ? "in_progress" :
      currentStatus === "in_progress" ? "completed" :
      "not_started";
    await supabase.from("course_weeks").update({ status: nextStatus }).eq("course_id", courseId).eq("week_number", weekNum);
    setWeeks((prev) => prev.map((w) => (w.week_number === weekNum ? { ...w, status: nextStatus } : w)));
  }

  async function handleDelete() {
    if (!course || !confirm(`Delete "${course.title}" and all its weeks? This cannot be undone.`)) return;
    await supabase.from("courses").delete().eq("id", course.id);
    onUpdated();
    onBack();
  }

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle className="w-4 h-4 text-[#30d158]" />;
    if (s === "in_progress") return <Clock className="w-4 h-4 text-[#ff9f0a]" />;
    return <Circle className="w-4 h-4 text-[#86868b]" />;
  };

  const statusLabel = (s: string) => {
    if (s === "completed") return "Completed";
    if (s === "in_progress") return "In Progress";
    return "Not Started";
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-6 h-6 text-[#86868b] animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="text-center py-24 text-[15px] text-[#86868b]">Course not found</div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </button>

      {/* Header */}
      <div className={`rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-6 ${editingTitle ? "" : ""}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[20px] font-semibold text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8940fa]/30"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                />
                <button onClick={handleSaveTitle} className="w-9 h-9 rounded-[10px] bg-[#1d1d1f] dark:bg-white flex items-center justify-center text-white dark:text-[#1d1d1f] hover:bg-[#2d2d2f] transition-colors">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em]">{course.title}</h1>
                <button onClick={() => setEditingTitle(true)} className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[13px] text-[#86868b] dark:text-[#98989d]">
                Created {new Date(course.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="text-[13px] text-[#e5e5ea]">·</span>
              <span className="text-[13px] font-medium text-[#1d1d1f] dark:text-white">{course.total_weeks} weeks</span>
            </div>
          </div>
          <button onClick={handleDelete} className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[#86868b] hover:bg-[#ff453a]/10 hover:text-[#ff453a] transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weeks Configuration */}
      <div className="rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-[#86868b]" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white">Course Duration</h3>
            <p className="text-[12px] text-[#86868b] dark:text-[#98989d]">Set the number of weeks for this course</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={52}
            value={weekCountInput}
            onChange={(e) => setWeekCountInput(e.target.value)}
            className="w-24 px-3 py-2.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[15px] text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8940fa]/30"
            placeholder="Weeks"
          />
          <button
            onClick={handleSetWeeks}
            disabled={settingWeeks}
            className="px-4 py-2.5 rounded-[10px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {settingWeeks ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
          </button>
        </div>
      </div>

      {/* Weeks List */}
      {weeks.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 px-1">
            <CalendarDays className="w-4 h-4 text-[#86868b]" />
            <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white">Curriculum</h3>
            <span className="text-[12px] text-[#86868b]">{weeks.filter(w => w.status === "completed").length}/{weeks.length} completed</span>
          </div>

          {weeks
            .sort((a, b) => a.week_number - b.week_number)
            .map((week) => {
              const isOpen = expandedWeek === week.week_number;
              return (
                <div
                  key={week.id}
                  className={`rounded-[14px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] overflow-hidden transition-all duration-200 ${
                    isOpen ? "" : ""
                  }`}
                >
                  {/* Week Header */}
                  <button
                    onClick={() => setExpandedWeek(isOpen ? null : week.week_number)}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#f9f9f9] dark:hover:bg-white/[0.02] transition-colors text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-[10px] flex items-center justify-center cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); handleStatusToggle(week.week_number, week.status); }}
                      title={`Mark as ${week.status === "not_started" ? "in progress" : week.status === "in_progress" ? "completed" : "not started"}`}
                    >
                      {statusIcon(week.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#1d1d1f] dark:text-white">{week.title}</p>
                      <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-0.5">{statusLabel(week.status)}</p>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-[#86868b]" /> : <ChevronRight className="w-4 h-4 text-[#86868b]" />}
                  </button>

                  {/* Expanded Content */}
                  {isOpen && (
                    <div className="px-5 pb-5 space-y-4 border-t border-[#e5e5ea]/50 dark:border-[#38383a]/50 pt-4">
                      {/* Week Title */}
                      <div>
                        <label className="block text-[11px] font-medium text-[#86868b] dark:text-[#98989d] uppercase tracking-wider mb-1.5">Week Title</label>
                        {editingWeek?.num === week.week_number && editingWeek.field === "title" ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[14px] text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8940fa]/30"
                              autoFocus
                            />
                            <button onClick={handleSaveWeek} className="w-8 h-8 rounded-[8px] bg-[#1d1d1f] dark:bg-white flex items-center justify-center text-white dark:text-[#1d1d1f]">
                              {savingWeek ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] text-[#1d1d1f] dark:text-white">{week.title}</p>
                            <button onClick={() => startEditWeek(week.week_number, "title")} className="w-6 h-6 rounded-[6px] flex items-center justify-center text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e]">
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Scheme of Work */}
                      <div>
                        <label className="block text-[11px] font-medium text-[#86868b] dark:text-[#98989d] uppercase tracking-wider mb-1.5">Scheme of Work</label>
                        {editingWeek?.num === week.week_number && editingWeek.field === "scheme" ? (
                          <div className="space-y-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[13px] text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8940fa]/30 resize-none"
                              placeholder="Describe what will be covered this week..."
                            />
                            <button onClick={handleSaveWeek} className="px-3 py-1.5 rounded-[8px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[12px] font-medium">
                              {savingWeek ? "Saving..." : "Save"}
                            </button>
                          </div>
                        ) : (
                          <div className="group flex items-start gap-2">
                            <p className={`text-[13px] leading-relaxed ${week.scheme_of_work ? "text-[#1d1d1f] dark:text-white" : "text-[#86868b] italic"}`}>
                              {week.scheme_of_work || "No scheme of work added yet."}
                            </p>
                            <button onClick={() => startEditWeek(week.week_number, "scheme")} className="w-6 h-6 rounded-[6px] flex items-center justify-center text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] shrink-0 mt-0.5">
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Resources */}
                      <div>
                        <label className="block text-[11px] font-medium text-[#86868b] dark:text-[#98989d] uppercase tracking-wider mb-1.5">Resources</label>
                        {editingWeek?.num === week.week_number && editingWeek.field === "resources" ? (
                          <div className="space-y-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[13px] text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8940fa]/30 resize-none"
                              placeholder="Links, files, or references..."
                            />
                            <div className="flex items-center gap-2">
                              <button onClick={handleSaveWeek} className="px-3 py-1.5 rounded-[8px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[12px] font-medium">
                                {savingWeek ? "Saving..." : "Save"}
                              </button>
                              <button className="px-3 py-1.5 rounded-[8px] border border-[#e5e5ea] dark:border-[#38383a] text-[12px] font-medium text-[#86868b] flex items-center gap-1.5">
                                <Upload className="w-3 h-3" />
                                Upload PDF
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="group flex items-start gap-2">
                            <p className={`text-[13px] leading-relaxed ${week.resources ? "text-[#1d1d1f] dark:text-white" : "text-[#86868b] italic"}`}>
                              {week.resources || "No resources added yet."}
                            </p>
                            <button onClick={() => startEditWeek(week.week_number, "resources")} className="w-6 h-6 rounded-[6px] flex items-center justify-center text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] shrink-0 mt-0.5">
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Empty state */}
      {!loading && weeks.length === 0 && (
        <div className="text-center py-16">
          <CalendarDays className="w-12 h-12 text-[#e5e5ea] dark:text-[#38383a] mx-auto mb-3" />
          <p className="text-[15px] text-[#86868b] font-medium">No weeks defined yet</p>
          <p className="text-[13px] text-[#98989d] mt-1">Set the number of weeks above to build your curriculum</p>
        </div>
      )}
    </div>
  );
}