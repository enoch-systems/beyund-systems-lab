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
  paid: { label: "Paid", bg: "rgba(16, 185, 129, 0.1)", text: "#10b981", dot: "#10b981" },
  pending: { label: "Pending", bg: "rgba(245, 158, 11, 0.1)", text: "#f59e0b", dot: "#f59e0b" },
  installment: { label: "Installment", bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6", dot: "#3b82f6" },
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
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Loading payments...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            Payments
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            Track tuition payments and manage student balances.
          </p>
        </div>
        <button 
          onClick={() => { setSelectedStudent(null); setPaymentAmount(""); setPaymentMethod("transfer"); setPaymentRef(""); setPaymentNotes(""); setShowPaymentModal(true); }} 
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
          <Plus className="w-3.5 h-3.5" /> Record Payment
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--color-text-tertiary)" }} />
          <input 
            type="text" 
            placeholder="Search students, courses, or email..." 
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
        <div className="flex items-center gap-1 p-1 rounded-lg shrink-0" style={{ background: "var(--color-bg-secondary)" }}>
          {(["all", "paid", "pending", "installment"] as const).map((tab) => {
            const cfg = tab === "all" ? { label: "All", bg: "", text: "" } : statusConfig[tab as PaymentStatus];
            return (
            <button 
              key={tab} 
              onClick={() => setStatusFilter(tab)} 
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer"
              style={
                statusFilter === tab
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
              {tab === "all" ? "All" : cfg.label + "s"}
            </button>
          );
          })}
        </div>
        <p className="text-xs font-medium shrink-0 ml-auto sm:ml-0" style={{ color: "var(--color-text-tertiary)" }}>{sortedStudents.length} student{sortedStudents.length !== 1 ? "s" : ""}</p>
      </div>

      {sortedStudents.length === 0 ? <EmptyState hasSearch={!!search} /> : (
        <>
          <div className="hidden md:block rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border-default)" }}>
                    <Th label="Student" field="name" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("name")} className="pl-5" />
                    <Th label="Course" field="course" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("course")} />
                    <Th label="Amount Paid" field="paid" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("paid")} className="text-right" />
                    <Th label="Balance" field="balance" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("balance")} className="text-right" />
                    <Th label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("status")} />
                    <Th label="Last Payment" field="date" sortField={sortField} sortDir={sortDir} onSort={() => handleSort("date")} />
                    <th className="py-3 pr-5 text-right text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ "--tw-divide-opacity": "1", divideColor: "var(--color-border-subtle)" } as any}>
                  {sortedStudents.map((swp) => (
                    <TableRow 
                      key={swp.student.id} 
                      data={swp} 
                      onRecordPayment={() => { setSelectedStudent(swp); setPaymentAmount(""); setPaymentMethod("transfer"); setPaymentRef(""); setPaymentNotes(""); setShowPaymentModal(true); }} 
                      onViewHistory={() => { setHistoryStudent(swp); setShowHistoryModal(true); }} 
                    />
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
                <div key={swp.student.id} className="rounded-2xl border p-4 space-y-3" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>{getInitials(swp.student.full_name)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{swp.student.full_name}</p>
                      <p className="text-xs truncate" style={{ color: "var(--color-text-tertiary)" }}>{swp.student.course_applying_for}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md" style={{ background: cfg.bg, color: cfg.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />{cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => { setShowPaymentModal(false); setSelectedStudent(null); }} />
      )}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-md rounded-2xl border overflow-hidden"
            style={{ 
              background: "var(--color-bg-elevated)", 
              borderColor: "var(--color-border-default)",
              boxShadow: "var(--shadow-xl)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h3 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>Record Payment</h3>
              <button 
                onClick={() => { setShowPaymentModal(false); setSelectedStudent(null); }} 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-tertiary)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-bg-tertiary)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-bg-secondary)"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 pb-6 space-y-4">
              {!selectedStudent ? (
                <select 
                  onChange={(e) => { const found = students.find((s) => s.student.id === e.target.value); setSelectedStudent(found || null); }} 
                  className="w-full h-11 px-3.5 rounded-xl text-sm"
                  style={{
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border-default)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <option value="">Select a student...</option>
                  {students.map((s) => <option key={s.student.id} value={s.student.id}>{s.student.full_name} — {s.student.course_applying_for}</option>)}
                </select>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-default)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>{getInitials(selectedStudent.student.full_name)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{selectedStudent.student.full_name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>Balance: {formatCurrency(selectedStudent.profile?.balance || selectedStudent.profile?.total_fee || DEFAULT_TOTAL_FEE)}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedStudent(null)} 
                      className="text-xs transition-colors"
                      style={{ color: "var(--color-text-tertiary)" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-primary)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-tertiary)"}
                    >
                      Change
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Amount (₦)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={paymentAmount} 
                      onChange={(e) => setPaymentAmount(e.target.value)} 
                      className="w-full h-11 px-3.5 rounded-xl text-sm transition-all"
                      style={{
                        background: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border-default)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Payment Method</label>
                    <select 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="w-full h-11 px-3.5 rounded-xl text-sm"
                      style={{
                        background: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border-default)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      <option value="transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="pos">POS</option>
                      <option value="ussd">USSD</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Reference (optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. PAY-001" 
                      value={paymentRef} 
                      onChange={(e) => setPaymentRef(e.target.value)} 
                      className="w-full h-11 px-3.5 rounded-xl text-sm transition-all"
                      style={{
                        background: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border-default)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Notes (optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. First installment" 
                      value={paymentNotes} 
                      onChange={(e) => setPaymentNotes(e.target.value)} 
                      className="w-full h-11 px-3.5 rounded-xl text-sm transition-all"
                      style={{
                        background: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border-default)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2.5 pt-2">
                    <button 
                      onClick={() => { setShowPaymentModal(false); setSelectedStudent(null); }} 
                      className="flex-1 h-11 rounded-xl text-sm font-medium transition-colors"
                      style={{
                        background: "var(--color-bg-secondary)",
                        color: "var(--color-text-secondary)",
                        border: "1px solid var(--color-border-default)",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-bg-tertiary)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-bg-secondary)"}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleRecordPayment} 
                      disabled={submitting || !selectedStudent || !paymentAmount} 
                      className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
                      style={{
                        background: "var(--color-accent-teal)",
                        color: "#ffffff",
                      }}
                    >
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
          <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => { setShowHistoryModal(false); setHistoryStudent(null); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="w-full max-w-sm rounded-2xl border overflow-hidden"
              style={{ 
                background: "var(--color-bg-elevated)", 
                borderColor: "var(--color-border-default)",
                boxShadow: "var(--shadow-xl)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Payment History — {historyStudent.student.full_name}</h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl text-center" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-default)" }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>Fee</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(historyStudent.profile?.total_fee || DEFAULT_TOTAL_FEE)}</p>
                  </div>
                  <div className="p-3 rounded-xl text-center" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "#10b981" }}>Paid</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: "#10b981" }}>{formatCurrency(historyStudent.profile?.amount_paid || 0)}</p>
                  </div>
                  <div className="p-3 rounded-xl text-center" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "#f59e0b" }}>Balance</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: "#f59e0b" }}>{formatCurrency(historyStudent.profile?.balance || DEFAULT_TOTAL_FEE)}</p>
                  </div>
                </div>
                {historyStudent.payments.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Receipt className="w-8 h-8 mb-2" style={{ color: "var(--color-text-tertiary)" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>No payments recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto mt-4">
                    {historyStudent.payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border-default)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "var(--color-bg-elevated)" }}>{methodIcons[p.payment_method] || "💳"}</div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(p.amount)}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{p.reference} · {p.payment_method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{formatDate(p.created_at || new Date().toISOString())}</p>
                          {p.notes && <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>{p.notes}</p>}
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
  const trendColors = { positive: "#10b981", negative: "#f59e0b", neutral: "var(--color-text-tertiary)" };
  return (
    <div 
      className="rounded-xl border p-4 transition-all duration-300"
      style={{ 
        borderColor: "var(--color-border-default)", 
        background: "var(--color-bg-elevated)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>{label}</span>
        <div className="w-7 h-7 rounded-lg border flex items-center justify-center" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-secondary)", color: "var(--color-text-tertiary)" }}>
          {icon}
        </div>
      </div>
      <p className="text-lg font-semibold tracking-tight mb-1" style={{ color: "var(--color-text-primary)" }}>{value}</p>
      <p className="text-xs font-medium" style={{ color: trendColors[trendType] }}>{trend}</p>
    </div>
  );
}

function Th({ label, field, sortField, sortDir, onSort, className = "" }: { label: string; field: string; sortField: string | null; sortDir: "asc" | "desc"; onSort: () => void; className?: string }) {
  const isActive = sortField === field;
  return (
    <th 
      onClick={onSort} 
      className={`py-3 px-3 text-left text-[10px] font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${className}`}
      style={{ color: "var(--color-text-tertiary)" }}
    >
      <span className="inline-flex items-center gap-1.5">{label}{isActive && <span className="text-xs" style={{ color: "var(--color-text-primary)" }}>{sortDir === "asc" ? "↑" : "↓"}</span>}</span>
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
    <tr className="transition-colors" style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
      <td className="py-3 pl-5 pr-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" }}>{getInitials(student.full_name)}</div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{student.full_name}</p>
            <p className="text-[11px] truncate" style={{ color: "var(--color-text-tertiary)" }}>{student.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-3 h-3 shrink-0" style={{ color: "var(--color-text-tertiary)" }} />
          <span className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>{student.course_applying_for}</span>
        </div>
      </td>
      <td className="py-3 px-3 text-right">
        <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(amountPaid)}</p>
        {profile && <div className="flex items-center justify-end gap-2 mt-1"><div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: "var(--color-bg-secondary)" }}><div className="h-full rounded-full transition-all duration-500" style={{ width: `${paidPercentage}%`, background: paidPercentage >= 100 ? "#10b981" : paidPercentage > 0 ? "#3b82f6" : "#f59e0b" }} /></div><span className="text-[10px]" style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{paidPercentage}%</span></div>}
      </td>
      <td className="py-3 px-3 text-right">
        <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>{formatCurrency(balance)}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>of {formatCurrency(totalFee)}</p>
      </td>
      <td className="py-3 px-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: getStatusConfig(status).bg, color: getStatusConfig(status).text }}>
          <span className="w-1 h-1 rounded-full" style={{ background: getStatusConfig(status).dot }} />{getStatusConfig(status).label}
        </span>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3 h-3" style={{ color: "var(--color-text-tertiary)" }} />
          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{lastPaymentDate ? formatDate(lastPaymentDate) : "—"}</span>
        </div>
      </td>
      <td className="py-3 pr-5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={onRecordPayment} 
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
            title="Add Payment"
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-tertiary)"; }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          {data.payments.length > 0 && (
            <button 
              onClick={onViewHistory} 
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "var(--color-text-tertiary)" }}
              title="View History"
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-bg-secondary)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-tertiary)"; }}
            >
              <Receipt className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-bg-secondary)" }}>
        <Wallet className="w-8 h-8" style={{ color: "var(--color-text-tertiary)" }} />
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>No students found</h3>
      <p className="text-sm max-w-sm" style={{ color: "var(--color-text-tertiary)" }}>{hasSearch ? "Try a different search term." : "Add students to get started tracking payments."}</p>
    </div>
  );
}