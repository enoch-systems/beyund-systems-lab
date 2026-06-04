"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Award, Search, Download, CheckCircle, XCircle, Loader2, Users, FileText } from "lucide-react";
import { apple } from "@/lib/admin-design-system";

type Student = {
  id: string;
  full_name: string;
  email: string;
  course_applying_for: string;
  status: string;
  created_at: string;
};

type Certificate = {
  student: Student;
  eligible: boolean;
  issued: boolean;
  issueDate: string;
  certId: string;
};

export default function CertificatesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "eligible" | "issued">("all");
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Load students who are enrolled
      const { data: enrolled } = await supabase
        .from("student_registrations")
        .select("*")
        .eq("status", "enrolled")
        .order("created_at", { ascending: false });

      if (enrolled) {
        setStudents(enrolled as Student[]);
        // Create certificate objects for each enrolled student
        setCertificates(
          (enrolled as Student[]).map((s) => ({
            student: s,
            eligible: true,
            issued: false,
            issueDate: "-",
            certId: "-",
          }))
        );
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  const filtered = certificates
    .filter((c) => {
      if (filter === "eligible") return c.eligible;
      if (filter === "issued") return c.issued;
      return true;
    })
    .filter((c) =>
      c.student.full_name.toLowerCase().includes(search.toLowerCase())
    );

  const handleIssueCertificate = (student: Student) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.student.id === student.id
          ? {
              ...c,
              issued: true,
              issueDate: new Date().toISOString().split("T")[0],
              certId: `CERT-${String(Date.now()).slice(-6)}`,
            }
          : c
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <p className="text-sm text-neutral-500">Loading students...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-[28px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">Certificates</h1>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">Manage course completion and certificate issuance.</p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No enrolled students yet</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
            Once students are enrolled in courses, they will appear here and you can issue certificates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">Certificates</h1>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">Manage course completion and certificate issuance.</p>
        </div>
        <button className="px-3 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Bulk Issue
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
          {(["all", "eligible", "issued"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                filter === tab
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.student.id}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {c.student.full_name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {c.student.course_applying_for} · {c.student.email}
                  </p>
                </div>
              </div>
              {c.issued ? (
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3 h-3" /> Issued
                </span>
              ) : c.eligible ? (
                <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  <Award className="w-3 h-3" /> Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                  <XCircle className="w-3 h-3" /> Ineligible
                </span>
              )}
            </div>
            {c.issued && (
              <div className="flex items-center gap-4 text-[11px] text-neutral-400 dark:text-neutral-600 mt-2 pt-3 border-t border-neutral-100 dark:border-neutral-800/50">
                <span>
                  Cert ID: <span className="font-mono">{c.certId}</span>
                </span>
                <span>Issued: {c.issueDate}</span>
              </div>
            )}
            {c.eligible && !c.issued && (
              <button
                onClick={() => handleIssueCertificate(c.student)}
                className="mt-3 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                Issue Certificate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}