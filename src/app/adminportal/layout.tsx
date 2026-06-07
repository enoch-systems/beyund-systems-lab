"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import BeyundLogo from "@/components/BeyundLogo";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { ProfileProvider, useProfile } from "@/lib/profile-context";
import { SearchOverlayProvider, useSearchOverlay } from "@/lib/search-overlay-context";
import GlobalSearch from "@/components/admin/GlobalSearch";
import { getColors, type Colors } from "@/lib/theme-colors";

interface NavItem { label: string; href: string; icon: React.ReactNode; badge?: number | string; }

const navGroups: { label: string; items: NavItem[] }[] = [
  { label: "Core", items: [
    { label: "Dashboard", href: "/adminportal", icon: <LayoutDashboard size={13} /> },
    { label: "Students", href: "/adminportal/students", icon: <Users size={13} /> },
  ]},
  { label: "Academic", items: [
    { label: "Courses", href: "/adminportal/courses", icon: <BookOpen size={13} /> },
  ]},
  { label: "Operations", items: [
    { label: "Payments", href: "/adminportal/payments", icon: <CreditCard size={13} /> },
    { label: "Notifications", href: "/adminportal/notifications", icon: <Bell size={13} /> },
  ]},
  { label: "System", items: [
    { label: "Analytics", href: "#", icon: <BarChart3 size={13} />, badge: "Soon" },
    { label: "Certificates", href: "/adminportal/certificates", icon: <Award size={13} /> },
    { label: "Settings", href: "/adminportal/settings", icon: <Settings size={13} /> },
  ]},
];

const allNavItems = navGroups.flatMap((g) => g.items);

