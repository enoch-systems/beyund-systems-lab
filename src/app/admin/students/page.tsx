"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { StudentRegistration } from "@/lib/types";
import StudentDetailDrawer from "@/components/admin/StudentDetailDrawer";
import ExportReportModal from "@/components/admin/ExportReportModal";
import { Search, ChevronDown, Download, Eye, Mail, MapPin, Phone } from "lucide-react";

const statusOptions = ["pending", "contacted", "enrolled", "rejected"] as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const statusStyles: Record<string, string> = {
  enrolled: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    fetchStudents();
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const prefix = session.user.email.split("@")[0];
        setAdminName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
      }
    })();
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
            Students
          </h1>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            {students.filter((s) => s.status === "enrolled").length} active · {students.filter((s) => s.status === "pending").length} pending · {students.length} total
          </p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[8px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] cursor-pointer shadow-sm shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[34px] pl-8 pr-3 rounded-[8px] bg-white dark:bg-[#1c1c1e] border border-neutral-200/80 dark:border-neutral-800 text-[12px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[34px] px-3 rounded-[8px] bg-white dark:bg-[#1c1c1e] border border-neutral-200/80 dark:border-neutral-800 text-[12px] text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 transition-all cursor-pointer shrink-0"
          style={{ colorScheme: "dark" }}
        >
          <option value="all">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status} className="bg-white dark:bg-[#1c1c1e] text-neutral-900 dark:text-white">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0 self-center ml-auto sm:ml-0 hidden sm:block">
          {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ──────── DESKTOP TABLE (md+) ──────── */}
      <div className="hidden md:block rounded-[16px] border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#1c1c1e] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Student</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em] hidden sm:table-cell">Phone</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em] hidden lg:table-cell">Country</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Course</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em] hidden lg:table-cell">Date</th>
                <th className="px-5 pr-6 py-3.5 text-right text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.06em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/40">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-neutral-400 dark:text-neutral-600">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 dark:from-violet-500/10 dark:to-indigo-500/10 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
                          {getInitials(student.full_name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-neutral-900 dark:text-white truncate">
                            {student.full_name}
                          </p>
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-600 dark:text-neutral-400 whitespace-nowrap hidden sm:table-cell">
                      {student.phone_whatsapp}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-600 dark:text-neutral-400 whitespace-nowrap hidden lg:table-cell">
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
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-[8px] border-0 cursor-pointer focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 ${statusStyles[student.status] || ""}`}
                        style={{ colorScheme: "dark" }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status} className="bg-white dark:bg-[#1c1c1e] text-neutral-900 dark:text-white">
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
                    <td className="px-5 pr-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-neutral-200 dark:border-neutral-700 text-[12px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ──────── MOBILE CARDS (< md) ──────── */}
      <div className="md:hidden space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e]">
            <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">No students found</p>
            <p className="text-[12px] text-neutral-400 dark:text-neutral-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="rounded-[14px] border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#1c1c1e] p-4 space-y-3"
            >
              {/* Top: avatar + name + status */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 dark:from-violet-500/10 dark:to-indigo-500/10 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
                  {getInitials(student.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-neutral-900 dark:text-white truncate">
                    {student.full_name}
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                    {student.email}
                  </p>
                </div>
                <select
                  value={student.status}
                  onChange={(e) =>
                    updateStatus(student.id, e.target.value as StudentRegistration["status"])
                  }
                  disabled={updatingId === student.id}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-[8px] border-0 cursor-pointer ${statusStyles[student.status] || ""}`}
                  style={{ colorScheme: "dark" }}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} className="bg-white dark:bg-[#1c1c1e] text-neutral-900 dark:text-white">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-[12px] text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {student.phone_whatsapp}
                </span>
                {student.country && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {student.country}
                  </span>
                )}
              </div>

              {/* Course + Date */}
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                  {student.course_applying_for}
                </span>
                <span className="text-neutral-400 dark:text-neutral-500">
                  {new Date(student.created_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/40">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="w-full inline-flex items-center justify-center gap-2 h-[38px] rounded-[10px] border border-neutral-200 dark:border-neutral-700 text-[13px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Student Detail Drawer */}
      <StudentDetailDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onDelete={deleteStudent}
        onStatusUpdate={updateStatus}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        students={filteredStudents}
        exportedBy={adminName}
      />
    </div>
  );
}