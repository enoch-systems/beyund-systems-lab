"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Clock,
  Bell,
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
  LogOut,
  Sparkles,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { ProfileProvider, useProfile } from "@/lib/profile-context";
import { apple } from "@/lib/admin-design-system";

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Core",
    items: [
      { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: "Students", href: "/admin/students", icon: <Users className="w-4 h-4" /> },
    ],
  },
  {
    label: "Academic",
    items: [
      { label: "Courses", href: "/admin/courses", icon: <BookOpen className="w-4 h-4" /> },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Payments", href: "/admin/payments", icon: <CreditCard className="w-4 h-4" /> },
      { label: "Notifications", href: "/admin/notifications", icon: <Bell className="w-4 h-4" /> },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="w-4 h-4" /> },
      { label: "Certificates", href: "/admin/certificates", icon: <Award className="w-4 h-4" /> },
      { label: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

/* ═══════════════════════════════════════
   Shared
   ═══════════════════════════════════════ */
function useActiveRoute() {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };
}

/* ═══════════════════════════════════════
   Desktop Sidebar
   ═══════════════════════════════════════ */
function DesktopSidebar({
  collapsed,
  setCollapsed,
  onNavigate,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onNavigate: () => void;
}) {
  const isActive = useActiveRoute();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-white dark:bg-[#0a0a0a] border-r border-neutral-200/70 dark:border-neutral-800/70 transition-all duration-300 ease-out ${
        collapsed ? "w-[64px]" : "w-[240px]"
      }`}
    >
      {/* ── Logo ── */}
      <div className={`flex items-center h-14 border-b border-neutral-200/70 dark:border-neutral-800/70 ${collapsed ? "justify-center px-0" : "justify-between px-4"}`}>
        {!collapsed ? (
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white dark:text-neutral-900" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">Academy</span>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">LMS</span>
            </div>
          </Link>
        ) : (
          <Link href="/admin" className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white dark:text-neutral-900" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2.5 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center rounded-lg text-sm font-medium transition-all duration-150 ${
                      collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2"
                    } ${
                      active
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-2.5 py-3 border-t border-neutral-200/70 dark:border-neutral-800/70">
        <Link
          href="/admin/settings"
          onClick={onNavigate}
          className={`flex items-center rounded-lg text-sm font-medium transition-all duration-150 text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 ${
            collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2"
          }`}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════
   Mobile Drawer
   ═══════════════════════════════════════ */
function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isActive = useActiveRoute();
  const router = useRouter();

  const handleNav = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-[#0a0a0a] border-r border-neutral-200/70 dark:border-neutral-800/70 transform transition-all duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-200/70 dark:border-neutral-800/70">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white dark:text-neutral-900" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">Academy</span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">LMS</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNav(item.href)}
                      className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 min-h-[44px] ${
                        active
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                          : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-neutral-200/70 dark:border-neutral-800/70">
          <button
            onClick={() => handleNav("/admin/settings")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all duration-150 min-h-[44px]"
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   Mobile Bottom Tab Bar
   ═══════════════════════════════════════ */
function MobileTabBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const isActive = useActiveRoute();

  // Show the first 5 nav items as tabs
  const tabs = allNavItems.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-neutral-200/70 dark:border-neutral-800/70 safe-area-bottom">
      <div className="flex items-center justify-around h-full px-2">
        {tabs.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg min-w-[48px] min-h-[44px] transition-colors duration-150 ${
                active
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-400 dark:text-neutral-500"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-[10px] font-medium leading-none truncate max-w-[48px] text-center">
                {item.label}
              </span>
              {active && <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-neutral-900 dark:bg-white" />}
            </Link>
          );
        })}
        <button
          onClick={onMenuOpen}
          className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg min-w-[48px] min-h-[44px] text-neutral-400 dark:text-neutral-500 transition-colors duration-150"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════
   Top Bar
   ═══════════════════════════════════════ */
function AdminTopbar({
  onMobileMenuOpen,
  collapsed,
}: {
  onMobileMenuOpen: () => void;
  collapsed: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-20 h-14 lg:h-14 border-b border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border-0 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900/20 dark:focus:ring-white/20"
                />
              </div>
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 text-neutral-400 dark:text-neutral-500 text-sm w-full max-w-[280px] lg:max-w-[360px] hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Search students, courses...</span>
              <kbd className="ml-auto text-[10px] font-mono text-neutral-400 dark:text-neutral-600 bg-neutral-200/50 dark:bg-neutral-700/50 px-1.5 py-0.5 rounded hidden lg:inline">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-w-[44px] min-h-[44px]"
            title="Toggle theme"
          >
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

          <Link
            href="/admin/notifications"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative min-w-[44px] min-h-[44px]"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0a0a0a]" />
          </Link>

          <Link
            href="/admin/settings"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm min-w-[36px] min-h-[36px] overflow-hidden cursor-pointer hover:ring-2 hover:ring-violet-400/40 transition-all"
            title="Open settings"
          >
            <HeaderAvatar />
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeaderAvatar() {
  const { profileImage } = useProfile();
  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt="Admin avatar"
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <>
      <span className="hidden sm:inline">A</span>
      <span className="sm:hidden text-xs">A</span>
    </>
  );
}

/* ═══════════════════════════════════════
   Layout Shell
   ═══════════════════════════════════════ */
function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  // Close mobile drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white animate-spin" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading dashboard...</p>
      </div>
    </div>
  );
  if (isLoginPage) return <>{children}</>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-white transition-colors">
      {/* Desktop sidebar */}
      <DesktopSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onNavigate={() => {}}
      />

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main content area */}
      <div className={`flex flex-col min-w-0 transition-all duration-300 ease-out pb-16 lg:pb-0 ${
        collapsed ? "lg:ml-[64px]" : "lg:ml-[240px]"
      }`}>
        <AdminTopbar
          onMobileMenuOpen={() => setDrawerOpen(true)}
          collapsed={collapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <MobileTabBar onMenuOpen={() => setDrawerOpen(true)} />
    </div>
  );
}

/* ═══════════════════════════════════════
   Export
   ═══════════════════════════════════════ */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </ProfileProvider>
    </ThemeProvider>
  );
}
