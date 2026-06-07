"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useTheme } from "@/lib/theme-context";
import { useSearchOverlay } from "@/lib/search-overlay-context";
import { getColors } from "@/lib/theme-colors";
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
  const { theme } = useTheme();
  const C = getColors(theme);
  const iconBtnHover = theme === "dark" ? "#171717" : C.sidebarActive;
  const overlay = useSearchOverlay();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searched, setSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* sync open state to overlay context */
  useEffect(() => { overlay.setOpen(open); }, [open, overlay]);

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
            href: "/adminportal/students",
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
            href: "/adminportal/courses",
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
            href: "/adminportal/payments",
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
            href: "/adminportal/notifications",
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
    <div ref={dropdownRef} className="relative flex-1 max-w-[480px] min-w-0">
      {/* ── Search input ── */}
      {open ? (
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: C.muted }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search students, courses, payments..."
              style={{
                width: "100%",
                paddingLeft: 32,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 8,
                background: C.card,
                border: `1px solid ${C.border}`,
                color: C.text,
                fontSize: 13,
                outline: "none",
                height: 30,
              }}
              className="focus:ring-1"
              onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 1px ${C.teal}40`}
              onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin" style={{ color: C.muted }} />
            )}
          </div>
          <button
            onClick={() => { setOpen(false); setQuery(""); }}
            style={{
              fontSize: 14,
              color: C.muted,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              minWidth: 44,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          {/* Mobile: icon-only trigger */}
          <button
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="sm:hidden flex items-center justify-center shrink-0"
            aria-label="Open search"
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: "transparent", border: "none",
              color: C.muted, cursor: "pointer", padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = iconBtnHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          {/* Desktop: full search bar */}
          <button
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="hidden sm:flex items-center gap-2 w-full px-3 rounded-[8px] transition-colors min-w-0"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.muted,
              fontSize: 13,
              height: 30,
            }}
            aria-label="Open search"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-[12px]">Search students, courses, payments...</span>
            <kbd className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded hidden lg:inline shrink-0" style={{
              color: C.dim,
              background: C.sidebarActive,
            }}>
              ⌘K
            </kbd>
          </button>
        </>
      )}

      <style>{`
.thin-scroll::-webkit-scrollbar {
  width: 3px;
}
.thin-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.thin-scroll::-webkit-scrollbar-thumb {
  background: rgba(128,128,128,0.3);
  border-radius: 2px;
}
.thin-scroll {
  scrollbar-width: thin;
}
      `}</style>

      {/* ── Dropdown ── */}
      {open && searched && (
        <div
          className="fixed sm:absolute top-12 left-1/2 -translate-x-1/2 sm:translate-y-0 sm:translate-x-0 sm:top-full sm:left-0 sm:right-0 mt-2 sm:mt-2 w-[calc(100vw-32px)] sm:w-auto rounded-[14px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)] overflow-hidden z-[110] animate-in fade-in duration-200"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
          }}
        >
          {results.length === 0 && !loading ? (
            <div className="flex flex-col items-center py-10 text-center px-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: C.sidebarActive }}>
                <Search className="w-5 h-5" style={{ color: C.dim }} />
              </div>
              <p className="text-[13px] font-medium" style={{ color: C.muted }}>No matching records found</p>
              <p className="text-[11px] mt-1" style={{ color: C.dim }}>Try a different search term</p>
            </div>
          ) : (
          <div className="max-h-[280px] overflow-y-auto py-0.5 sm:py-2 thin-scroll">
              {results.map((result, index) => {
                const cfg = categoryConfig[result.category];
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => navigateTo(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="w-full flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2.5 text-left transition-colors"
                    style={{
                      background: isSelected ? C.sidebarActive : "transparent",
                    }}
                  >
                    {/* Category icon — hidden on mobile */}
                    <div className={`hidden sm:flex w-8 h-8 rounded-[8px] items-center justify-center shrink-0 ${cfg.color}`}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-0.5 sm:gap-2">
                        <p className="text-[10px] leading-tight sm:text-[13px] font-medium truncate" style={{ color: C.text }}>
                          {result.title}
                        </p>
                        <span className={`text-[7px] leading-none sm:text-[10px] font-medium px-0.5 sm:px-1.5 py-[1px] sm:py-0.5 rounded-[2px] sm:rounded-[4px] shrink-0 ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[8px] leading-tight sm:text-[11px] truncate mt-0 sm:mt-0.5" style={{ color: C.muted }}>
                        {result.subtitle}
                      </p>
                    </div>

                    {/* Right metadata */}
                    <div className="hidden sm:flex shrink-0 items-center gap-1 sm:gap-1.5">
                      {result.metadata && (
                        <span className="text-[9px] sm:text-[10px] capitalize" style={{ color: C.dim }}>
                          {result.metadata}
                        </span>
                      )}
                      <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ color: C.dim }} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer hint */}
          <div className="flex items-center justify-between px-2 sm:px-4 py-1 sm:py-2 border-t" style={{ borderColor: C.border }}>
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1 text-[8px] sm:text-[10px]" style={{ color: C.dim }}>
                <kbd className="px-1 py-0.5 rounded font-mono text-[7px] sm:text-[9px]" style={{ background: C.sidebarActive, color: C.muted }}>↑</kbd>
                <kbd className="px-1 py-0.5 rounded font-mono text-[7px] sm:text-[9px]" style={{ background: C.sidebarActive, color: C.muted }}>↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1 text-[8px] sm:text-[10px]" style={{ color: C.dim }}>
                <kbd className="px-1 py-0.5 rounded font-mono text-[7px] sm:text-[9px]" style={{ background: C.sidebarActive, color: C.muted }}>↵</kbd>
                Open
              </span>
            </div>
            <span className="flex items-center gap-1 text-[8px] sm:text-[10px]" style={{ color: C.dim }}>
              <kbd className="px-1 py-0.5 rounded font-mono text-[7px] sm:text-[9px]" style={{ background: C.sidebarActive, color: C.muted }}>esc</kbd>
              Close
            </span>
          </div>
        </div>
      )}

    </div>
  );
}