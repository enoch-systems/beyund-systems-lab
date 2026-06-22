"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { Award, Search, Download, CheckCircle, XCircle, Loader2, Users, FileText } from "lucide-react";

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
      const { data: enrolled } = await supabase
        .from("student_registrations")
        .select("*")
        .eq("status", "enrolled")
        .order("created_at", { ascending: false });

      if (enrolled) {
        setStudents(enrolled as Student[]);
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Loading students...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            Certificates
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            Manage course completion and certificate issuance.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-bg-secondary)" }}>
            <Users className="w-8 h-8" style={{ color: "var(--color-text-tertiary)" }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>No enrolled students yet</h3>
          <p className="text-sm max-w-sm" style={{ color: "var(--color-text-tertiary)" }}>
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
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            Certificates
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            Manage course completion and certificate issuance.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer" style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-default)" }}>
          <Download className="w-3.5 h-3.5" /> Bulk Issue
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg text-xs transition-all"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--color-bg-secondary)" }}>
          {(["all", "eligible", "issued"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer"
              style={
                filter === tab
                  ? {
                      background: "var(--color-bg-elevated)",
                      color: "var(--color-text-primary)",
                      boxShadow: "var(--shadow-sm)",
                    }
                  : {
                      color: "var(--color-text-tertiary)",
                    }
              }
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
            className="rounded-xl border p-4 transition-all"
            style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                  <Award className="w-4 h-4" style={{ color: "#f59e0b" }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {c.student.full_name}
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                    {c.student.course_applying_for} · {c.student.email}
                  </p>
                </div>
              </div>
              {c.issued ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                  <CheckCircle className="w-3 h-3" /> Issued
                </span>
              ) : c.eligible ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
                  <Award className="w-3 h-3" /> Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md" style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-tertiary)" }}>
                  <XCircle className="w-3 h-3" /> Ineligible
                </span>
              )}
            </div>
            {c.issued && (
              <div className="flex items-center gap-4 text-[11px] mt-2 pt-2.5" style={{ borderTop: "1px solid var(--color-border-default)", color: "var(--color-text-tertiary)" }}>
                <span>
                  Cert ID: <span className="font-mono" style={{ color: "var(--color-text-secondary)" }}>{c.certId}</span>
                </span>
                <span>Issued: {c.issueDate}</span>
              </div>
            )}
            {c.eligible && !c.issued && (
              <button
                onClick={() => handleIssueCertificate(c.student)}
                className="mt-2.5 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
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
                Issue Certificate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}