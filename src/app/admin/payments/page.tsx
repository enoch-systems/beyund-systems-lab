"use client";

import { useState } from "react";
import { CreditCard, Search, Download } from "lucide-react";

const payments = [
  { id: 1, student: "Sarah Johnson", email: "sarah.j@example.com", amount: 150000, currency: "NGN", status: "paid" as const, ref: "PAY-001", date: "2026-05-15", notes: "Full payment" },
  { id: 2, student: "Michael Chen", email: "michael.c@example.com", amount: 75000, currency: "NGN", status: "partial" as const, ref: "PAY-002", date: "2026-05-20", notes: "First installment" },
  { id: 3, student: "Amanda Williams", email: "amanda.w@example.com", amount: 150000, currency: "NGN", status: "pending" as const, ref: "-", date: "-", notes: "Awaiting payment" },
  { id: 4, student: "David Okafor", email: "david.o@example.com", amount: 150000, currency: "NGN", status: "paid" as const, ref: "PAY-003", date: "2026-05-10", notes: "Full payment" },
  { id: 5, student: "Chioma Nwosu", email: "chioma.n@example.com", amount: 0, currency: "NGN", status: "waived" as const, ref: "WAIVE-001", date: "2026-05-01", notes: "Scholarship" },
  { id: 6, student: "Emeka Obi", email: "emeka.o@example.com", amount: 75000, currency: "NGN", status: "partial" as const, ref: "PAY-004", date: "2026-05-25", notes: "Second installment pending" },
];

const statusStyles = {
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  partial: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  waived: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400",
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = payments.filter((p) => {
    const m = filter === "all" || p.status === filter;
    const s = p.student.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase());
    return m && s;
  });

  const totalCollected = payments.filter((p) => p.status === "paid" || p.status === "partial").reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Payments & Tuition</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Track tuition payments across all students.</p>
        </div>
        <button className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-600 uppercase">Collected</p>
          <p className="text-lg font-bold text-neutral-900 dark:text-white mt-1">₦{totalCollected.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-600 uppercase">Paid</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{payments.filter((p) => p.status === "paid").length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-600 uppercase">Pending</p>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">{payments.filter((p) => p.status === "pending").length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-4">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-600 uppercase">Partial/Waived</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{payments.filter((p) => p.status === "partial" || p.status === "waived").length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search by name or reference..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm"
          style={{ colorScheme: "dark" }}>
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="waived">Waived</option>
        </select>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800/80">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Reference</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-medium text-neutral-900 dark:text-white">{p.student}</p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-600">{p.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-neutral-900 dark:text-white">
                    {p.status === "waived" ? "—" : `₦${p.amount.toLocaleString()}`}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-neutral-400 dark:text-neutral-600 font-mono">{p.ref}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusStyles[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-neutral-400 dark:text-neutral-600">{p.date}</td>
                  <td className="px-5 py-3.5 text-[12px] text-neutral-400 dark:text-neutral-600">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}