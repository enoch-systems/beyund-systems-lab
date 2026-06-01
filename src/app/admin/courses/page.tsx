"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { BookOpen, Plus, Search, ChevronRight, Eye, Loader2, Trash2, CalendarDays } from "lucide-react";
import CreateCourseModal from "@/components/admin/CreateCourseModal";
import CourseDetailView from "@/components/admin/CourseDetailView";

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em]">
            Courses
          </h1>
          <p className="text-[15px] text-[#86868b] dark:text-[#98989d] mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[14px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[14px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all active:scale-[0.98] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]"
        >
          <Plus className="w-4 h-4" />
          New Course
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[15px] text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#8940fa]/30 focus:border-[#8940fa] transition-all"
        />
      </div>

      {/* Course List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#86868b] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <BookOpen className="w-14 h-14 text-[#e5e5ea] dark:text-[#38383a] mx-auto mb-4" />
          <p className="text-[17px] text-[#86868b] font-medium">
            {search ? "No courses match your search" : "No courses yet"}
          </p>
          <p className="text-[14px] text-[#98989d] mt-1">
            {search ? "Try a different search term" : "Create your first course to get started"}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-[14px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[14px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Course
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((course) => (
            <button
              key={course.id}
              onClick={() => setViewCourse(course.id)}
              className="group text-left rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-5 hover:border-[#d0d0d5] dark:hover:border-[#4a4a4c] hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)] transition-all duration-200 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center group-hover:bg-[#e8e8ed] dark:group-hover:bg-[#38383a] transition-colors">
                  <BookOpen className="w-5 h-5 text-[#8940fa]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#e5e5ea] dark:text-[#38383a] group-hover:text-[#86868b] transition-colors shrink-0 mt-1" />
              </div>
              <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white leading-snug">
                {course.title}
              </h3>
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center gap-1.5 text-[12px] text-[#86868b] dark:text-[#98989d]">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {course.total_weeks} week{course.total_weeks !== 1 ? "s" : ""}
                </div>
                <span className="text-[12px] text-[#e5e5ea] dark:text-[#38383a]">·</span>
                <span className="text-[12px] text-[#86868b] dark:text-[#98989d]">
                  {new Date(course.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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