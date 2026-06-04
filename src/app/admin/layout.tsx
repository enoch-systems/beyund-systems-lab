"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Bell,
  BookOpen,
  BarChart3,
  Award,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import BeyundLogo from "@/components/BeyundLogo";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { ProfileProvider, useProfile } from "@/lib/profile-context";
import GlobalSearch from "@/components/admin/GlobalSearch";
import { getColors, type Colors } from "@/lib/theme-colors";

/* ── Types ── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Core",
    items: [
      { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={13} /> },
      { label: "Students", href: "/admin/students", icon: <Users size={13} /> },
    ],
  },
  {
    label: "Academic",
    items: [
      { label: "Courses", href: "/admin/courses", icon: <BookOpen size={13} /> },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Payments", href: "/admin/payments", icon: <CreditCard size={13} /> },
      { label: "Notifications", href: "/admin/notifications", icon: <Bell size={13} /> },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Analytics", href: "#", icon: <BarChart3 size={13} />, badge: "Soon" },
      { label: "Certificates", href: "/admin/certificates", icon: <Award size={13} /> },
      { label: "Settings", href: "/admin/settings", icon: <Settings size={13} /> },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

function useActiveRoute() {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };
}

/* ── Desktop Sidebar ── */
function DesktopSidebar({ collapsed, setCollapsed, onNavigate, C }: {
  collapsed: boolean; setCollapsed: (v: boolean) => void; onNavigate: () => void; C: Colors;
}) {
  const isActive = useActiveRoute();
  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 30,
      background: C.sidebarBg, borderRight: `1px solid ${C.border}`,
      width: collapsed ? 56 : 220, transition: "width 0.2s",
    }} className="hidden lg:flex lg:flex-col">
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", height: 48,
        borderBottom: `1px solid ${C.border}`,
        padding: collapsed ? "0 12px" : "0 12px",
        justifyContent: collapsed ? "center" : "space-between",
      }}>
        {!collapsed ? (
          <Link href="/admin" style={{ display: "flex", alignItems: "center" }}>
            <BeyundLogo className="h-6" />
          </Link>
        ) : (
          <Link href="/admin" style={{
            width: 24, height: 24, borderRadius: 3,
            background: C.card, border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <img
              src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
              alt="Beyund"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted, display: "flex" }}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 16 }}>
            {!collapsed && (
              <p style={{
                fontSize: 9, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", color: C.dim, margin: "0 8px 6px",
                fontFamily: "'JetBrains Mono','SF Mono',monospace",
              }}>
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={onNavigate}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: collapsed ? "6px 0" : "6px 8px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 3, textDecoration: "none",
                    fontSize: 11, fontWeight: 500,
                    background: active ? C.sidebarActive : "transparent",
                    color: active ? C.text : C.muted,
                    border: active ? `1px solid ${C.border}` : "1px solid transparent",
                    marginBottom: 2,
                    transition: "background 0.1s, color 0.1s",
                    cursor: "pointer",
                  }}
                  title={collapsed ? item.label : undefined}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = C.sidebarActive; e.currentTarget.style.color = C.text; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; } }}
                >
                  <span style={{ display: "flex", flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span style={{
                      fontSize: 8, fontWeight: 600, padding: "1px 5px",
                      borderRadius: 2, background: C.card, color: C.muted,
                      border: `1px solid ${C.border}`,
                      fontFamily: "'JetBrains Mono','SF Mono',monospace",
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

/* ── Mobile Drawer ── */
function MobileDrawer({ open, onClose, C }: { open: boolean; onClose: () => void; C: Colors }) {
  const isActive = useActiveRoute();
  const router = useRouter();
  const handleNav = (href: string) => { router.push(href); onClose(); };

  return (
    <>
      {open && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }} className="lg:hidden" onClick={onClose} />}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 51,
        width: 260, background: C.sidebarBg, borderRight: `1px solid ${C.border}`,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s",
      }} className="lg:hidden">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 48, padding: "0 12px", borderBottom: `1px solid ${C.border}` }}>
          <BeyundLogo className="h-[22px]" />
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted, display: "flex" }}>
            <X size={14} />
          </button>
        </div>
        <nav style={{ padding: "12px 8px" }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: C.dim, margin: "0 8px 6px", fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{group.label}</p>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <button key={item.href} onClick={() => handleNav(item.href)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, width: "100%",
                      padding: "7px 8px", borderRadius: 3, border: "none",
                      fontSize: 11, fontWeight: 500, cursor: "pointer",
                      background: active ? C.sidebarActive : "transparent",
                      color: active ? C.text : C.muted,
                      marginBottom: 2, textAlign: "left",
                    }}>
                    <span style={{ display: "flex", flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 2, background: C.card, color: C.muted, border: `1px solid ${C.border}`, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

/* ── Mobile Tab Bar ── */
function MobileTabBar({ onMenuOpen, C }: { onMenuOpen: () => void; C: Colors }) {
  const isActive = useActiveRoute();
  const tabs = allNavItems.slice(0, 5);
  return (
    <nav style={{
      display: "none", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, height: 52,
      background: C.sidebarBg, borderTop: `1px solid ${C.border}`,
    }} className="lg:hidden">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: "100%", padding: "0 4px" }}>
        {tabs.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "4px 8px", textDecoration: "none",
                color: active ? C.text : C.muted, fontSize: 9, fontWeight: 500,
              }}>
              {item.icon}
              <span style={{ fontSize: 9 }}>{item.label}</span>
            </Link>
          );
        })}
        <button onClick={onMenuOpen}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 8px", background: "transparent", border: "none", cursor: "pointer", color: C.muted }}>
          <Menu size={13} />
          <span style={{ fontSize: 9 }}>More</span>
        </button>
      </div>
    </nav>
  );
}

