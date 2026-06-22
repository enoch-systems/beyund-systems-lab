"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { BookOpen, Plus, Search, ChevronRight, Eye, Loader2, Trash2, CalendarDays, X } from "lucide-react";
import CreateCourseModal from "@admin/components/CreateCourseModal";
import CourseDetailView from "@admin/components/CourseDetailView";

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
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════
         HEADER SECTION — Responsive row
         ═══════════════════════════════════════════ */}
      {/* Desktop: single row with title + search + action */}
      <div className="hidden lg:flex items-center justify-between gap-5">
        {/* Title */}
        <div className="shrink-0">
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            Courses
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search — centered, max-width constrained */}
        <div className="relative flex-1 max-w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-9 rounded-lg text-xs transition-all"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--color-text-tertiary)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-tertiary)"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action */}
        <button
          onClick={() => setShowCreate(true)}
          className="shrink-0 inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          style={{
            background: "var(--color-accent-teal)",
            color: "#ffffff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          New Course
        </button>
      </div>

      {/* Tablet (md): stacked title + search row, action aligned right */}
      <div className="hidden md:flex lg:hidden flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
              Courses
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
              {courses.length} course{courses.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            style={{
              background: "var(--color-accent-teal)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Course
          </button>
        </div>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-9 rounded-lg text-xs transition-all"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--color-text-tertiary)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-tertiary)"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile (< md): full-width stacked */}
      <div className="md:hidden flex flex-col gap-3">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            Courses
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-9 rounded-lg text-xs transition-all"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--color-text-tertiary)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-tertiary)"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          style={{
            background: "var(--color-accent-teal)",
            color: "#ffffff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          New Course
        </button>
      </div>

      {/* ═══════════════════════════════════════════
         CONTENT SECTION — Course Grid / Empty State
         ═══════════════════════════════════════════ */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Loading courses...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 px-4">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-default)" }}>
            <BookOpen className="w-8 h-8" style={{ color: "var(--color-text-tertiary)" }} />
          </div>
          <p className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {search ? "No courses match your search" : "No courses yet"}
          </p>
          <p className="text-sm mt-2 max-w-sm mx-auto" style={{ color: "var(--color-text-tertiary)" }}>
            {search ? "Try a different search term or clear the filter" : "Create your first course to get started"}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              style={{
                background: "var(--color-accent-teal)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
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
              className="group text-left rounded-xl border p-5 transition-all duration-200 active:scale-[0.99]"
              style={{
                borderColor: "var(--color-border-default)",
                background: "var(--color-bg-elevated)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-strong)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border-default)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-secondary)" }}>
                  <BookOpen className="w-5 h-5" style={{ color: "#8b5cf6" }} />
                </div>
                <ChevronRight className="w-4 h-4 transition-colors shrink-0 mt-1" style={{ color: "var(--color-border-strong)" }} />
              </div>
              <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: "var(--color-text-primary)" }}>
                {course.title}
              </h3>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  <CalendarDays className="w-3.5 h-3.5" />
                  {course.total_weeks} week{course.total_weeks !== 1 ? "s" : ""}
                </div>
                <span style={{ color: "var(--color-border-strong)" }}>·</span>
                <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                  {new Date(course.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {/* Status indicator dot */}
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border-default)" }}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: course.status === "active" ? "#10b981" : course.status === "draft" ? "#f59e0b" : "var(--color-text-tertiary)",
                    }}
                  />
                  <span className="text-xs font-medium capitalize" style={{ color: "var(--color-text-tertiary)" }}>
                    {course.status}
                  </span>
                </div>
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