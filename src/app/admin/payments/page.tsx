"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
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
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  User,
  GraduationCap,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";
import { apple } from "@/lib/admin-design-system";

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
type PaymentStatus = "paid" | "pending" | "installment";

type Student = {
  id: string;
  full_name: string;
  email: string;
  phone_whatsapp: string;
  course_applying_for: string;
};

type PaymentProfile = {
  id: string;
  student_id: string;
  total_fee: number;
  amount_paid: number;
  balance: number;
  payment_status: PaymentStatus;
  updated_at: string;
};

type Payment = {
  id: string;
  student_id: string;
  amount: number;
  payment_method: string;
  reference: string;
  notes: string;
  created_at: string;
};

type StudentWithProfile = {
  student: Student;
  profile: PaymentProfile | null;
  payments: Payment[];
};

type DateFilter = "all" | "today" | "week" | "month";

/* ═══════════════════════════════════════
   Helpers
   ═══════════════════════════════════════ */
const statusConfig: Record<PaymentStatus, {
  label: string;
  bg: string;
  text: string;
  dot: string;
}> = {
  paid: {
    label: "Paid",
    bg: "bg-emerald-500/8 dark:bg-emerald-500/12",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-500/8 dark:bg-amber-500/12",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  installment: {
    label: "Installment",
    bg: "bg-blue-500/8 dark:bg-blue-500/12",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
};

const methodIcons: Record<string, string> = {
  cash: "💵",
  transfer: "🏦",
  card: "💳",
  pos: "🖥️",
  ussd: "📱",
  other: "📋",
};

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */
export default function PaymentsPage() {
  const supabase = createSupabaseBrowserClient();

  // Data
  const [students, setStudents] = useState<StudentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithProfile | null>(null);
  const [historyStudent, setHistoryStudent] = useState<StudentWithProfile | null>(null);

  // Form state
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Column sorting
  const [sortField, setSortField] = useState<"name" | "course" | "paid" | "balance" | "status" | "date" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  /* ═══════════════════════════════════════
     Data Loading
     ═══════════════════════════════════════ */
  const loadData = useCallback(async () => {
    setLoading(true);

    const { data: studentsData } = await supabase
      .from("student_registrations")
      .select("id, full_name, email, phone_whatsapp, course_applying_for")
      .order("created_at", { ascending: false });

    const { data: profilesData } = await supabase
      .from("student_payment_profiles")
      .select("*");

    const { data: paymentsData } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!studentsData) {
      setLoading(false);
      return;
    }

    const profilesMap = new Map(
      (profilesData || []).map((p: PaymentProfile) => [p.student_id, p])
    );

    const paymentsMap = new Map<string, Payment[]>();
    (paymentsData || []).forEach((p: Payment) => {
      const existing = paymentsMap.get(p.student_id) || [];
      existing.push(p);
      paymentsMap.set(p.student_id, existing);
    });

    const combined: StudentWithProfile[] = studentsData.map((s: Student) => ({
      student: s,
      profile: profilesMap.get(s.id) || null,
      payments: paymentsMap.get(s.id) || [],
    }));

    setStudents(combined);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ═══════════════════════════════════════
     Computed Metrics
     ═══════════════════════════════════════ */
  const totalCollected = students.reduce(
    (sum, s) => sum + (s.profile?.amount_paid || 0),
    0
  );

  const fullyPaid = students.filter(
    (s) => s.profile?.payment_status === "paid"
  ).length;

  const pendingPayments = students.filter(
    (s) => !s.profile || s.profile.payment_status === "pending"
  ).length;

  const installmentPlans = students.filter(
    (s) => s.profile?.payment_status === "installment"
  ).length;

  const totalExpected = students.reduce(
    (sum, s) => sum + (s.profile?.total_fee || 150000),
    0
  );

  const collectionRate = totalExpected > 0
    ? Math.round((totalCollected / totalExpected) * 100)
    : 0;

  /* ═══════════════════════════════════════
     Filtering & Sorting
     ═══════════════════════════════════════ */
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.student.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student.email.toLowerCase().includes(search.toLowerCase()) ||
      s.student.phone_whatsapp.includes(search) ||
      s.student.course_applying_for.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (s.profile?.payment_status || "pending") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort filtered list
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField) return 0;
    const dir = sortDir === "asc" ? 1 : -1;

    switch (sortField) {
      case "name":
        return a.student.full_name.localeCompare(b.student.full_name) * dir;
      case "course":
        return a.student.course_applying_for.localeCompare(b.student.course_applying_for) * dir;
      case "paid":
        return ((a.profile?.amount_paid || 0) - (b.profile?.amount_paid || 0)) * dir;
      case "balance":
        return (
          ((a.profile?.balance || a.profile?.total_fee || 150000) -
          (b.profile?.balance || b.profile?.total_fee || 150000)) * dir
        );
      case "status":
        return (a.profile?.payment_status || "pending").localeCompare(b.profile?.payment_status || "pending") * dir;
      case "date":
        const dateA = a.profile?.updated_at ? new Date(a.profile.updated_at).getTime() : 0;
        const dateB = b.profile?.updated_at ? new Date(b.profile.updated_at).getTime() : 0;
        return (dateA - dateB) * dir;
      default:
        return 0;
    }
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  /* ═══════════════════════════════════════
     Actions
     ═══════════════════════════════════════ */
  const handleRecordPayment = async () => {
    if (!selectedStudent || !paymentAmount) return;
    setSubmitting(true);

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setSubmitting(false);
      return;
    }

    await supabase.from("payments").insert({
      student_id: selectedStudent.student.id,
      amount,
      payment_method: paymentMethod,
      reference: paymentRef || `PAY-${Date.now().toString().slice(-6)}`,
      notes: paymentNotes,
    });

    const currentProfile = selectedStudent.profile;
    const totalFee = currentProfile?.total_fee || 150000;
    const currentPaid = currentProfile?.amount_paid || 0;
    const newAmountPaid = currentPaid + amount;
    const newStatus: PaymentStatus =
      newAmountPaid >= totalFee ? "paid" : "installment";

    if (currentProfile) {
      await supabase
        .from("student_payment_profiles")
        .update({
          amount_paid: newAmountPaid,
          payment_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("student_id", selectedStudent.student.id);
    } else {
      await supabase.from("student_payment_profiles").insert({
        student_id: selectedStudent.student.id,
        total_fee: totalFee,
        amount_paid: newAmountPaid,
        payment_status: newStatus,
      });
    }

    setPaymentAmount("");
    setPaymentMethod("transfer");
    setPaymentRef("");
    setPaymentNotes("");
    setShowPaymentModal(false);
    setSelectedStudent(null);
    setSubmitting(false);
    loadData();
  };

  const handleMarkAsPaid = async (student: StudentWithProfile) => {
    const totalFee = student.profile?.total_fee || 150000;
    const balance = student.profile?.balance || totalFee;
    if (balance <= 0) return;

    await supabase.from("payments").insert({
      student_id: student.student.id,
      amount: balance,
      payment_method: "transfer",
      reference: `PAY-${Date.now().toString().slice(-6)}`,
      notes: "Full payment (admin)",
    });

    if (student.profile) {
      await supabase
        .from("student_payment_profiles")
        .update({
          amount_paid: totalFee,
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("student_id", student.student.id);
    } else {
      await supabase.from("student_payment_profiles").insert({
        student_id: student.student.id,
        total_fee: totalFee,
        amount_paid: totalFee,
        payment_status: "paid",
      });
    }

    loadData();
  };

  /* ═══════════════════════════════════════
     Loading State
     ═══════════════════════════════════════ */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <p className="text-sm text-neutral-500">Loading payments...</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     Render
     ═══════════════════════════════════════ */
  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* ──────── PAGE HEADER ──────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
            Payments
          </h1>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            Track tuition payments and manage student balances.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setPaymentAmount("");
            setPaymentMethod("transfer");
            setPaymentRef("");
            setPaymentNotes("");
            setShowPaymentModal(true);
          }}
          className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[6px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-3 h-3" />
          Record Payment
        </button>
      </div>

      {/* ──────── KPI GRID ──────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={<Wallet className="w-5 h-5" />}
          label="Total Collected"
          value={formatCurrency(totalCollected)}
          trend={`${collectionRate}% of expected`}
          trendType="neutral"
        />
        <KpiCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Paid Students"
          value={String(fullyPaid)}
          trend={`${students.length > 0 ? Math.round((fullyPaid / students.length) * 100) : 0}% completion`}
          trendType="positive"
        />
        <KpiCard
          icon={<Clock className="w-5 h-5" />}
          label="Pending Payments"
          value={String(pendingPayments)}
          trend="Awaiting action"
          trendType="negative"
        />
        <KpiCard
          icon={<CreditCard className="w-5 h-5" />}
          label="Installments"
          value={String(installmentPlans)}
          trend="Active plans"
          trendType="neutral"
        />
      </div>

      {/* ──────── TOOLBAR ──────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search students, courses, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[30px] pl-8 pr-3 rounded-[6px] bg-white dark:bg-[#1c1c1e] border border-neutral-200/80 dark:border-neutral-800 text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 transition-all"
          />
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100/80 dark:bg-neutral-800/50 rounded-[8px] shrink-0">
          {(["all", "paid", "pending", "installment"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-[6px] text-[11px] font-medium transition-all cursor-pointer ${
                statusFilter === tab
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {tab === "all" ? "All" : statusConfig[tab].label + "s"}
            </button>
          ))}
        </div>

        {/* Record count */}
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0 ml-auto sm:ml-0">
          {sortedStudents.length} student{sortedStudents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ──────── DATA TABLE (desktop) ──────── */}
      {sortedStudents.length === 0 ? (
        <EmptyState hasSearch={!!search} />
      ) : (
        <>
        <div className="hidden md:block rounded-[16px] border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#1c1c1e] overflow-hidden">
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
                  <th className="py-2.5 pr-5 text-right text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((swp) => (
                  <TableRow
                    key={swp.student.id}
                    data={swp}
                    onRecordPayment={() => {
                      setSelectedStudent(swp);
                      setPaymentAmount("");
                      setPaymentMethod("transfer");
                      setPaymentRef("");
                      setPaymentNotes("");
                      setShowPaymentModal(true);
                    }}
                    onMarkPaid={() => handleMarkAsPaid(swp)}
                    onViewHistory={() => {
                      setHistoryStudent(swp);
                      setShowHistoryModal(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ──────── MOBILE CARDS (< md) ──────── */}
        <div className="md:hidden space-y-3">
          {sortedStudents.map((swp) => (
            <MobilePaymentCard
              key={swp.student.id}
              data={swp}
              onRecordPayment={() => {
                setSelectedStudent(swp);
                setPaymentAmount("");
                setPaymentMethod("transfer");
                setPaymentRef("");
                setPaymentNotes("");
                setShowPaymentModal(true);
              }}
              onMarkPaid={() => handleMarkAsPaid(swp)}
              onViewHistory={() => {
                setHistoryStudent(swp);
                setShowHistoryModal(true);
              }}
            />
          ))}
        </div>
        </>
      )}

      {/* ═══════════════════════════════════════
         MODALS
         ═══════════════════════════════════════ */}

      {/* ──────── Select Student + Record Payment Modal ──────── */}
      {showPaymentModal && (
        <Modal onClose={() => { setShowPaymentModal(false); setSelectedStudent(null); }} title="Record Payment">
          <div className="space-y-4">
            {/* Student selector */}
            {!selectedStudent ? (
              <div>
                <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                  Student
                </label>
                <select
                  value=""
                  onChange={(e) => {
                    const found = students.find(
                      (s) => s.student.id === e.target.value
                    );
                    setSelectedStudent(found || null);
                  }}
                  className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/15"
                >
                  <option value="">Select a student...</option>
                  {students.map((s) => (
                    <option key={s.student.id} value={s.student.id}>
                      {s.student.full_name} — {s.student.course_applying_for}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                {/* Selected student info */}
                <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-400 dark:from-neutral-500 dark:to-neutral-300 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                    {getInitials(selectedStudent.student.full_name)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                      {selectedStudent.student.full_name}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Balance: {formatCurrency(selectedStudent.profile?.balance || selectedStudent.profile?.total_fee || 150000)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="ml-auto text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/15"
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
                  <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                    Reference (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PAY-001"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                    Notes (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. First installment"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200/80 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    onClick={() => { setShowPaymentModal(false); setSelectedStudent(null); }}
                    className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium text-neutral-500 bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRecordPayment}
                    disabled={submitting || !selectedStudent || !paymentAmount}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-[44px] rounded-[10px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Record Payment"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* ──────── Payment History Modal ──────── */}
      {showHistoryModal && historyStudent && (
        <Modal onClose={() => { setShowHistoryModal(false); setHistoryStudent(null); }} title={`Payment History — ${historyStudent.student.full_name}`}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] text-center">
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Fee</p>
                <p className="text-[14px] font-semibold text-neutral-900 dark:text-white mt-1">
                  {formatCurrency(historyStudent.profile?.total_fee || 150000)}
                </p>
              </div>
              <div className="p-3 rounded-[10px] bg-emerald-500/10 text-center">
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Paid</p>
                <p className="text-[14px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCurrency(historyStudent.profile?.amount_paid || 0)}
                </p>
              </div>
              <div className="p-3 rounded-[10px] bg-amber-500/10 text-center">
                <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wider">Balance</p>
                <p className="text-[14px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
                  {formatCurrency(historyStudent.profile?.balance || historyStudent.profile?.total_fee || 150000)}
                </p>
              </div>
            </div>

            {historyStudent.payments.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Receipt className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
                <p className="text-[13px] text-neutral-400">No payments recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {historyStudent.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-sm">
                        {methodIcons[p.payment_method] || "💳"}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-neutral-900 dark:text-white">
                          {formatCurrency(p.amount)}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          {p.reference} · {p.payment_method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-neutral-500">
                        {formatDate(p.created_at)}
                      </p>
                      {p.notes && (
                        <p className="text-[10px] text-neutral-400 mt-0.5">{p.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════ */

function KpiCard({
  icon,
  label,
  value,
  trend,
  trendType,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendType: "positive" | "negative" | "neutral";
}) {
  const trendColors = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-amber-600 dark:text-amber-400",
    neutral: "text-neutral-500 dark:text-neutral-400",
  };

  return (
    <div className="rounded-[12px] border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#1c1c1e] p-4 transition-all duration-300 hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500">
          {label}
        </span>
        <div className="w-7 h-7 rounded-[8px] bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
          {icon}
        </div>
      </div>
      <p className="text-[20px] font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white mb-1">
        {value}
      </p>
      <p className={`text-[11px] font-medium ${trendColors[trendType]}`}>
        {trend}
      </p>
    </div>
  );
}

function Th({
  label,
  field,
  sortField,
  sortDir,
  onSort,
  className = "",
}: {
  label: string;
  field: string;
  sortField: string | null;
  sortDir: "asc" | "desc";
  onSort: () => void;
  className?: string;
}) {
  const isActive = sortField === field;
  return (
    <th
      onClick={onSort}
      className={`py-2.5 px-3 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500 cursor-pointer select-none hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors group ${className}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        {isActive && (
          <span className="text-neutral-900 dark:text-white text-[10px]">
            {sortDir === "asc" ? "↑" : "↓"}
          </span>
        )}
      </span>
    </th>
  );
}

function TableRow({
  data,
  onRecordPayment,
  onMarkPaid,
  onViewHistory,
}: {
  data: StudentWithProfile;
  onRecordPayment: () => void;
  onMarkPaid: () => void;
  onViewHistory: () => void;
}) {
  const { student, profile, payments } = data;
  const status: PaymentStatus = profile?.payment_status || "pending";
  const totalFee = profile?.total_fee || 150000;
  const amountPaid = profile?.amount_paid || 0;
  const balance = profile?.balance ?? totalFee - amountPaid;
  const lastPaymentDate = payments.length > 0 ? payments[0].created_at : null;
  const paidPercentage = totalFee > 0 ? Math.round((amountPaid / totalFee) * 100) : 0;
  const config = statusConfig[status];

  return (
    <tr className="border-b border-neutral-50 dark:border-neutral-800/40 hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors group">
      <td className="py-2.5 pl-5 pr-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-400 dark:from-neutral-500 dark:to-neutral-300 flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
            {getInitials(student.full_name)}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-neutral-900 dark:text-white truncate">
              {student.full_name}
            </p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
              {student.email}
            </p>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-3 h-3 text-neutral-400 shrink-0" />
          <span className="text-[11px] text-neutral-700 dark:text-neutral-300 truncate">
            {student.course_applying_for}
          </span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-right">
        <div>
          <p className="text-[12px] font-semibold text-neutral-900 dark:text-white">
            {formatCurrency(amountPaid)}
          </p>
          {/* Mini progress bar */}
          {profile && (
            <div className="flex items-center justify-end gap-2 mt-0.5">
              <div className="w-14 h-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    paidPercentage >= 100
                      ? "bg-emerald-500"
                      : paidPercentage > 0
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${paidPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">{paidPercentage}%</span>
            </div>
          )}
        </div>
      </td>
      <td className="py-2.5 px-3 text-right">
        <p className="text-[12px] font-semibold text-neutral-900 dark:text-white">
          {formatCurrency(balance)}
        </p>
        <p className="text-[10px] text-neutral-400 mt-0.5">
          of {formatCurrency(totalFee)}
        </p>
      </td>
      <td className="py-2.5 px-3">
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-[6px] ${config.bg} ${config.text}`}>
          <span className={`w-1 h-1 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3 h-3 text-neutral-400" />
          <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
            {lastPaymentDate ? formatDate(lastPaymentDate) : "—"}
          </span>
        </div>
      </td>
      <td className="py-2.5 pr-5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onRecordPayment}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Add Payment"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          {balance > 0 && (
            <button
              onClick={onMarkPaid}
              className="w-7 h-7 rounded-[6px] flex items-center justify-center text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              title="Mark Fully Paid"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {payments.length > 0 && (
            <button
              onClick={onViewHistory}
              className="w-7 h-7 rounded-[6px] flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="View History"
            >
              <Receipt className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function MobilePaymentCard({
  data,
  onRecordPayment,
  onMarkPaid,
  onViewHistory,
}: {
  data: StudentWithProfile;
  onRecordPayment: () => void;
  onMarkPaid: () => void;
  onViewHistory: () => void;
}) {
  const { student, profile } = data;
  const status: PaymentStatus = profile?.payment_status || "pending";
  const totalFee = profile?.total_fee || 150000;
  const amountPaid = profile?.amount_paid || 0;
  const balance = profile?.balance ?? totalFee - amountPaid;
  const paidPercentage = totalFee > 0 ? Math.round((amountPaid / totalFee) * 100) : 0;
  const config = statusConfig[status];

  return (
    <div className="rounded-[14px] border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#1c1c1e] p-4 space-y-3">
      {/* Top: avatar + name + status */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-400 dark:from-neutral-500 dark:to-neutral-300 flex items-center justify-center text-xs font-semibold text-white shrink-0">
          {getInitials(student.full_name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-neutral-900 dark:text-white truncate">
            {student.full_name}
          </p>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
            {student.course_applying_for}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-[8px] ${config.bg} ${config.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>

      {/* Progress bar */}
      {profile && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                paidPercentage >= 100
                  ? "bg-emerald-500"
                  : paidPercentage > 0
                  ? "bg-blue-500"
                  : "bg-amber-500"
              }`}
              style={{ width: `${paidPercentage}%` }}
            />
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">{paidPercentage}%</span>
        </div>
      )}

      {/* Amounts row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-2.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Paid</p>
          <p className="text-[14px] font-semibold text-neutral-900 dark:text-white mt-0.5">
            {formatCurrency(amountPaid)}
          </p>
        </div>
        <div className="p-2.5 rounded-[10px] bg-amber-500/5 dark:bg-amber-500/10">
          <p className="text-[10px] text-amber-500 uppercase tracking-wider">Balance</p>
          <p className="text-[14px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1.5 border-t border-neutral-100 dark:border-neutral-800/40">
        <button
          onClick={onRecordPayment}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-[36px] rounded-[8px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Payment
        </button>
        {balance > 0 && (
          <button
            onClick={onMarkPaid}
            className="inline-flex items-center justify-center gap-1.5 h-[36px] px-3 rounded-[8px] border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-medium hover:bg-emerald-500/5 transition-all active:scale-[0.98] cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Mark Paid
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e]">
      <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
        <Wallet className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
        No students found
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
        {hasSearch
          ? "Try a different search term."
          : "Add students to get started tracking payments."}
      </p>
    </div>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-[20px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h3 className="text-[17px] font-semibold text-neutral-900 dark:text-white tracking-[-0.01em]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center text-neutral-400 hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </>
  );
}