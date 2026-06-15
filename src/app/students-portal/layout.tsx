"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  GraduationCap,
  CheckSquare,
  BarChart3,
  Home,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import BeyundLogo from "@/client/components/common/BeyundLogo";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import { getColors, type Colors } from "@/config/theme-colors";

// ── Types ──
interface StudentInfo {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  course_id?: string;
  cohort?: string;
  avatar_url?: string;
  course_title?: string;
}

// ── Nav Items ──
const navItems = [
  { label: "Dashboard", href: "/students-portal/dashboard", icon: <LayoutDashboard size={13} /> },
  { label: "My Courses", href: "/students-portal/courses", icon: <BookOpen size={13} /> },
  { label: "Assignments", href: "/students-portal/assignments", icon: <ClipboardList size={13} /> },
  { label: "Profile", href: "/students-portal/profile", icon: <User size={13} /> },
];

function DesktopSidebar({ collapsed, setCollapsed, student, onNavigate, C }: {
  collapsed: boolean; setCollapsed: (v: boolean) => void; student: StudentInfo | null; onNavigate: () => void; C: Colors;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 30,
      background: C.sidebarBg, borderRight: `1px solid ${C.border}`,
      width: collapsed ? 56 : 220, transition: "width 0.2s",
    }} className="hidden lg:flex lg:flex-col">
      <div style={{
        display: "flex", alignItems: "center", height: 48,
        borderBottom: `1px solid ${C.border}`, padding: "0 12px",
        justifyContent: collapsed ? "center" : "space-between",
      }}>
        {!collapsed ? (
          <Link href="/students-portal/dashboard" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
              <span style={{ color: C.teal }}>Student</span> Portal
            </span>
          </Link>
        ) : (
          <Link href="/students-portal/dashboard" style={{
            width: 24, height: 24, borderRadius: 3, background: C.card,
            border: `1px solid ${C.border}`, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <GraduationCap size={13} color={C.teal} />
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted, display: "flex" }}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Student info */}
      {student && !collapsed && (
        <div style={{
          padding: "10px 12px", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: C.teal, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff",
            flexShrink: 0,
          }}>
            {student.full_name.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {student.full_name}
            </p>
            <p style={{ fontSize: 9, color: C.muted, margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {student.course_title || "Student"}
            </p>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: collapsed ? "6px 0" : "6px 8px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 3, textDecoration: "none", fontSize: 11, fontWeight: 500,
                background: active ? C.sidebarActive : "transparent",
                color: active ? C.text : C.muted,
                border: active ? `1px solid ${C.border}` : "1px solid transparent",
                marginBottom: 2, transition: "background 0.1s, color 0.1s", cursor: "pointer",
              }}
              title={collapsed ? item.label : undefined}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = C.sidebarActive; e.currentTarget.style.color = C.text; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; } }}
            >
              <span style={{ display: "flex", flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign out at bottom */}
      <div style={{ padding: "8px", borderTop: `1px solid ${C.border}` }}>
        <LogoutButton collapsed={collapsed} C={C} />
      </div>
    </aside>
  );
}

function LogoutButton({ collapsed, C }: { collapsed: boolean; C: Colors }) {
  const [open, setOpen] = useState(false);
  if (open) return <SignOutOverlay C={C} onClose={() => setOpen(false)} />;
  return (
    <button onClick={() => setOpen(true)}
      style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%",
        padding: collapsed ? "6px 0" : "6px 8px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 3, border: "none", fontSize: 11, fontWeight: 500,
        background: "transparent", color: C.muted, cursor: "pointer",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.sidebarActive; e.currentTarget.style.color = C.red; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; }}
    >
      <LogOut size={13} />
      {!collapsed && <span>Sign out</span>}
    </button>
  );
}

