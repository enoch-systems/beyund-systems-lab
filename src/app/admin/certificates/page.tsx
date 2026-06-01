"use client";

import { useState } from "react";
import { Award, Search, Download, CheckCircle, XCircle } from "lucide-react";

const certificates = [
  { id: 1, student: "Sarah Johnson", course: "Introduction to Programming", cohort: "Cohort A", eligible: true, issued: true, issueDate: "2026-04-15", certId: "CERT-001" },
  { id: 2, student: "Michael Chen", course: "Introduction to Programming", cohort: "Cohort A", eligible: true, issued: true, issueDate: "2026-04-15", certId: "CERT-002" },
  { id: 3, student: "David Okafor", course: "Introduction to Programming", cohort: "Cohort A", eligible: true, issued: false, issueDate: "-", certId: "-" },
  { id: 4, student: "Chioma Nwosu", course: "Introduction to Programming", cohort: "Cohort A", eligible: false, issued: false, issueDate: "-", certId: "-" },
  { id: 5, student: "Amanda Williams", course: "Full Stack Fundamentals", cohort: "Cohort A", eligible: false, issued: false, issueDate: "-", certId: "-" },
];

export default function CertificatesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "eligible" | "issued">("all");

  const filtered = certificates.filter((c) => {
    if (filter === "eligible") return c.eligible;
    if (filter === "issued") return c.issued;
    return true;
  }).filter((c) => c.student.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Certificates</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Manage course completion and certificate issuance.</p>
        </div>
        <button className="px-3 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Bulk Issue
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10" />
        </div>
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
          {(["all", "eligible", "issued"] as const).map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${filter === tab ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{c.student}</h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{c.course} · {c.cohort}</p>
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
                <span>Cert ID: <span className="font-mono">{c.certId}</span></span>
                <span>Issued: {c.issueDate}</span>
              </div>
            )}
            {c.eligible && !c.issued && (
              <button className="mt-3 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-medium hover:bg-neutral-800 transition-colors">
                Issue Certificate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}