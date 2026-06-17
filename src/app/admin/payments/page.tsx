"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Wallet,
  CheckCircle,
  Clock,
  CreditCard,
  Search,
  X,
  Plus,
  Loader2,
  Receipt,
  Phone,
  BookOpen,
  GraduationCap,
  CalendarDays,
  MoreVertical,
} from "lucide-react";

const DEFAULT_TOTAL_FEE = 150000;

type Student = {
  id: string;
  full_name: string;
  email: string;
  phone_whatsapp?: string;
  course_applying_for: string;
};

type PaymentProfile = {
  id?: string;
  student_id?: string;
  total_fee: number;
  amount_paid: number;
  balance: number;
  payment_status: string;
  updated_at?: string;
};

type Payment = {
  id: string;
  student_id: string;
  amount: number;
  payment_method: string;
  reference?: string;
  notes?: string;
  created_at?: string;
};

type StudentWithProfile = {
  student: Student;
  profile: PaymentProfile | null;
  payments: Payment[];
};

type PaymentStatus = "paid" | "pending" | "installment";

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  paid: { label: "Paid", bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  pending: { label: "Pending", bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  installment: { label: "Installment", bg: "bg-blue-500/10 text-blue-700 dark:text-blue-400", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
};

const methodIcons: Record<string, string> = { cash: "💵", transfer: "🏦", card: "💳", pos: "🖥️", ussd: "📱", other: "📋" };

function formatCurrency(amount: number) { return `₦${amount.toLocaleString()}`; }
function getInitials(name: string) { return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2); }
function formatDate(dateStr: string) { return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }); }

