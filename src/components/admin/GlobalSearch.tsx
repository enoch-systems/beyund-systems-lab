"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import {
  Search,
  User,
  BookOpen,
  CreditCard,
  Bell,
  Loader2,
  Users,
  ArrowUpRight,
  Clock,
  X,
} from "lucide-react";

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
type SearchCategory = "student" | "course" | "payment" | "notification";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  href: string;
  metadata?: string;
};

const categoryConfig: Record<SearchCategory, { label: string; icon: React.ReactNode; color: string }> = {
  student: {
    label: "Student",
    icon: <User className="w-3.5 h-3.5" />,
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  course: {
    label: "Course",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  payment: {
    label: "Payment",
    icon: <CreditCard className="w-3.5 h-3.5" />,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  notification: {
    label: "Notification",
    icon: <Bell className="w-3.5 h-3.5" />,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
};

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */
export default function GlobalSearch() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searched, setSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Keyboard shortcut: ⌘K / Ctrl+K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        if (!open) setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  /* ── Close on click outside ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Debounced search ── */
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      const q = query.trim().toLowerCase();
      const allResults: SearchResult[] = [];

      // 1. Search students
      const { data: students } = await supabase
        .from("student_registrations")
        .select("id, full_name, email, course_applying_for, status")
        .or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
        .limit(5);

      if (students) {
        students.forEach((s) => {
          allResults.push({
            id: `student-${s.id}`,
            title: s.full_name,
            subtitle: s.email,
            category: "student",
            href: "/admin/students",
            metadata: s.status,
          });
        });
      }

      // 2. Search courses
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title, status")
        .ilike("title", `%${q}%`)
        .limit(5);

      if (courses) {
        courses.forEach((c) => {
          allResults.push({
            id: `course-${c.id}`,
            title: c.title,
            subtitle: `${c.status} course`,
            category: "course",
            href: "/admin/courses",
            metadata: c.status,
          });
        });
      }

      // 3. Search payments (via student names)
      const { data: payments } = await supabase
        .from("payments")
        .select("id, reference, amount, payment_method, student_id, notes")
        .or(`reference.ilike.%${q}%,notes.ilike.%${q}%`)
        .limit(5);

      if (payments) {
        payments.forEach((p) => {
          allResults.push({
            id: `payment-${p.id}`,
            title: `Payment ${p.reference || `#${p.id.slice(0, 8)}`}`,
            subtitle: `₦${p.amount.toLocaleString()} · ${p.payment_method}`,
            category: "payment",
            href: "/admin/payments",
            metadata: p.notes || "payment",
          });
        });
      }

      // 4. Search notifications
      const { data: notifs } = await supabase
        .from("notifications")
        .select("id, title, message, category")
        .or(`title.ilike.%${q}%,message.ilike.%${q}%`)
        .limit(5);

      if (notifs) {
        notifs.forEach((n) => {
          allResults.push({
            id: `notif-${n.id}`,
            title: n.title,
            subtitle: n.message.length > 60 ? n.message.slice(0, 60) + "…" : n.message,
            category: "notification",
            href: "/admin/notifications",
            metadata: n.category,
          });
        });
      }

      setResults(allResults.slice(0, 12));
      setSelectedIndex(0);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, supabase]);

  /* ── Keyboard navigation ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigateTo(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  const navigateTo = (result: SearchResult) => {
    router.push(result.href);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={dropdownRef} className="relative flex-1 max-w-[480px]">
      {/* ── Search input ── */}
      {open ? (
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search students, courses, payments..."
              className="w-full pl-9 pr-3 py-2 rounded-[10px] bg-neutral-100 dark:bg-neutral-800/60 border-0 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900/20 dark:focus:ring-white/20"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-neutral-400" />
            )}
          </div>
          <button
            onClick={() => { setOpen(false); setQuery(""); }}
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="hidden sm:flex items-center gap-2 w-full px-3 py-2 rounded-[10px] bg-neutral-100 dark:bg-neutral-800/60 text-neutral-400 dark:text-neutral-500 text-sm hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Search students, courses...</span>
          <kbd className="ml-auto text-[10px] font-mono text-neutral-400 dark:text-neutral-600 bg-neutral-200/50 dark:bg-neutral-700/50 px-1.5 py-0.5 rounded hidden lg:inline">
            ⌘K
          </kbd>
        </button>
      )}

      {/* ── Dropdown ── */}
      {open && searched && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1c1c1e] border border-neutral-200 dark:border-neutral-800 rounded-[14px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {results.length === 0 && !loading ? (
            <div className="flex flex-col items-center py-10 text-center px-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-[13px] font-medium text-neutral-500">No matching records found</p>
              <p className="text-[11px] text-neutral-400 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto py-2">
              {results.map((result, index) => {
                const cfg = categoryConfig[result.category];
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => navigateTo(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-neutral-100 dark:bg-neutral-800/60"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                    }`}
                  >
                    {/* Category icon */}
                    <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5 ${cfg.color}`}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-neutral-900 dark:text-white truncate">
                          {result.title}
                        </p>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] shrink-0 ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">
                        {result.subtitle}
                      </p>
                    </div>

                    {/* Right metadata */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      {result.metadata && (
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-600 capitalize">
                          {result.metadata}
                        </span>
                      )}
                      <ArrowUpRight className="w-3 h-3 text-neutral-300 dark:text-neutral-600" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer hint */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/50">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[9px]">↑</kbd>
                <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[9px]">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[9px]">↵</kbd>
                Open
              </span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-neutral-400">
              <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[9px]">esc</kbd>
              Close
            </span>
          </div>
        </div>
      )}

      {/* Mobile search trigger */}
      {!open && (
        <button
          onClick={() => { setOpen(true); }}
          className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}