function SignOutOverlay({ C, onClose }: { C: Colors; onClose: () => void }) {
  const [signingOut, setSigningOut] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const handleSignOut = async () => {
    setSigningOut(true);
    await new Promise(r => setTimeout(r, 100));
    await supabase.auth.signOut();
    window.location.href = "/students-portal/login";
  };

  if (signingOut) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: C.bg, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 24,
      }}>
        <div className="sp-loader" style={{ width: 40, height: 40, position: "relative" }} />
        <p style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>Signing out…</p>
        <style>{`
          .sp-loader {
            --c: no-repeat linear-gradient(#25b09b 0 0);
            background: var(--c) center/100% 10px, var(--c) center/10px 100%;
          }
          .sp-loader:before {
            content: '';
            position: absolute; inset: 0;
            background: var(--c) 0 0, var(--c) 100% 0, var(--c) 0 100%, var(--c) 100% 100%;
            background-size: 15.5px 15.5px;
            animation: sp-l16 1.5s infinite cubic-bezier(0.3,1,0,1);
          }
          @keyframes sp-l16 {
            33%  { inset: -10px; transform: rotate(0deg); }
            66%  { inset: -10px; transform: rotate(90deg); }
            100% { inset: 0; transform: rotate(90deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
        padding: "24px 28px", maxWidth: 320, width: "100%",
        boxShadow: "0 20px 48px rgba(0,0,0,0.45)", textAlign: "center",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(239,68,68,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px",
        }}>
          <LogOut size={20} color={C.red} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 8px" }}>Sign out?</p>
        <p style={{ fontSize: 11.5, color: C.muted, margin: "0 0 20px", lineHeight: 1.45 }}>
          You will be redirected to the student login page.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "9px 0", borderRadius: 6,
            border: `1px solid ${C.border}`, background: "transparent",
            color: C.text, fontSize: 12, fontWeight: 500, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={handleSignOut} style={{
            flex: 1, padding: "9px 0", borderRadius: 6,
            border: "none", background: C.red, color: "#fff",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({ open, onClose, student, C }: {
  open: boolean; onClose: () => void; student: StudentInfo | null; C: Colors;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const handleNav = (href: string) => { router.push(href); onClose(); };

  return (
    <>
      {open && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }} className="lg:hidden" onClick={onClose} />}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 51, width: 260,
        background: C.sidebarBg, borderRight: `1px solid ${C.border}`,
        transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s",
      }} className="lg:hidden">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 48, padding: "0 12px", borderBottom: `1px solid ${C.border}`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
            <span style={{ color: C.teal }}>Student</span> Portal
          </span>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted, display: "flex" }}>
            <X size={14} />
          </button>
        </div>
        {student && (
          <div style={{
            padding: "10px 12px", borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%", background: C.teal,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>
              {student.full_name.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {student.full_name}
              </p>
            </div>
          </div>
        )}
        <nav style={{ padding: "12px 8px" }}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <button key={item.href} onClick={() => handleNav(item.href)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "7px 8px", borderRadius: 3, border: "none", fontSize: 11,
                  fontWeight: 500, cursor: "pointer", textAlign: "left",
                  background: active ? C.sidebarActive : "transparent",
                  color: active ? C.text : C.muted, marginBottom: 2,
                }}>
                <span style={{ display: "flex", flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            );
          })}
          <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
          <LogoutButton collapsed={false} C={C} />
        </nav>
      </div>
    </>
  );
}

function MobileTabBar({ onMenuOpen, C }: { onMenuOpen: () => void; C: Colors }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, height: 56,
      paddingBottom: "env(safe-area-inset-bottom, 0)", background: C.sidebarBg,
      borderTop: `1px solid ${C.border}`, display: "none",
    }} className="lg:!hidden flex">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: "100%", padding: "0 4px", width: "100%" }}>
        {navItems.slice(0, 4).map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "4px 4px", textDecoration: "none", minWidth: 0, flex: 1,
                color: active ? C.text : C.muted, fontSize: 9, fontWeight: 500,
              }}>
              {item.icon}
              <span style={{ fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
            </Link>
          );
        })}
        <button onClick={onMenuOpen}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            padding: "4px 4px", background: "transparent", border: "none", cursor: "pointer",
            color: C.muted, flex: 1,
          }}>
          <Menu size={13} />
          <span style={{ fontSize: 9 }}>More</span>
        </button>
      </div>
    </nav>
  );
}

function StudentTopbar({ onMobileMenuOpen, collapsed, student, C, onSignOut }: {
  onMobileMenuOpen: () => void; collapsed: boolean; student: StudentInfo | null; C: Colors; onSignOut: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const iconBtnHover = theme === "dark" ? "#171717" : C.sidebarActive;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[120] h-12"
        style={{
          borderBottom: `1px solid ${theme === "dark" ? "#1f1f1f" : C.border}`,
          background: C.bg,
          backdropFilter: "saturate(140%) blur(6px)",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "100%", padding: "0 12px", gap: 8,
        }} className="md:px-6 md:gap-5">
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <button onClick={onMobileMenuOpen}
              aria-label="Open menu"
              className="lg:hidden flex items-center justify-center"
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, color: C.muted, borderRadius: 6, flexShrink: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = iconBtnHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Menu size={16} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
              <span style={{ color: C.teal }}>Student</span> Portal
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <button onClick={toggleTheme}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className="hidden lg:flex items-center justify-center"
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 7, color: C.muted, borderRadius: 6 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = iconBtnHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={() => setSignOutOpen(true)}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 7, color: C.muted, display: "flex", borderRadius: 6 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = iconBtnHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={15} />
            </button>
            {student && (
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: C.teal,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {student.full_name.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2)}
              </div>
            )}
          </div>
        </div>
      </header>
      {signOutOpen && <SignOutOverlay C={C} onClose={() => setSignOutOpen(false)} />}
    </>
  );
}

function StudentLayoutInner({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabaseRef = useRef(createSupabaseBrowserClient());
  const supabase = supabaseRef.current;
  const { theme } = useTheme();
  const C = getColors(theme);
  const isLoginPage = pathname === "/students-portal/login";
  const isLoginRef = useRef(isLoginPage);
  isLoginRef.current = isLoginPage;

  useEffect(() => {
    if (isLoginPage) { setLoading(false); return; }
    let cancelled = false;

    async function loadStudent() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled || isLoginRef.current) return;
      if (!session) {
        router.push("/students-portal/login");
        return;
      }

      // Check registration status first — force logout if pending/restricted
      const { data: regData } = await supabase
        .from("student_registrations")
        .select("status")
        .eq("email", session.user.email)
        .maybeSingle();

      if (cancelled || isLoginRef.current) return;
      if (regData && regData.status !== "enrolled") {
        await supabase.auth.signOut();
        router.push("/students-portal/login");
        return;
      }

      const { data: studentData, error } = await supabase
        .from("students")
        .select("*, courses:course_id(title)")
        .eq("auth_user_id", session.user.id)
        .single();

      if (cancelled || isLoginRef.current) return;
      if (error || !studentData) {
        await supabase.auth.signOut();
        router.push("/students-portal/login");
        return;
      }

      setStudent({
        id: studentData.id,
        full_name: studentData.full_name,
        email: studentData.email,
        phone: studentData.phone,
        course_id: studentData.course_id,
        cohort: studentData.cohort,
        avatar_url: studentData.avatar_url,
        course_title: studentData.courses?.title,
      });
      setLoading(false);
    }

    loadStudent();

    return () => { cancelled = true; };
  }, []); // Run ONLY on mount — no dependency on pathname or isLoginPage

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.dim}`, borderTopColor: C.teal }} />
    </div>
  );
  if (isLoginPage) return <div style={{ background: C.bg, minHeight: "100vh" }}>{children}</div>;
  if (!student) return null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <DesktopSidebar collapsed={collapsed} setCollapsed={setCollapsed} student={student} onNavigate={() => {}} C={C} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} student={student} C={C} />
      <div
        style={{
          display: "flex", flexDirection: "column", minWidth: 0,
          transition: "margin-left 0.2s", marginLeft: 0, paddingBottom: 64,
        }}
        className="lg:pb-0"
        data-collapsed={collapsed ? "true" : "false"}
      >
        <style>{`
          @media (min-width: 1024px) {
            [data-collapsed="true"] { margin-left: 56px !important; }
            [data-collapsed="false"] { margin-left: 220px !important; }
          }
        `}</style>
        <StudentTopbar
          onMobileMenuOpen={() => setDrawerOpen(true)}
          collapsed={collapsed}
          student={student}
          C={C}
          onSignOut={() => setSignOutOpen(true)}
        />
        <main style={{ flex: 1, overflow: "auto", width: "100%", paddingTop: 48 }} className="lg:pt-0">
          <div style={{ padding: "12px" }}>{children}</div>
        </main>
      </div>
      <MobileTabBar onMenuOpen={() => setDrawerOpen(true)} C={C} />
      {signOutOpen && <SignOutOverlay C={C} onClose={() => setSignOutOpen(false)} />}
    </div>
  );
}

export default function StudentsPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <StudentLayoutInner>{children}</StudentLayoutInner>
    </ThemeProvider>
  );
}