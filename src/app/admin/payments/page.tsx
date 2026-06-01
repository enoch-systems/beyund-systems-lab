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
  ChevronDown,
  Receipt,
  Phone,
  BookOpen,
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
const statusStyles: Record<PaymentStatus, string> = {
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  installment: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
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

function getDateRange(filter: DateFilter): { start: Date; end: Date } | null {
  const now = new Date();
  const start = new Date(now);

  switch (filter) {
    case "today":
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    case "week": {
      const dayOfWeek = now.getDay();
      start.setDate(now.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    }
    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    default:
      return null;
  }
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
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithProfile | null>(null);
  const [historyStudent, setHistoryStudent] = useState<StudentWithProfile | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // Form state
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ═══════════════════════════════════════
     Data Loading
     ═══════════════════════════════════════ */
  const loadData = useCallback(async () => {
    setLoading(true);

    // Load all registered students
    const { data: studentsData } = await supabase
      .from("student_registrations")
      .select("id, full_name, email, phone_whatsapp, course_applying_for")
      .order("created_at", { ascending: false });

    // Load payment profiles
    const { data: profilesData } = await supabase
      .from("student_payment_profiles")
      .select("*");

    // Load all payments
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

  /* ═══════════════════════════════════════
     Filtering
     ═══════════════════════════════════════ */
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.student.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student.email.toLowerCase().includes(search.toLowerCase()) ||
      s.student.phone_whatsapp.includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (s.profile?.payment_status || "pending") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* ═══════════════════════════════════════
     Actions
     ═══════════════════════════════════════ */
  const handleInitializeProfile = async (student: Student) => {
    // Get the course fee
    const { data: tuition } = await supabase
      .from("course_tuition")
      .select("fee")
      .eq("course_name", student.course_applying_for)
      .single();

    const fee = tuition?.fee || 150000;

    await supabase.from("student_payment_profiles").insert({
      student_id: student.id,
      total_fee: fee,
      amount_paid: 0,
      payment_status: "pending",
    });

    loadData();
  };

  const handleRecordPayment = async () => {
    if (!selectedStudent || !paymentAmount) return;
    setSubmitting(true);

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setSubmitting(false);
      return;
    }

    // Insert payment record
    await supabase.from("payments").insert({
      student_id: selectedStudent.student.id,
      amount,
      payment_method: paymentMethod,
      reference: paymentRef || `PAY-${Date.now().toString().slice(-6)}`,
      notes: paymentNotes,
    });

    // Update profile
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

    // Reset form
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
    <div className="max-w-[1200px] space-y-6 sm:space-y-8">
      {/* ──────── HEADER ──────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
            Payments
          </h1>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mt-1">
            Track tuition payments and manage student balances.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 h-[40px] px-5 rounded-[10px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      {/* ──────── KPI GRID ──────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={<Wallet className="w-4 h-4" />}
          label="Total Collected"
          value={formatCurrency(totalCollected)}
          color="text-neutral-900 dark:text-white"
        />
        <KpiCard
          icon={<CheckCircle className="w-4 h-4" />}
          label="Fully Paid"
          value={String(fullyPaid)}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <KpiCard
          icon={<Clock className="w-4 h-4" />}
          label="Pending Payments"
          value={String(pendingPayments)}
          color="text-amber-600 dark:text-amber-400"
        />
        <KpiCard
          icon={<CreditCard className="w-4 h-4" />}
          label="Installment Plans"
          value={String(installmentPlans)}
          color="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* ──────── FILTERS ──────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[42px] pl-10 pr-4 rounded-[10px] bg-white dark:bg-[#1c1c1e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/50 rounded-[10px]">
          {(["all", "paid", "pending", "installment"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer ${
                statusFilter === tab
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ──────── STUDENT LIST ──────── */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e]">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            No students found
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
            {search
              ? "Try a different search term."
              : "Add students to get started tracking payments."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((swp) => (
            <StudentPaymentCard
              key={swp.student.id}
              data={swp}
              expanded={expandedStudent === swp.student.id}
              onToggle={() =>
                setExpandedStudent(
                  expandedStudent === swp.student.id ? null : swp.student.id
                )
              }
              onRecordPayment={() => {
                setSelectedStudent(swp);
                setShowPaymentModal(true);
              }}
              onMarkPaid={() => handleMarkAsPaid(swp)}
              onViewHistory={() => {
                setHistoryStudent(swp);
                setShowHistoryModal(true);
              }}
              onInitProfile={() => handleInitializeProfile(swp.student)}
            />
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════
         MODALS
         ═══════════════════════════════════════ */}

      {/* ──────── Add Student Profile Modal ──────── */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Record Payment">
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                Student
              </label>
              <select
                value={selectedStudent?.student.id || ""}
                onChange={(e) => {
                  const found = students.find(
                    (s) => s.student.id === e.target.value
                  );
                  setSelectedStudent(found || null);
                }}
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
              >
                <option value="">Select a student...</option>
                {students.map((s) => (
                  <option key={s.student.id} value={s.student.id}>
                    {s.student.full_name} — {s.student.course_applying_for}
                  </option>
                ))}
              </select>
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
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
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
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
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
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-[40px] rounded-[10px] text-[13px] font-medium text-neutral-500 bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={submitting || !selectedStudent || !paymentAmount}
                className="flex-1 inline-flex items-center justify-center gap-2 h-[40px] rounded-[10px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all disabled:opacity-50 cursor-pointer"
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
          </div>
        </Modal>
      )}

      {/* ──────── Quick Payment Modal ──────── */}
      {showPaymentModal && selectedStudent && (
        <Modal onClose={() => { setShowPaymentModal(false); setSelectedStudent(null); }} title={`Payment — ${selectedStudent.student.full_name}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
              <div>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider">Balance</p>
                <p className="text-[17px] font-semibold text-neutral-900 dark:text-white mt-0.5">
                  {formatCurrency(selectedStudent.profile?.balance || selectedStudent.profile?.total_fee || 150000)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider">Total Fee</p>
                <p className="text-[14px] font-medium text-neutral-900 dark:text-white mt-0.5">
                  {formatCurrency(selectedStudent.profile?.total_fee || 150000)}
                </p>
              </div>
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
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
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
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-900 dark:text-white mb-1.5">
                Notes (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Second installment"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-neutral-200 dark:border-neutral-800 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => { setShowPaymentModal(false); setSelectedStudent(null); }}
                className="flex-1 h-[40px] rounded-[10px] text-[13px] font-medium text-neutral-500 bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={submitting || !paymentAmount}
                className="flex-1 inline-flex items-center justify-center gap-2 h-[40px] rounded-[10px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all disabled:opacity-50 cursor-pointer"
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
          </div>
        </Modal>
      )}

      {/* ──────── Payment History Modal ──────── */}
      {showHistoryModal && historyStudent && (
        <Modal onClose={() => { setShowHistoryModal(false); setHistoryStudent(null); }} title={`Payment History — ${historyStudent.student.full_name}`}>
          <div className="space-y-4">
            {/* Summary */}
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

            {/* Transaction list */}
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
                        {new Date(p.created_at).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
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
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] p-4 sm:p-5 transition-all hover:shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400 dark:text-neutral-500">
          {label}
        </span>
        <div className="w-8 h-8 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center text-neutral-500">
          {icon}
        </div>
      </div>
      <p className={`text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] ${color}`}>
        {value}
      </p>
    </div>
  );
}

function StudentPaymentCard({
  data,
  expanded,
  onToggle,
  onRecordPayment,
  onMarkPaid,
  onViewHistory,
  onInitProfile,
}: {
  data: StudentWithProfile;
  expanded: boolean;
  onToggle: () => void;
  onRecordPayment: () => void;
  onMarkPaid: () => void;
  onViewHistory: () => void;
  onInitProfile: () => void;
}) {
  const { student, profile, payments } = data;
  const status = profile?.payment_status || "pending";
  const totalFee = profile?.total_fee || 150000;
  const amountPaid = profile?.amount_paid || 0;
  const balance = profile?.balance || totalFee;
  const paidPercentage = totalFee > 0 ? Math.round((amountPaid / totalFee) * 100) : 0;

  return (
    <div className="rounded-[14px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1e] overflow-hidden transition-all">
      {/* Main row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 cursor-pointer hover:bg-[#f9f9f9] dark:hover:bg-white/[0.02] transition-colors" onClick={onToggle}>
        {/* Avatar & Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-500 dark:from-neutral-500 dark:to-neutral-400 flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {getInitials(student.full_name)}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-neutral-900 dark:text-white truncate">
              {student.full_name}
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 inline" />
              {student.course_applying_for}
              <span className="mx-1">·</span>
              <Phone className="w-3 h-3 inline" />
              {student.phone_whatsapp}
            </p>
          </div>
        </div>

        {/* Progress bar (desktop) */}
        {profile && (
          <div className="hidden sm:flex items-center gap-3 flex-1 max-w-[200px]">
            <div className="flex-1 h-2 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] overflow-hidden">
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
            <span className="text-[11px] text-neutral-500 font-mono w-12 text-right">
              {paidPercentage}%
            </span>
          </div>
        )}

        {/* Amount & Status */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right min-w-[80px]">
            <p className="text-[13px] font-medium text-neutral-900 dark:text-white">
              {formatCurrency(balance)}
            </p>
            <p className="text-[10px] text-neutral-400">Balance</p>
          </div>
          <div className="min-w-[70px]">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-[8px] ${
                statusStyles[status]
              }`}
            >
              {status === "paid" && <CheckCircle className="w-3 h-3" />}
              {status === "pending" && <Clock className="w-3 h-3" />}
              {status === "installment" && <CreditCard className="w-3 h-3" />}
              {status}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-neutral-100 dark:border-neutral-800/50">
          {/* Payment summary */}
          <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
            <div className="p-3 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Fee</p>
              <p className="text-[13px] font-semibold text-neutral-900 dark:text-white mt-1">
                {formatCurrency(totalFee)}
              </p>
            </div>
            <div className="p-3 rounded-[10px] bg-emerald-500/10">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Paid</p>
              <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(amountPaid)}
              </p>
            </div>
            <div className="p-3 rounded-[10px] bg-amber-500/10">
              <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wider">Balance</p>
              <p className="text-[13px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
                {formatCurrency(balance)}
              </p>
            </div>
          </div>

          {/* Recent payments */}
          {payments.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
                Recent Payments
              </p>
              <div className="space-y-1.5">
                {payments.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#f2f2f7] dark:bg-[#2c2c2e]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{methodIcons[p.payment_method] || "💳"}</span>
                      <div>
                        <p className="text-[12px] font-medium text-neutral-900 dark:text-white">
                          {formatCurrency(p.amount)}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {p.reference}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      {new Date(p.created_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {!profile ? (
              <button
                onClick={(e) => { e.stopPropagation(); onInitProfile(); }}
                className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[8px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Initialize Payment
              </button>
            ) : (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onRecordPayment(); }}
                  className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[8px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Payment
                </button>
                {balance > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onMarkPaid(); }}
                    className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[8px] border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-medium hover:bg-emerald-500/5 transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mark Fully Paid
                  </button>
                )}
                {payments.length > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onViewHistory(); }}
                    className="inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[8px] border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[12px] font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    History
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   Modal
   ═══════════════════════════════════════ */
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