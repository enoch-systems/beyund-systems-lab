"use client";

import { useEffect, useRef, useState } from "react";
import StudentDetailDrawer from "@admin/components/StudentDetailDrawer";
import ExportReportModal from "@admin/components/ExportReportModal";
import { Search, ChevronDown, Download, Eye, Mail, MapPin, Phone, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

const ITEMS_PER_PAGE = 15;
const VISIBLE_PAGE_COUNT = 5;

const statusOptions = ["pending", "enrolled", "restricted"] as const;

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  enrolled: { bg: "rgba(16, 185, 129, 0.1)", text: "#10b981", dot: "#10b981" },
  pending: { bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b", dot: "#f59e0b" },
  restricted: { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444", dot: "#ef4444" },
};

const sortOptions = [
  { value: "last-to-join", label: "Last to Join" },
  { value: "first-to-join", label: "First to Join" },
  { value: "a-z", label: "A–Z" },
  { value: "z-a", label: "Z–A" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];
type StudentRecord = any;

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortValue>("last-to-join");
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/admin/students", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setStudents(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStudents([]);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  async function updateStatus(studentId: string, newStatus: string) {
    setUpdatingId(studentId);
    await new Promise((resolve) => setTimeout(resolve, 150));
    setStudents((prev: StudentRecord[]) =>
      prev.map((s: StudentRecord) =>
        s.id === studentId ? { ...s, status: newStatus } : s
      )
    );
    setSelectedStudent((prev: StudentRecord | null) =>
      prev?.id === studentId ? { ...prev, status: newStatus } : prev
    );
    setUpdatingId(null);
  }

  async function deleteStudent(studentId: string) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    setStudents((prev: StudentRecord[]) => prev.filter((s: StudentRecord) => s.id !== studentId));
    setSelectedStudent(null);
  }

  // Filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchQuery === "" ||
      (student.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.phone_whatsapp || "").includes(searchQuery) ||
      (student.country || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "last-to-join":
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case "first-to-join":
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      case "a-z":
        return (a.full_name || "").localeCompare(b.full_name || "");
      case "z-a":
        return (b.full_name || "").localeCompare(a.full_name || "");
      default:
        return 0;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedStudents = sortedStudents.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(safeCurrentPage * ITEMS_PER_PAGE, sortedStudents.length);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const handleSortChange = (value: SortValue) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= VISIBLE_PAGE_COUNT) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, safeCurrentPage - Math.floor(VISIBLE_PAGE_COUNT / 2));
    let end = start + VISIBLE_PAGE_COUNT - 1;

    if (end > totalPages) {
      end = totalPages;
      start = end - VISIBLE_PAGE_COUNT + 1;
    }

    const pages: (number | "...")[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  const pageNumbers = getPageNumbers();

  function goToPage(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function PaginationBar({
    pageNumbers,
    safeCurrentPage,
    totalPages,
    goToPage,
  }: {
    pageNumbers: (number | "...")[];
    safeCurrentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
  }) {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <button
          onClick={() => goToPage(Math.max(1, safeCurrentPage - 1))}
          disabled={safeCurrentPage === 1}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            borderColor: "var(--color-border-default)",
            background: "var(--color-bg-elevated)",
            color: "var(--color-text-secondary)",
          }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pageNumbers.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex items-center justify-center h-8 w-8 text-xs"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              &hellip;
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page as number)}
              className="inline-flex items-center justify-center h-8 min-w-[32px] px-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
              style={
                safeCurrentPage === page
                  ? {
                      background: "var(--color-accent-teal)",
                      color: "#ffffff",
                      boxShadow: "0 2px 8px rgba(20, 184, 166, 0.3)",
                    }
                  : {
                      border: "1px solid var(--color-border-default)",
                      background: "var(--color-bg-elevated)",
                      color: "var(--color-text-secondary)",
                    }
              }
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(Math.min(totalPages, safeCurrentPage + 1))}
          disabled={safeCurrentPage === totalPages}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            borderColor: "var(--color-border-default)",
            background: "var(--color-bg-elevated)",
            color: "var(--color-text-secondary)",
          }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
            Students
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            {students.filter((s) => s.status === "enrolled").length} active · {students.filter((s) => s.status === "pending").length} pending · {students.length} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sortedStudents.length > 0 && (
            <span className="text-xs font-medium whitespace-nowrap" style={{ color: "var(--color-text-tertiary)" }}>
              Showing {startIndex}–{endIndex} of {sortedStudents.length}
            </span>
          )}
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm"
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
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg text-xs transition-all"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          className="h-9 px-3 rounded-lg text-xs cursor-pointer transition-all"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-default)",
            color: "var(--color-text-secondary)",
          }}
        >
          <option value="all">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status} style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-primary)" }}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortValue)}
            className="h-9 pl-9 pr-3 rounded-lg text-xs cursor-pointer transition-all appearance-none"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-secondary)",
            }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-primary)" }}>
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--color-text-tertiary)" }} />
        </div>

        <p className="text-xs font-medium hidden sm:block" style={{ color: "var(--color-text-tertiary)" }}>
          {sortedStudents.length} student{sortedStudents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {totalPages > 1 && (
        <PaginationBar
          pageNumbers={pageNumbers}
          safeCurrentPage={safeCurrentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      )}

      <div className="hidden md:block rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border-default)" }}>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Student</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: "var(--color-text-tertiary)" }}>Phone</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: "var(--color-text-tertiary)" }}>Country</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Course</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: "var(--color-text-tertiary)" }}>Date</th>
                <th className="px-4 pr-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ "--tw-divide-opacity": "1", divideColor: "var(--color-border-subtle)" } as any}>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                    No students found.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, index) => (
                  <tr key={student.id} className="transition-colors" style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold shrink-0 w-5 text-right" style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>
                          #{(safeCurrentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{student.full_name}</p>
                          <p className="text-[11px] truncate" style={{ color: "var(--color-text-tertiary)" }}>{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap hidden sm:table-cell" style={{ color: "var(--color-text-secondary)" }}>{student.phone_whatsapp}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap hidden lg:table-cell" style={{ color: "var(--color-text-secondary)" }}>{student.country}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--color-text-secondary)" }}>{student.course_applying_for}</td>
                    <td className="px-4 py-3">
                      <select
                        value={student.status}
                        onChange={(e) => updateStatus(student.id, e.target.value)}
                        disabled={updatingId === student.id}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md border-0 cursor-pointer"
                        style={{
                          background: statusStyles[student.status]?.bg || "transparent",
                          color: statusStyles[student.status]?.text || "var(--color-text-secondary)",
                        }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status} style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-primary)" }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap hidden lg:table-cell" style={{ color: "var(--color-text-tertiary)" }}>
                      {new Date(student.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 pr-5 py-3 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer"
                        style={{
                          borderColor: "var(--color-border-default)",
                          background: "var(--color-bg-secondary)",
                          color: "var(--color-text-secondary)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--color-bg-tertiary)";
                          e.currentTarget.style.borderColor = "var(--color-border-strong)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--color-bg-secondary)";
                          e.currentTarget.style.borderColor = "var(--color-border-default)";
                        }}
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

      <div className="md:hidden space-y-3">
        {paginatedStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--color-bg-secondary)" }}>
              <Search className="w-6 h-6" style={{ color: "var(--color-text-tertiary)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>No students found</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          paginatedStudents.map((student, index) => (
            <div key={student.id} className="rounded-2xl border p-4 space-y-3" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold shrink-0" style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>
                  #{(safeCurrentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{student.full_name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--color-text-tertiary)" }}>{student.email}</p>
                </div>
                <select
                  value={student.status}
                  onChange={(e) => updateStatus(student.id, e.target.value)}
                  disabled={updatingId === student.id}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-md border-0 cursor-pointer"
                  style={{
                    background: statusStyles[student.status]?.bg || "transparent",
                    color: statusStyles[student.status]?.text || "var(--color-text-secondary)",
                  }}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-primary)" }}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3" style={{ color: "var(--color-text-tertiary)" }} />
                  {student.phone_whatsapp}
                </span>
                {student.country && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" style={{ color: "var(--color-text-tertiary)" }} />
                    {student.country}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-medium" style={{ color: "var(--color-text-secondary)" }}>{student.course_applying_for}</span>
                <span style={{ color: "var(--color-text-tertiary)" }}>
                  {new Date(student.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                </span>
              </div>

              <div className="pt-3" style={{ borderTop: "1px solid var(--color-border-default)" }}>
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-[0.98]"
                  style={{
                    borderColor: "var(--color-border-default)",
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-bg-tertiary)";
                    e.currentTarget.style.borderColor = "var(--color-border-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--color-bg-secondary)";
                    e.currentTarget.style.borderColor = "var(--color-border-default)";
                  }}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <PaginationBar
          pageNumbers={pageNumbers}
          safeCurrentPage={safeCurrentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      )}

      <StudentDetailDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onDelete={deleteStudent}
        onStatusUpdate={updateStatus}
      />

      <ExportReportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        students={filteredStudents}
        exportedBy={adminName}
      />
    </div>
  );
}