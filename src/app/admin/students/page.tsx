"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { StudentRegistration } from "@/lib/types";
import StudentDetailDrawer from "@/components/admin/StudentDetailDrawer";
import { Search, ChevronDown, CheckSquare } from "lucide-react";

const statusOptions = ["pending", "contacted", "enrolled", "rejected"] as const;

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data, error } = await supabase
      .from("student_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setStudents(data);
    }
    setLoading(false);
  }

  async function updateStatus(studentId: string, newStatus: StudentRegistration["status"]) {
    setUpdatingId(studentId);
    const { error } = await supabase
      .from("student_registrations")
      .update({ status: newStatus })
      .eq("id", studentId);

    if (!error) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, status: newStatus } : s
        )
      );
      // Update selected student if it's the same one
      setSelectedStudent((prev) =>
        prev?.id === studentId ? { ...prev, status: newStatus } : prev
      );
    }
    setUpdatingId(null);
  }

  async function deleteStudent(studentId: string) {
    const { error } = await supabase
      .from("student_registrations")
      .delete()
      .eq("id", studentId);

    if (!error) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      setSelectedStudent(null);
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchQuery === "" ||
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone_whatsapp.includes(searchQuery) ||
      student.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Student Registrations
        </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {students.filter((s) => s.status === "enrolled").length} active · {students.filter((s) => s.status === "pending").length} pending · {students.length} total
          </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10 focus:border-neutral-300 dark:focus:border-neutral-700 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10 transition-all cursor-pointer"
        >
          <option value="all">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <button className="px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800/80">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider hidden sm:table-cell">
                  Phone
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider hidden md:table-cell">
                  Country
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-neutral-400 dark:text-neutral-600">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 dark:from-violet-500/10 dark:to-indigo-500/10 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-xs font-medium text-neutral-700 dark:text-neutral-300 shrink-0">
                          {student.full_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-neutral-900 dark:text-white truncate">
                            {student.full_name}
                          </p>
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-600 truncate sm:hidden">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-600 dark:text-neutral-400 whitespace-nowrap hidden sm:table-cell">
                      {student.phone_whatsapp}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-600 dark:text-neutral-400 whitespace-nowrap hidden md:table-cell">
                      {student.country}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {student.course_applying_for}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={student.status}
                        onChange={(e) =>
                          updateStatus(student.id, e.target.value as StudentRegistration["status"])
                        }
                        disabled={updatingId === student.id}
                        className={`text-[11px] font-medium px-2 py-1 rounded border-0 cursor-pointer focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10 ${
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
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-neutral-400 dark:text-neutral-600 whitespace-nowrap hidden lg:table-cell">
                      {new Date(student.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[12px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="hidden sm:inline">View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Drawer */}
      <StudentDetailDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onDelete={deleteStudent}
        onStatusUpdate={updateStatus}
      />
    </div>
  );
}