function useActiveRoute() {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/adminportal") return pathname === "/adminportal";
    return pathname.startsWith(href);
  };
}

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
      <div style={{
        display: "flex", alignItems: "center", height: 48,
        borderBottom: `1px solid ${C.border}`, padding: "0 12px",
        justifyContent: collapsed ? "center" : "space-between",
      }}>
        {!collapsed ? (
          <Link href="/adminportal" style={{ display: "flex", alignItems: "center" }}>
            <BeyundLogo className="h-6" />
          </Link>
        ) : (
          <Link href="/adminportal" style={{
            width: 24, height: 24, borderRadius: 3, background: C.card,
            border: `1px solid ${C.border}`, display: "flex",
            alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            <img src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
              alt="Beyund" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted, display: "flex" }}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 16 }}>
            {!collapsed && (
              <p style={{
                fontSize: 9, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", color: C.dim, margin: "0 8px 6px",
                fontFamily: "'JetBrains Mono','SF Mono',monospace",
              }}>{group.label}</p>
            )}
            {group.items.map((item) => {
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
                  {!collapsed && <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span style={{
                      fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 2,
                      background: C.card, color: C.muted, border: `1px solid ${C.border}`,
                      fontFamily: "'JetBrains Mono','SF Mono',monospace",
                    }}>{item.badge}</span>
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

function MobileDrawer({ open, onClose, C }: { open: boolean; onClose: () => void; C: Colors }) {
  const isActive = useActiveRoute();
  const router = useRouter();
  const handleNav = (href: string) => { router.push(href); onClose(); };
  return (
    <>
      {open && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }} className="lg:hidden" onClick={onClose} />}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 51, width: 260,
        background: C.sidebarBg, borderRight: `1px solid ${C.border}`,
        transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s",
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
                      padding: "7px 8px", borderRadius: 3, border: "none", fontSize: 11,
                      fontWeight: 500, cursor: "pointer", textAlign: "left",
                      background: active ? C.sidebarActive : "transparent",
                      color: active ? C.text : C.muted, marginBottom: 2,
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

function MobileTabBar({ onMenuOpen, C }: { onMenuOpen: () => void; C: Colors }) {
  const isActive = useActiveRoute();
  const tabs = allNavItems.slice(0, 5);
  return (
    <nav
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, height: 56,
        paddingBottom: "env(safe-area-inset-bottom, 0)", background: C.sidebarBg,
        borderTop: `1px solid ${C.border}`, display: "none",
      }}
      className="lg:!hidden flex"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: "100%", padding: "0 4px", width: "100%" }}>
        {tabs.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "4px 4px", textDecoration: "none", minWidth: 0, flex: 1,
                color: active ? C.text : C.muted, fontSize: 9, fontWeight: 500,
              }}>
              {item.icon}
              <span style={{ fontSize: 9, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
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

function ProfileDropdown({ C, onClose, onRequestSignOut }: { C: Colors; onClose: () => void; onRequestSignOut: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { profileImage } = useProfile();
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      const email = session?.user?.email ?? "";
      setAdminEmail(email);
      const { data: settings } = await supabase
        .from("admin_settings").select("value").eq("key", "admin_name").maybeSingle();
      if (active) {
        if (settings?.value) setAdminName(settings.value);
        else {
          const p = email.split("@")[0] ?? "Admin";
          setAdminName(p.charAt(0).toUpperCase() + p.slice(1));
        }
      }
    }
    load();
    return () => { active = false; };
  }, [supabase]);

  const firstName = adminName ? adminName.split(" ")[0] : "Admin";
  const initials = (firstName.match(/\S/g) || ["A"]).slice(0, 2).join("").toUpperCase();

  const itemStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 10px", borderRadius: 5, border: "none",
    background: "transparent", color: C.text,
    fontSize: 12, fontWeight: 500, cursor: "pointer", width: "100%",
    textAlign: "left", textDecoration: "none",
  };

  const handleItemHover = (e: React.MouseEvent<HTMLElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? C.sidebarActive : "transparent";
  };

  return (
    <div
      role="menu"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute", top: "calc(100% + 6px)", right: 0,
        minWidth: 220, zIndex: 60, background: C.card,
        border: `1px solid ${C.border}`, borderRadius: 6, padding: 6,
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 8px 10px", borderBottom: `1px solid ${C.border}`, marginBottom: 6,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: theme === "dark" ? "#171717" : "#f1f5f9",
          border: `1px solid ${C.border}`, display: "flex",
          alignItems: "center", justifyContent: "center",
          color: C.muted, fontSize: 10, fontWeight: 700, flexShrink: 0, overflow: "hidden",
        }}>
          {profileImage ? (
            <img src={profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{firstName}</p>
          <p style={{ fontSize: 10, color: C.muted, margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminEmail}</p>
        </div>
      </div>

      <Link href="/adminportal/settings" onClick={onClose} style={itemStyle}
        onMouseEnter={(e) => handleItemHover(e, true)}
        onMouseLeave={(e) => handleItemHover(e, false)}>
        <Settings size={13} style={{ color: C.muted }} />
        <span>Settings</span>
      </Link>

      {/* Theme toggle — HIDDEN on mobile only (sm and up only) */}
      <button
        onClick={() => { toggleTheme(); onClose(); }}
                className="hidden sm:flex"
        style={Object.assign({}, itemStyle, { justifyContent: "space-between" })}
        onMouseEnter={(e) => handleItemHover(e, true)}
        onMouseLeave={(e) => handleItemHover(e, false)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </span>
        <span
          style={{
            position: "relative", width: 26, height: 14, borderRadius: 7,
            background: theme === "dark" ? "#0d9488" : "#cbd5e1", flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute", top: 2, width: 10, height: 10, borderRadius: "50%",
              background: "#fff", transition: "transform 0.2s",
              transform: theme === "dark" ? "translateX(14px)" : "translateX(2px)",
            }}
          />
        </span>
      </button>

      <div style={{ height: 1, background: C.border, margin: "4px 0" }} />

      <button
        onClick={() => { onClose(); onRequestSignOut(); }}
        style={Object.assign({}, itemStyle, { color: C.red })}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <LogOut size={13} />
        <span>Sign out</span>
      </button>
    </div>
  );
}

function SignOutOverlay({ C, onClose }: { C: Colors; onClose: () => void }) {
  const [signingOut, setSigningOut] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const handleSignOut = async () => {
    setSigningOut(true);
    // Small delay so the loader renders before signOut redirects
    await new Promise(r => setTimeout(r, 100));
    await supabase.auth.signOut();
    window.location.href = "/adminportal/login";
  };

  if (signingOut) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: C.bg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 24,
      }}>
        <div className="so-loader" style={{ width: 40, height: 40, position: "relative" }} />
        <p style={{
          fontSize: 13, fontWeight: 600, color: C.muted,
          fontFamily: "'Inter','SF Pro',system-ui,sans-serif",
          letterSpacing: "0.03em", margin: 0,
        }}>
          Logging out…
        </p>
        <style>{`
          .so-loader {
            --c: no-repeat linear-gradient(#25b09b 0 0);
            background:
              var(--c) center/100% 10px,
              var(--c) center/10px 100%;
          }
          .so-loader:before {
            content: '';
            position: absolute;
            inset: 0;
            background:
              var(--c) 0    0,
              var(--c) 100% 0,
              var(--c) 0    100%,
              var(--c) 100% 100%;
            background-size: 15.5px 15.5px;
            animation: so-l16 1.5s infinite cubic-bezier(0.3,1,0,1);
          }
          @keyframes so-l16 {
            33%  { inset: -10px; transform: rotate(0deg); }
            66%  { inset: -10px; transform: rotate(90deg); }
            100% { inset: 0;     transform: rotate(90deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, margin: 0,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "24px 28px",
          maxWidth: 320, width: "100%",
          boxShadow: "0 20px 48px rgba(0,0,0,0.45)",
          textAlign: "center",
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(239,68,68,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px",
        }}>
          <LogOut size={20} color={C.red} />
        </div>
        <p style={{
          fontSize: 15, fontWeight: 600, color: C.text,
          margin: "0 0 8px", fontFamily: "'Inter','SF Pro',system-ui,sans-serif",
        }}>
          Sign out?
        </p>
        <p style={{
          fontSize: 11.5, color: C.muted, margin: "0 0 20px",
          fontFamily: "'Inter','SF Pro',system-ui,sans-serif",
          lineHeight: 1.45, textAlign: "center",
        }}>
          You will be redirected to the login page. Any unsaved work may be lost.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 6,
              border: `1px solid ${C.border}`, background: "transparent",
              color: C.text, fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSignOut}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 6,
              border: "none", background: C.red,
              color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
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

function AdminTopbar({ onMobileMenuOpen, collapsed, C, onRequestSignOut }: { onMobileMenuOpen: () => void; collapsed: boolean; C: Colors; onRequestSignOut: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const refetchUnreadCount = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread")
        .in("category", ["student", "payment"]);
      if (count !== null) setUnreadCount(count);
    };

    refetchUnreadCount();

    const channel = supabase
      .channel("notifications-count")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => { refetchUnreadCount(); })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "notifications" }, () => { refetchUnreadCount(); })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "notifications" }, () => { refetchUnreadCount(); })
      .subscribe();

    const handleNotificationsUpdated = () => { setTimeout(refetchUnreadCount, 100); };
    window.addEventListener("notifications-updated", handleNotificationsUpdated);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("notifications-updated", handleNotificationsUpdated);
    };
  }, [supabase]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dropdownOpen]);

  const headerBg = C.bg;
  const headerBorder = theme === "dark" ? "#1f1f1f" : C.border;
  const iconBtnHover = theme === "dark" ? "#171717" : C.sidebarActive;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[120] h-12 lg:static lg:z-auto"
      data-header="mobile-fixed"
      style={{
        borderBottom: `1px solid ${headerBorder}`,
        background: headerBg,
        backdropFilter: "saturate(140%) blur(6px)",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "100%", padding: "0 12px", gap: 8,
        }}
        className="md:px-6 md:gap-5"
      >
        {/* Left cluster: hamburger (mobile) + search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }} className="md:gap-3">
          <button
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
            title="Open menu"
            className="lg:hidden"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: 6, color: C.muted, display: "flex",
              alignItems: "center", justifyContent: "center", borderRadius: 6,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = iconBtnHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Menu size={16} />
          </button>
          <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-[280px] md:max-w-[360px]">
            <GlobalSearch />
          </div>
        </div>

        {/* Right cluster: theme + bell + avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }} className="md:gap-3">
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
            className="hidden lg:flex items-center justify-center"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: 7, color: C.muted, borderRadius: 6,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = iconBtnHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link
            href="/adminportal/notifications"
            aria-label="Notifications"
            style={{
              position: "relative", background: "transparent", border: "none",
              cursor: "pointer", padding: 7, color: C.muted, display: "flex",
              alignItems: "center", justifyContent: "center", borderRadius: 6,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = iconBtnHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Bell size={15} />
            {unreadCount > 0 ? (
              <span style={{
                position: "absolute", top: 3, right: 3, minWidth: 13, height: 13,
                borderRadius: 7, background: C.red, color: "#fff",
                fontSize: 7, fontWeight: 700, fontFamily: "'JetBrains Mono','SF Mono',monospace",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 2px", lineHeight: 1,
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : (
              <span style={{ position: "absolute", top: 5, right: 5, width: 4, height: 4, borderRadius: "50%", background: C.dim }} />
            )}
          </Link>
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="Account"
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: theme === "dark" ? "#171717" : C.card,
                border: `1px solid ${dropdownOpen ? C.teal : headerBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.muted, fontSize: 10, fontWeight: 600,
                flexShrink: 0, cursor: "pointer", padding: 0,
                transition: "border-color 0.15s",
              }}
            >
              <HeaderAvatar />
            </button>
            {dropdownOpen && (
              <ProfileDropdown
                C={C}
                onClose={() => setDropdownOpen(false)}
                onRequestSignOut={() => { setDropdownOpen(false); onRequestSignOut(); }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createSupabaseBrowserClient();
  const { theme } = useTheme();
  const C = getColors(theme);
  const isLoginPage = pathname === "/adminportal/login";

  useEffect(() => {
    if (isLoginPage) { setLoading(false); return; }
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/adminportal/login");
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
        <AdminTopbar onMobileMenuOpen={() => setDrawerOpen(true)} collapsed={collapsed} C={C} onRequestSignOut={() => setSignOutOpen(true)} />
        <main style={{ flex: 1, overflow: "auto", width: "100%", paddingTop: 48 }} className="lg:pt-0">
          <div style={{ padding: "12px" }}>{children}</div>
        </main>
      </div>
      <MobileTabBar onMenuOpen={() => setDrawerOpen(true)} C={C} />

      {/* Sign-out overlay renders at root level, above everything */}
      {signOutOpen && <SignOutOverlay C={C} onClose={() => setSignOutOpen(false)} />}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <SearchOverlayProvider>
          <AdminLayoutInner>{children}</AdminLayoutInner>
          <SearchBackdrop />
        </SearchOverlayProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

function SearchBackdrop() {
  const { open } = useSearchOverlay();
  const { theme } = useTheme();
  if (!open) return null;
  return (
    <div
      className="fixed inset-x-0 top-12 bottom-0 sm:hidden"
      style={{
        zIndex: 100,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={() => {/* click handled by GlobalSearch close on outside */}}
    />
  );
}