/* ── Top Bar ── */
function AdminTopbar({ onMobileMenuOpen, collapsed, C }: { onMobileMenuOpen: () => void; collapsed: boolean; C: Colors }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 20, height: 48,
      borderBottom: `1px solid ${C.border}`,
      background: C.bg,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "0 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <button onClick={onMobileMenuOpen}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted }}
            className="lg:hidden">
            <Menu size={14} />
          </button>
          <Link href="/admin" className="lg:hidden">
            <BeyundLogo className="h-5" />
          </Link>
          <GlobalSearch />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggleTheme}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted, display: "flex" }}
            title="Toggle theme">
            {theme === "dark" ? (
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <Link href="/admin/notifications" style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted, display: "flex", textDecoration: "none" }}>
            <Bell size={13} />
            <span style={{ position: "absolute", top: 1, right: 1, width: 5, height: 5, borderRadius: "50%", background: C.red }} />
          </Link>
          <Link href="/admin/settings" style={{
            width: 24, height: 24, borderRadius: "50%", background: C.card,
            border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none", color: C.muted, fontSize: 10, fontWeight: 600,
          }}>
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
    return <img src={profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />;
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M12 13c-4.418 0-8 2.686-8 6v1h16v-1c0-3.314-3.582-6-8-6z" />
    </svg>
  );
}

/* ── Layout Shell ── */
function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createSupabaseBrowserClient();
  const { theme } = useTheme();
  const C = getColors(theme);

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

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.dim}`, borderTopColor: C.teal }} />
    </div>
  );
  if (isLoginPage) return <div style={{ background: C.bg, minHeight: "100vh" }}>{children}</div>;
  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <DesktopSidebar collapsed={collapsed} setCollapsed={setCollapsed} onNavigate={() => {}} C={C} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} C={C} />

      <div style={{
        display: "flex", flexDirection: "column", minWidth: 0,
        transition: "margin-left 0.2s",
        marginLeft: collapsed ? 56 : 220,
        paddingBottom: 56,
      }} className="lg:pb-0 lg:ml-auto-style">
        <AdminTopbar onMobileMenuOpen={() => setDrawerOpen(true)} collapsed={collapsed} C={C} />
        <main style={{ flex: 1, overflow: "auto", width: "100%" }}>
          <div style={{ padding: "12px" }}>
            {children}
          </div>
        </main>
      </div>

      <MobileTabBar onMenuOpen={() => setDrawerOpen(true)} C={C} />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </ProfileProvider>
    </ThemeProvider>
  );
}