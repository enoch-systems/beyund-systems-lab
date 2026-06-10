"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { BookOpen, Plus, Search, ChevronRight, Eye, Loader2, Trash2, CalendarDays, X } from "lucide-react";
import CreateCourseModal from "@/client/components/admin/CreateCourseModal";
import CourseDetailView from "@/client/components/admin/CourseDetailView";

interface Course {
  id: string;
  title: string;
  total_weeks: number;
  status: string;
  created_at: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [viewCourse, setViewCourse] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setCourses(data);
    setLoading(false);
  }

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  // If viewing a course detail
  if (viewCourse) {
    return (
      <CourseDetailView
        courseId={viewCourse}
        onBack={() => setViewCourse(null)}
        onUpdated={loadCourses}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* ═══════════════════════════════════════════
         HEADER SECTION — Apple-aligned responsive row
         ═══════════════════════════════════════════ */}
      {/* Desktop: single row with title + search + action */}
      <div className="hidden lg:flex items-center justify-between gap-5">
        {/* Title */}
        <div className="shrink-0">
          <h1 className="text-[20px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em] leading-tight">
            Courses
          </h1>
          <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-0.5">
            {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search — centered, max-width constrained */}
        <div className="relative flex-1 max-w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#86868b] pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[30px] pl-8 pr-8 rounded-[6px] bg-white dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1a1a1a] text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Action */}
        <button
          onClick={() => setShowCreate(true)}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 h-[30px] px-3 rounded-[6px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-3 h-3" />
          New Course
        </button>
      </div>

      {/* Tablet (md): stacked title + search row, action aligned right */}
      <div className="hidden md:flex lg:hidden flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em] leading-tight">
              Courses
            </h1>
            <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-0.5">
              {courses.length} course{courses.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center gap-1.5 h-[30px] px-3 rounded-[6px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] shadow-sm"
          >
            <Plus className="w-3 h-3" />
            New Course
          </button>
        </div>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#86868b] pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[30px] pl-8 pr-8 rounded-[6px] bg-white dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1a1a1a] text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile (< md): full-width stacked */}
      <div className="md:hidden flex flex-col gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em] leading-tight">
            Courses
          </h1>
          <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-0.5">
            {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#86868b] pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[30px] pl-8 pr-8 rounded-[6px] bg-white dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1a1a1a] text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-full inline-flex items-center justify-center gap-1.5 h-[30px] rounded-[6px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-3 h-3" />
          New Course
        </button>
      </div>

      {/* ═══════════════════════════════════════════
         CONTENT SECTION — Course Grid / Empty State
         ═══════════════════════════════════════════ */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#86868b] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 px-4">
          <div className="w-16 h-16 mx-auto mb-5 rounded-[18px] bg-[#f2f2f7] dark:bg-[#181818] flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#86868b]" />
          </div>
          <p className="text-[17px] text-[#1d1d1f] dark:text-white font-semibold">
            {search ? "No courses match your search" : "No courses yet"}
          </p>
          <p className="text-[14px] text-[#86868b] dark:text-[#98989d] mt-1.5 max-w-sm mx-auto">
            {search ? "Try a different search term or clear the filter" : "Create your first course to get started"}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 inline-flex items-center gap-2 h-[42px] px-5 rounded-[10px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Course
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((course) => (
            <button
              key={course.id}
              onClick={() => setViewCourse(course.id)}
              className="group text-left rounded-[12px] border border-[#e2e8f0] dark:border-[#1a1a1a] bg-white dark:bg-[#121212] p-4 hover:border-[#d0d0d5] dark:hover:border-[#4a4a4c] hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)] transition-all duration-200 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-8 h-8 rounded-[10px] border border-[#e2e8f0] dark:border-[#1a1a1a] bg-[#f1f5f9] dark:bg-[#181818] flex items-center justify-center group-hover:bg-[#e8e8ed] dark:group-hover:bg-[#38383a] transition-colors">
                  <BookOpen className="w-4 h-4 text-[#8940fa]" />
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#d0d0d5] dark:text-[#4a4a4c] group-hover:text-[#86868b] transition-colors shrink-0 mt-1" />
              </div>
              <h3 className="text-[13px] font-semibold text-[#1d1d1f] dark:text-white leading-snug line-clamp-2">
                {course.title}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#86868b] dark:text-[#98989d]">
                  <CalendarDays className="w-3 h-3" />
                  {course.total_weeks} week{course.total_weeks !== 1 ? "s" : ""}
                </div>
                <span className="text-[11px] text-[#d0d0d5] dark:text-[#4a4a4c]">·</span>
                <span className="text-[11px] text-[#86868b] dark:text-[#98989d]">
                  {new Date(course.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {/* Status indicator dot */}
              <div className="mt-2 pt-2.5 border-t border-[#e2e8f0] dark:border-[#1a1a1a] flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    course.status === "active"
                      ? "bg-[#30d158]"
                      : course.status === "draft"
                      ? "bg-[#ff9f0a]"
                      : "bg-[#86868b]"
                  }`}
                />
                <span className="text-[10px] font-medium text-[#86868b] dark:text-[#98989d] capitalize">
                  {course.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      <CreateCourseModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={loadCourses}
      />
    </div>
  );
}