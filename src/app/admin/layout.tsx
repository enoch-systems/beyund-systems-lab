"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Clock,
  Bell,
  MessageSquare,
  BookOpen,
  BarChart3,
  Award,
  CreditCard,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  X,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { ThemeProvider, useTheme } from "@/lib/theme-context";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Core",
    items: [
      { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
      { label: "Students", href: "/admin/students", icon: <Users className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    label: "Academic",
    items: [
      { label: "Courses", href: "/admin/courses", icon: <BookOpen className="w-[18px] h-[18px]" /> },
      { label: "Assignments", href: "/admin/assignments", icon: <ClipboardList className="w-[18px] h-[18px]" /> },
      { label: "Schedule", href: "/admin/schedule", icon: <Clock className="w-[18px] h-[18px]" /> },
      { label: "Attendance", href: "/admin/attendance", icon: <CheckSquare className="w-[18px] h-[18px]" /> },
      { label: "Calendar", href: "/admin/calendar", icon: <CalendarDays className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Payments", href: "/admin/payments", icon: <CreditCard className="w-[18px] h-[18px]" /> },
      { label: "Notifications", href: "/admin/notifications", icon: <Bell className="w-[18px] h-[18px]" /> },
      { label: "Messages", href: "/admin/messages", icon: <MessageSquare className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="w-[18px] h-[18px]" /> },
      { label: "Certificates", href: "/admin/certificates", icon: <Award className="w-[18px] h-[18px]" /> },
      { label: "Settings", href: "/admin/settings", icon: <Settings className="w-[18px] h-[18px]" /> },
    ],
  },
];

function AdminSidebar({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed }: {
  sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#0a0a0a] border-r border-neutral-200 dark:border-neutral-800/80 flex flex-col transition-all duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-[60px]" : "w-[240px]"}`}
      >
        <div className={`flex items-center h-14 border-b border-neutral-200 dark:border-neutral-800/80 ${collapsed ? "justify-center px-0" : "justify-between px-4"}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <img
                src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
                alt="Beyund Labs"
                className="w-7 h-7 rounded-lg object-cover"
              />
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Be<span className="text-amber-500">yund</span> 𝙻𝚊<span className="text-amber-500">𝚋𝚜.</span> <span className="text-amber-500">LMS</span>
              </span>
            </div>
          )}
          {collapsed && (
            <img
              src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
              alt="Beyund Labs"
              className="w-7 h-7 rounded-lg object-cover"
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-6 h-6 rounded-md items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${collapsed ? "mx-auto" : ""}`}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center rounded-lg text-[13px] font-medium transition-colors ${
                        collapsed ? "justify-center px-0 py-2 mx-auto w-10 h-10" : "gap-3 px-3 py-2"
                      } ${
                        isActive
                          ? "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-900 dark:text-white"
                          : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      {item.icon}
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-neutral-200 dark:border-neutral-800/80">
          <Link
            href="/admin/settings"
            className={`flex items-center rounded-lg text-[13px] font-medium transition-colors text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 ${
              collapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
            }`}
          >
            <Users className="w-[18px] h-[18px]" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-neutral-900 dark:text-white truncate">Admin</p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">admin@beyund.com</p>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}

function AdminTopbar({ sidebarOpen, setSidebarOpen, collapsed }: {
  sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void;
  collapsed: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-neutral-200 dark:border-neutral-800/80 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students, courses, assignments..."
              className="w-64 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border-0 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white/20"
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 text-neutral-400 dark:text-neutral-500 text-sm">
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
              ⌘K
            </kbd>
          </button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button onClick={toggleTheme} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="Toggle theme">
          {theme === "dark" ? (
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <Link href="/admin/notifications" className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </Link>
        <Link href="/admin/settings" className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <Settings className="w-[18px] h-[18px]" />
        </Link>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-medium cursor-pointer ml-1">
          A
        </div>
      </div>
    </header>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createSupabaseBrowserClient();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) { setLoading(false); return; }
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else setUser({ email: session.user.email ?? "" });
      setLoading(false);
    }
    getUser();
  }, [router, supabase, isLoginPage]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white" />
    </div>
  );
  if (isLoginPage) return <>{children}</>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-white transition-colors">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex flex-col min-w-0 transition-all duration-200 ${collapsed ? "lg:ml-[60px]" : "lg:ml-[240px]"}`}>
        <AdminTopbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} collapsed={collapsed} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ThemeProvider>
  );
}