export default function PaymentsPage() {
  const [students, setStudents] = useState<StudentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithProfile | null>(null);
  const [historyStudent, setHistoryStudent] = useState<StudentWithProfile | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sortField, setSortField] = useState<"name" | "course" | "paid" | "balance" | "status" | "date" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, profilesRes, txRes] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/payments/profiles"),
        fetch("/api/admin/payments"),
      ]);
      const studentsData: Student[] = studentsRes.ok ? await studentsRes.json() : [];
      const profilesData: PaymentProfile[] = profilesRes.ok ? await profilesRes.json() : [];
      const paymentsData: Payment[] = txRes.ok ? await txRes.json() : [];

      const profilesMap = new Map((profilesData || []).map((p: PaymentProfile) => [p.student_id, p]));
      const paymentsMap = new Map<string, Payment[]>();
      (paymentsData || []).forEach((p: Payment) => {
        const list = paymentsMap.get(p.student_id) || [];
        list.push(p);
        paymentsMap.set(p.student_id, list);
      });

      const combined: StudentWithProfile[] = studentsData.map((s) => ({
        student: s,
        profile: profilesMap.get(s.id) || null,
        payments: paymentsMap.get(s.id) || [],
      }));

      setStudents(combined);
    } catch {
      setStudents([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totalCollected = students.reduce((sum, s) => sum + (s.profile?.amount_paid || 0), 0);
  const fullyPaid = students.filter((s) => s.profile?.payment_status === "paid").length;
  const pendingPayments = students.filter((s) => !s.profile || s.profile.payment_status === "pending").length;
  const installmentPlans = students.filter((s) => s.profile?.payment_status === "installment").length;
  const totalExpected = students.reduce((sum, s) => sum + (s.profile?.total_fee || DEFAULT_TOTAL_FEE), 0);
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.student.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.student.phone_whatsapp || "").includes(search) ||
      s.student.course_applying_for.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (s.profile?.payment_status || "pending") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField) return 0;
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "name": return a.student.full_name.localeCompare(b.student.full_name) * dir;
      case "course": return a.student.course_applying_for.localeCompare(b.student.course_applying_for) * dir;
      case "paid": return ((a.profile?.amount_paid || 0) - (b.profile?.amount_paid || 0)) * dir;
      case "balance": return ((a.profile?.balance || a.profile?.total_fee || DEFAULT_TOTAL_FEE) - (b.profile?.balance || b.profile?.total_fee || DEFAULT_TOTAL_FEE)) * dir;
      case "status": return (a.profile?.payment_status || "pending").localeCompare(b.profile?.payment_status || "pending") * dir;
      case "date": {
        const da = a.profile?.updated_at ? new Date(a.profile.updated_at).getTime() : 0;
        const db = b.profile?.updated_at ? new Date(b.profile.updated_at).getTime() : 0;
        return (da - db) * dir;
      }
      default: return 0;
    }
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleRecordPayment = async () => {
    if (!selectedStudent || !paymentAmount) return;
    setSubmitting(true);
    const amount = parseFloat(paymentAmount);
    if (!isNaN(amount) && amount > 0) {
      await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent.student.id, amount, method: paymentMethod, reference: paymentRef || `PAY-${Date.now().toString().slice(-6)}`, notes: paymentNotes }),
      });
      await loadData();
    }
    setSubmitting(false);
    setShowPaymentModal(false);
    setSelectedStudent(null);
    setPaymentAmount("");
    setPaymentMethod("transfer");
    setPaymentRef("");
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        <p className="text-sm text-neutral-500">Loading payments...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">Payments</h1>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Track tuition payments and manage student balances.</p>
        </div>
        <button onClick={() => { setSelectedStudent(null); setPaymentAmount(""); setPaymentMethod("transfer"); setPaymentRef(""); setPaymentNotes(""); setShowPaymentModal(true); }} className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[6px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] cursor-pointer shadow-sm shrink-0">
          <Plus className="w-3 h-3" /> Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={<Wallet className="w-5 h-5" />} label="Total Collected" value={formatCurrency(totalCollected)} trend={`${collectionRate}% of expected`} trendType="neutral" />
        <KpiCard icon={<CheckCircle className="w-5 h-5" />} label="Paid Students" value={String(fullyPaid)} trend={`${students.length > 0 ? Math.round((fullyPaid / students.length) * 100) : 0}% completion`} trendType="positive" />
        <KpiCard icon={<Clock className="w-5 h-5" />} label="Pending Payments" value={String(pendingPayments)} trend="Awaiting action" trendType="negative" />
        <KpiCard icon={<CreditCard className="w-5 h-5" />} label="Installments" value={String(installmentPlans)} trend="Active plans" trendType="neutral" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
          <input type="text" placeholder="Search students, courses, or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-[30px] pl-8 pr-3 rounded-[6px] bg-white dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1a1a1a] text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 transition-all" />
        </div>
        <div className="flex items-center gap-1 p-1 bg-neutral-100/80 dark:bg-neutral-800/50 rounded-[8px] shrink-0">
          {(["all", "paid", "pending", "installment"] as const).map((tab) => {
            const cfg = tab === "all" ? { label: "All", bg: "", text: "" } : statusConfig[tab as PaymentStatus];
            return (
            <button key={tab} onClick={() => setStatusFilter(tab)} className={`px-3 py-1.5 rounded-[6px] text-[11px] font-medium transition-all cursor-pointer ${statusFilter === tab ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"}`}>
              {tab === "all" ? "All" : cfg.label + "s"}
            </button>
          );
          })}
        </div>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0 ml-auto sm:ml-0">{sortedStudents.length} student{sortedStudents.length !== 1 ? "s" : ""}</p>
      </div>

      {sortedStudents.length === 0 ? <EmptyState hasSearch={!!search} /> : (
        <>
          <div className="hidden md:block rounded-[16px] border border-[#e2e8f0] dark:border-[#1a1a1a] bg-white dark:bg-[#121212] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800">
                    <Th label="Student" field="name" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("name")} className="pl-6" />
                    <Th label="Course" field="course" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("course")} />
                    <Th label="Amount Paid" field="paid" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("paid")} className="text-right" />
                    <Th label="Balance" field="balance" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("balance")} className="text-right" />
                    <Th label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("status")} />
                    <Th label="Last Payment" field="date" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("date")} />
                    <th className="py-2.5 pr-5 text-right text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((swp) => (
                    <TableRow key={swp.student.id} data={swp} onRecordPayment={() => { setSelectedStudent(swp); setPaymentAmount(""); setPaymentMethod("transfer"); setPaymentRef(""); setPaymentNotes(""); setShowPaymentModal(true); }} onViewHistory={() => { setHistoryStudent(swp); setShowHistoryModal(true); }} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {sortedStudents.map((swp) => {
              const status = swp.profile?.payment_status || "pending";
              const cfg = statusConfig[status] || statusConfig.pending;
              return (
                <div key={swp.student.id} className="rounded-[14px] border border-[#e2e8f0] dark:border-[#1a1a1a] bg-white dark:bg-[#121212] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-400 dark:from-neutral-500 dark:to-neutral-300 flex items-center justify-center text-xs font-semibold text-white shrink-0">{getInitials(swp.student.full_name)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-neutral-900 dark:text-white truncate">{swp.student.full_name}</p>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">{swp.student.course_applying_for}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-[8px] ${cfg.bg} ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" onClick={() => { setShowPaymentModal(false); setSelectedStudent(null); }} />
      )}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#121212] rounded-[20px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-[#e5e5ea]/60 dark:border-[#38383a]/60 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h3 className="text-[17px] font-semibold text-neutral-900 dark:text-white tracking-[-0.01em]">Record Payment</h3>
              <button onClick={() => { setShowPaymentModal(false); setSelectedStudent(null); }} className="w-8 h-8 rounded-full bg-[#f2f2f7] dark:bg-[#181818] flex items-center justify-center text-neutral-400 hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 pb-6 space-y-4">
              {!selectedStudent ? (
                <select onChange={(e) => { const found = students.find((s) => s.student.id === e.target.value); setSelectedStudent(found || null); }} className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#181818] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white">
                  <option value="">Select a student...</option>
                  {students.map((s) => <option key={s.student.id} value={s.student.id}>{s.student.full_name} — {s.student.course_applying_for}</option>)}
                </select>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[#f2f2f7] dark:bg-[#181818]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-400 dark:from-neutral-500 dark:to-neutral-300 flex items-center justify-center text-sm font-semibold text-white shrink-0">{getInitials(selectedStudent.student.full_name)}</div>
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">{selectedStudent.student.full_name}</p>
                      <p className="text-[11px] text-neutral-500">Balance: {formatCurrency(selectedStudent.profile?.balance || selectedStudent.profile?.total_fee || DEFAULT_TOTAL_FEE)}</p>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="ml-auto text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">Change</button>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">Amount (₦)</label>
                    <input type="number" placeholder="0" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#181818] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">Payment Method</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#181818] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white">
                      <option value="transfer">Bank Transfer</option><option value="cash">Cash</option><option value="card">Card</option><option value="pos">POS</option><option value="ussd">USSD</option><option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">Reference (optional)</label>
                    <input type="text" placeholder="e.g. PAY-001" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#181818] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">Notes (optional)</label>
                    <input type="text" placeholder="e.g. First installment" value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#181818] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15" />
                  </div>
                  <div className="flex items-center gap-2.5 pt-2">
                    <button onClick={() => { setShowPaymentModal(false); setSelectedStudent(null); }} className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium text-neutral-500 bg-[#f2f2f7] dark:bg-[#181818] hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer">Cancel</button>
                    <button onClick={handleRecordPayment} disabled={submitting || !selectedStudent || !paymentAmount} className="flex-1 inline-flex items-center justify-center gap-2 h-[44px] rounded-[10px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all disabled:opacity-50 cursor-pointer">
                      {submitting ? <> <Loader2 className="w-4 h-4 animate-spin" /> Saving... </> : "Record Payment"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && historyStudent && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" onClick={() => { setShowHistoryModal(false); setHistoryStudent(null); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white dark:bg-[#121212] rounded-[18px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-7">
                <h2 className="text-[20px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em] leading-tight">Payment History — {historyStudent.student.full_name}</h2>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="p-3 rounded-[10px] bg-[#f2f2f7] dark:bg-[#181818] text-center">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Fee</p>
                    <p className="text-[14px] font-semibold text-neutral-900 dark:text-white mt-1">{formatCurrency(historyStudent.profile?.total_fee || DEFAULT_TOTAL_FEE)}</p>
                  </div>
                  <div className="p-3 rounded-[10px] bg-emerald-500/10 text-center">
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Paid</p>
                    <p className="text-[14px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(historyStudent.profile?.amount_paid || 0)}</p>
                  </div>
                  <div className="p-3 rounded-[10px] bg-amber-500/10 text-center">
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wider">Balance</p>
                    <p className="text-[14px] font-semibold text-amber-600 dark:text-amber-400 mt-1">{formatCurrency(historyStudent.profile?.balance || DEFAULT_TOTAL_FEE)}</p>
                  </div>
                </div>
                {historyStudent.payments.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Receipt className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
                    <p className="text-[13px] text-neutral-400">No payments recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto mt-4">
                    {historyStudent.payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-[10px] bg-[#f2f2f7] dark:bg-[#181818]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-sm">{methodIcons[p.payment_method] || "💳"}</div>
                          <div>
                            <p className="text-[13px] font-medium text-neutral-900 dark:text-white">{formatCurrency(p.amount)}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">{p.reference} · {p.payment_method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-neutral-500">{formatDate(p.created_at || new Date().toISOString())}</p>
                          {p.notes && <p className="text-[10px] text-neutral-400 mt-0.5">{p.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getStatusConfig(status: string) {
  return statusConfig[status as PaymentStatus] || statusConfig.pending;
}

function KpiCard({ icon, label, value, trend, trendType }: { icon: React.ReactNode; label: string; value: string; trend: string; trendType: "positive" | "negative" | "neutral" }) {
  const trendColors = { positive: "text-emerald-600 dark:text-emerald-400", negative: "text-amber-600 dark:text-amber-400", neutral: "text-neutral-500 dark:text-neutral-400" };
  return (
    <div className="rounded-[12px] border border-[#e2e8f0] dark:border-[#1a1a1a] bg-white dark:bg-[#121212] p-4 hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.2)] transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500">{label}</span>
        <div className="w-7 h-7 rounded-[8px] border border-[#e2e8f0] dark:border-[#1a1a1a] bg-[#f1f5f9] dark:bg-[#181818] flex items-center justify-center text-neutral-500 dark:text-neutral-400">{icon}</div>
      </div>
      <p className="text-[20px] font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white mb-1">{value}</p>
      <p className={`text-[11px] font-medium ${trendColors[trendType]}`}>{trend}</p>
    </div>
  );
}

function Th({ label, field, sortField, sortDir, onSort, className = "" }: { label: string; field: string; sortField: string | null; sortDir: "asc" | "desc"; onSort: () => void; className?: string }) {
  const isActive = sortField === field;
  return (
    <th onClick={onSort} className={`py-2.5 px-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500 cursor-pointer select-none hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors group ${className}`}>
      <span className="inline-flex items-center gap-1.5">{label}{isActive && <span className="text-neutral-900 dark:text-white text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>}</span>
    </th>
  );
}

function TableRow({ data, onRecordPayment, onViewHistory }: { data: StudentWithProfile; onRecordPayment: () => void; onViewHistory: () => void }) {
  const { student, profile } = data;
  const status: PaymentStatus = (profile?.payment_status as PaymentStatus) || "pending";
  const totalFee = profile?.total_fee || DEFAULT_TOTAL_FEE;
  const amountPaid = profile?.amount_paid || 0;
  const balance = profile?.balance ?? totalFee - amountPaid;
  const lastPaymentDate = data.payments.length > 0 ? data.payments[0].created_at : null;
  const paidPercentage = totalFee > 0 ? Math.round((amountPaid / totalFee) * 100) : 0;

  return (
    <tr className="border-b border-neutral-50 dark:border-neutral-800/40 hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors group">
      <td className="py-2.5 pl-5 pr-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-400 dark:from-neutral-500 dark:to-neutral-300 flex items-center justify-center text-[10px] font-semibold text-white shrink-0">{getInitials(student.full_name)}</div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-neutral-900 dark:text-white truncate">{student.full_name}</p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-3 h-3 text-neutral-400 shrink-0" />
          <span className="text-[11px] text-neutral-700 dark:text-neutral-300 truncate">{student.course_applying_for}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-right">
        <p className="text-[12px] font-semibold text-neutral-900 dark:text-white">{formatCurrency(amountPaid)}</p>
        {profile && <div className="flex items-center justify-end gap-2 mt-0.5"><div className="w-14 h-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${paidPercentage >= 100 ? "bg-emerald-500" : paidPercentage > 0 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${paidPercentage}%` }} /></div><span className="text-[10px] text-neutral-400 font-mono">{paidPercentage}%</span></div>}
      </td>
      <td className="py-2.5 px-3 text-right">
        <p className="text-[12px] font-semibold text-neutral-900 dark:text-white">{formatCurrency(balance)}</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">of {formatCurrency(totalFee)}</p>
      </td>
      <td className="py-2.5 px-3">
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-[6px] ${getStatusConfig(status).bg} ${getStatusConfig(status).text}`}>
          <span className={`w-1 h-1 rounded-full ${getStatusConfig(status).dot}`} />{getStatusConfig(status).label}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3 h-3 text-neutral-400" />
          <span className="text-[11px] text-neutral-600 dark:text-neutral-400">{lastPaymentDate ? formatDate(lastPaymentDate) : "—"}</span>
        </div>
      </td>
      <td className="py-2.5 pr-5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button onClick={onRecordPayment} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer" title="Add Payment"><Plus className="w-3.5 h-3.5" /></button>
          {data.payments.length > 0 && (
            <button onClick={onViewHistory} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer" title="View History"><Receipt className="w-3.5 h-3.5" /></button>
          )}
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-[#e2e8f0] dark:border-[#1a1a1a] bg-white dark:bg-[#121212]">
      <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4"><Wallet className="w-8 h-8 text-neutral-400" /></div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No students found</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">{hasSearch ? "Try a different search term." : "Add students to get started tracking payments."}</p>
    </div>
  );
}