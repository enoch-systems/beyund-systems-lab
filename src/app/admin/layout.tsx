"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  LogOut,
  Sun,
  Moon,
  Mail,
} from "lucide-react";

interface NavItem { label: string; href: string; icon: React.ReactNode; badge?: number | string; }

const navGroups: { label: string; items: NavItem[] }[] = [
  { label: "Core", items: [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Students", href: "/admin/students", icon: <Users size={18} /> },
  ]},
  { label: "Academic", items: [
    { label: "Courses", href: "/admin/courses", icon: <BookOpen size={18} /> },
  ]},
  { label: "Operations", items: [
    { label: "Payments", href: "/admin/payments", icon: <CreditCard size={18} /> },
    { label: "Notifications", href: "/admin/notifications", icon: <Bell size={18} /> },
  ]},
  { label: "System", items: [
    { label: "Email History", href: "/admin/email-history", icon: <Mail size={18} /> },
    { label: "Analytics", href: "#", icon: <BarChart3 size={18} />, badge: "Soon" },
    { label: "Certificates", href: "/admin/certificates", icon: <Award size={18} /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
  ]},
];

const allNavItems = navGroups.flatMap((g) => g.items);

function useActiveRoute() {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };
}

function DesktopSidebar({ collapsed, setCollapsed, onNavigate }: { collapsed: boolean; setCollapsed: (v: boolean) => void; onNavigate: () => void }) {
  const isActive = useActiveRoute();
  return (
    <aside 
      style={{
        position: "fixed", 
        top: 0, 
        left: 0, 
        bottom: 0, 
        zIndex: 30,
        background: "var(--color-sidebar-bg)",
        borderRight: "1px solid var(--color-border-default)",
        width: collapsed ? 72 : 256, 
        transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }} 
      className="hidden lg:flex lg:flex-col"
    >
      <div style={{
        display: "flex", 
        alignItems: "center", 
        height: 56,
        borderBottom: "1px solid var(--color-border-default)", 
        padding: collapsed ? "0 16px" : "0 20px",
        justifyContent: collapsed ? "center" : "space-between",
        gap: 12,
      }}>
        {!collapsed ? (
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 32, 
              height: 32, 
              borderRadius: 8, 
              background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <Image 
                src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
                alt="Beyund"
                width={32}
                height={32}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
                Beyund Labs
              </span>
              <span style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Academy
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/admin" style={{
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "1px solid var(--color-border-default)",
          }}>
            <Image 
              src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
              alt="Beyund"
              width={36}
              height={36}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Link>
        )}
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: "pointer", 
              padding: 6, 
              color: "var(--color-text-tertiary)", 
              display: "flex",
              borderRadius: 6,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-sidebar-hover)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-tertiary)";
            }}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>
      
      <nav style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 20 }}>
            {!collapsed && (
              <p style={{
                fontSize: 11, 
                fontWeight: 600, 
                textTransform: "uppercase",
                letterSpacing: "0.08em", 
                color: "var(--color-text-tertiary)", 
                margin: "0 8px 8px",
                padding: "0 8px",
              }}>
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  onClick={onNavigate}
                  style={{
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12,
                    padding: collapsed ? "10px 0" : "10px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 10, 
                    textDecoration: "none", 
                    fontSize: 13, 
                    fontWeight: 500,
                    background: active ? "var(--color-sidebar-active)" : "transparent",
                    color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                    marginBottom: 4, 
                    transition: "all 0.15s", 
                    cursor: "pointer",
                    position: "relative",
                  }}
                  title={collapsed ? item.label : undefined}
                  onMouseEnter={(e) => { 
                    if (!active) { 
                      e.currentTarget.style.background = "var(--color-sidebar-hover)";
                      e.currentTarget.style.color = "var(--color-text-primary)";
                    } 
                  }}
                  onMouseLeave={(e) => { 
                    if (!active) { 
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--color-text-secondary)";
                    } 
                  }}
                >
                  {active && (
                    <div style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: 20,
                      background: "var(--color-accent-teal)",
                      borderRadius: "0 2px 2px 0",
                    }} />
                  )}
                  <span style={{ 
                    display: "flex", 
                    flexShrink: 0,
                    color: active ? "var(--color-accent-teal)" : "var(--color-text-tertiary)",
                  }}>
                    {item.icon}
                  </span>
                  {!collapsed && <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span style={{
                      fontSize: 10, 
                      fontWeight: 600, 
                      padding: "2px 8px", 
                      borderRadius: 6,
                      background: "var(--color-bg-tertiary)", 
                      color: "var(--color-text-tertiary)", 
                      border: "1px solid var(--color-border-default)",
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

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isActive = useActiveRoute();
  const router = useRouter();
  const handleNav = (href: string) => { router.push(href); onClose(); };
  return (
    <>
      {open && <div 
        style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.5)", 
          backdropFilter: "blur(4px)",
          zIndex: 50 
        }} 
        className="lg:hidden" 
        onClick={onClose} 
      />}
      <div style={{
        position: "fixed", 
        top: 0, 
        left: 0, 
        bottom: 0, 
        zIndex: 51, 
        width: 280,
        background: "var(--color-sidebar-bg)",
        borderRight: "1px solid var(--color-border-default)",
        transform: open ? "translateX(0)" : "translateX(-100%)", 
        transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
      }} className="lg:hidden">
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          height: 56, 
          padding: "0 20px", 
          borderBottom: "1px solid var(--color-border-default)" 
        }}>
          <Link href="/admin" style={{ 
            fontWeight: 700, 
            color: "var(--color-text-primary)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <div style={{
              width: 28, 
              height: 28, 
              borderRadius: 7, 
              background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}>
              <Image 
                src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
                alt="Beyund"
                width={28}
                height={28}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Beyund Labs</span>
          </Link>
          <button 
            onClick={onClose} 
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: "pointer", 
              padding: 8, 
              color: "var(--color-text-tertiary)", 
              display: "flex",
              borderRadius: 8,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-sidebar-hover)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-tertiary)";
            }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 20 }}>
              <p style={{ 
                fontSize: 11, 
                fontWeight: 600, 
                textTransform: "uppercase", 
                letterSpacing: "0.08em", 
                color: "var(--color-text-tertiary)", 
                margin: "0 8px 8px",
                padding: "0 8px",
              }}>
                {group.label}
              </p>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <button 
                    key={item.href} 
                    onClick={() => handleNav(item.href)}
                    style={{
                      display: "flex", 
                      alignItems: "center", 
                      gap: 12, 
                      width: "100%",
                      padding: "10px 12px", 
                      borderRadius: 10, 
                      border: "none", 
                      fontSize: 13,
                      fontWeight: 500, 
                      cursor: "pointer", 
                      textAlign: "left",
                      background: active ? "var(--color-sidebar-active)" : "transparent",
                      color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)", 
                      marginBottom: 4,
                      transition: "all 0.15s",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => { 
                      if (!active) { 
                        e.currentTarget.style.background = "var(--color-sidebar-hover)";
                        e.currentTarget.style.color = "var(--color-text-primary)";
                      } 
                    }}
                    onMouseLeave={(e) => { 
                      if (!active) { 
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--color-text-secondary)";
                      } 
                    }}
                  >
                    {active && (
                      <div style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: 20,
                        background: "var(--color-accent-teal)",
                        borderRadius: "0 2px 2px 0",
                      }} />
                    )}
                    <span style={{ 
                      display: "flex", 
                      flexShrink: 0,
                      color: active ? "var(--color-accent-teal)" : "var(--color-text-tertiary)",
                    }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ 
                        fontSize: 10, 
                        fontWeight: 600, 
                        padding: "2px 8px", 
                        borderRadius: 6, 
                        background: "var(--color-bg-tertiary)", 
                        color: "var(--color-text-tertiary)", 
                        border: "1px solid var(--color-border-default)",
                      }}>
                        {item.badge}
                      </span>
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

function MobileTabBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const isActive = useActiveRoute();
  const tabs = allNavItems.slice(0, 5);
  return (
    <nav
      style={{
        position: "fixed", 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 40, 
        height: 64,
        paddingBottom: "env(safe-area-inset-bottom, 0)", 
        background: "var(--color-sidebar-bg)",
        borderTop: "1px solid var(--color-border-default)", 
        display: "none",
      }}
      className="lg:!hidden flex"
    >
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-around", 
        height: "100%", 
        padding: "0 4px", 
        width: "100%" 
      }}>
        {tabs.map((item) => {
          const active = isActive(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              style={{
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                gap: 4,
                padding: "6px 8px", 
                textDecoration: "none", 
                minWidth: 0, 
                flex: 1,
                color: active ? "var(--color-accent-teal)" : "var(--color-text-tertiary)", 
                fontSize: 10, 
                fontWeight: 500,
                transition: "all 0.15s",
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? "var(--color-sidebar-active)" : "transparent",
                transition: "all 0.15s",
              }}>
                {item.icon}
              </div>
              <span style={{ 
                fontSize: 10, 
                maxWidth: "100%", 
                overflow: "hidden", 
                textOverflow: "ellipsis", 
                whiteSpace: "nowrap" 
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
        <button 
          onClick={onMenuOpen}
          style={{
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: 4,
            padding: "6px 8px", 
            background: "transparent", 
            border: "none", 
            cursor: "pointer",
            color: "var(--color-text-tertiary)", 
            flex: 1,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-tertiary)";
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Menu size={18} />
          </div>
          <span style={{ fontSize: 10 }}>More</span>
        </button>
      </div>
    </nav>
  );
}

function ProfileDropdown({ onClose, onRequestSignOut }: { onClose: () => void; onRequestSignOut: () => void }) {
  const itemStyle: React.CSSProperties = {
    display: "flex", 
    alignItems: "center", 
    gap: 10,
    padding: "10px 12px", 
    borderRadius: 8, 
    border: "none",
    background: "transparent", 
    color: "var(--color-text-primary)",
    fontSize: 13, 
    fontWeight: 500, 
    cursor: "pointer", 
    width: "100%",
    textAlign: "left", 
    textDecoration: "none",
    transition: "all 0.15s",
  };

  return (
    <div
      role="menu"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute", 
        top: "calc(100% + 8px)", 
        right: 0,
        minWidth: 240, 
        zIndex: 60, 
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-default)", 
        borderRadius: 12, 
        padding: 6,
        boxShadow: "var(--shadow-xl)",
      }}
    >
      <div style={{
        display: "flex", 
        alignItems: "center", 
        gap: 10,
        padding: "12px 12px 14px", 
        borderBottom: "1px solid var(--color-border-default)", 
        marginBottom: 6,
      }}>
        <div style={{
          width: 36, 
          height: 36, 
          borderRadius: "50%",
          background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
          border: "2px solid var(--color-border-default)", 
          display: "flex",
          alignItems: "center", 
          justifyContent: "center",
          color: "#ffffff", 
          fontSize: 12, 
          fontWeight: 700, 
          flexShrink: 0,
        }}>
          A
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ 
            fontSize: 13, 
            fontWeight: 600, 
            color: "var(--color-text-primary)", 
            margin: 0, 
            overflow: "hidden", 
            textOverflow: "ellipsis", 
            whiteSpace: "nowrap" 
          }}>
            Admin
          </p>
          <p style={{ 
            fontSize: 11, 
            color: "var(--color-text-tertiary)", 
            margin: "2px 0 0", 
            overflow: "hidden", 
            textOverflow: "ellipsis", 
            whiteSpace: "nowrap" 
          }}>
            admin@beyund.com
          </p>
        </div>
      </div>

      <Link 
        href="/admin/settings" 
        onClick={onClose} 
        style={itemStyle}
        onMouseEnter={(e) => { 
          e.currentTarget.style.background = "var(--color-sidebar-hover)";
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.background = "transparent";
        }}
      >
        <Settings size={16} style={{ color: "var(--color-text-tertiary)" }} />
        <span>Settings</span>
      </Link>

      <div style={{ height: 1, background: "var(--color-border-default)", margin: "4px 0" }} />

      <button
        onClick={() => { onClose(); onRequestSignOut(); }}
        style={{ 
          ...itemStyle, 
          color: "var(--color-status-error)",
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.background = "var(--color-status-error-light)";
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.background = "transparent";
        }}
      >
        <LogOut size={16} />
        <span>Sign out</span>
      </button>
    </div>
  );
}

function SignOutOverlay({ onClose }: { onClose: () => void }) {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setSigningOut(true);
    await new Promise((r) => setTimeout(r, 100));
    window.location.href = "/admin/login";
  };

  if (signingOut) {
    return (
      <div style={{
        position: "fixed", 
        inset: 0, 
        zIndex: 99999,
        background: "var(--color-bg-primary)",
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center", 
        gap: 20,
      }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 10,
          background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
          animation: "spin 1s linear infinite",
        }} />
        <p style={{
          fontSize: 13, 
          fontWeight: 600, 
          color: "var(--color-text-secondary)",
          letterSpacing: "0.02em", 
          margin: 0,
        }}>
          Logging out…
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed", 
        inset: 0, 
        zIndex: 99999,
        background: "rgba(0,0,0,0.6)", 
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        padding: 16, 
        margin: 0,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-bg-elevated)", 
          border: "1px solid var(--color-border-default)",
          borderRadius: 16, 
          padding: "28px 32px",
          maxWidth: 360, 
          width: "100%",
          boxShadow: "var(--shadow-xl)",
          textAlign: "center",
        }}
      >
        <div style={{
          width: 48, 
          height: 48, 
          borderRadius: "50%",
          background: "var(--color-status-error-light)",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <LogOut size={22} style={{ color: "var(--color-status-error)" }} />
        </div>
        <p style={{
          fontSize: 17, 
          fontWeight: 600, 
          color: "var(--color-text-primary)",
          margin: "0 0 10px",
        }}>
          Sign out?
        </p>
        <p style={{
          fontSize: 13, 
          color: "var(--color-text-secondary)", 
          margin: "0 0 24px",
          lineHeight: 1.6, 
          textAlign: "center",
        }}>
          You will be redirected to the login page. Any unsaved work may be lost.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button 
            onClick={onClose} 
            style={{
              flex: 1, 
              padding: "11px 0", 
              borderRadius: 10,
              border: "1px solid var(--color-border-default)", 
              background: "transparent",
              color: "var(--color-text-primary)", 
              fontSize: 13, 
              fontWeight: 500, 
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-sidebar-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSignOut} 
            style={{
              flex: 1, 
              padding: "11px 0", 
              borderRadius: 10,
              border: "none", 
              background: "var(--color-status-error)",
              color: "#ffffff", 
              fontSize: 13, 
              fontWeight: 600, 
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
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
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--color-text-tertiary)" }}>
      <circle cx="12" cy="8" r="4" />
      <path d="M12 13c-4.418 0-8 2.686-8 6v1h16v-1c0-3.314-3.582-6-8-6z" />
    </svg>
  );
}

function AdminTopbar({ onMobileMenuOpen, collapsed, onRequestSignOut }: { onMobileMenuOpen: () => void; collapsed: boolean; onRequestSignOut: () => void }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setUnreadCount(0); }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setDropdownOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dropdownOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[120] h-16"
      data-header="mobile-fixed"
      data-collapsed={collapsed ? "true" : "false"}
      style={{
        borderBottom: "1px solid var(--color-border-default)",
        background: "var(--color-bg-primary)",
        backdropFilter: "saturate(140%) blur(12px)",
        WebkitBackdropFilter: "saturate(140%) blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          height: "100%", 
          padding: "0 16px", 
          gap: 12,
        }}
        className="md:px-6 md:gap-4"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }} className="md:gap-3">
          <button
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
            title="Open menu"
            className="lg:hidden flex items-center justify-center"
            style={{
              background: "transparent", 
              border: "none", 
              cursor: "pointer",
              padding: 8, 
              color: "var(--color-text-secondary)", 
              borderRadius: 8, 
              flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-sidebar-hover)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <Menu size={20} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }} className="md:gap-3">
          <Link
            href="/admin/notifications"
            aria-label="Notifications"
            style={{
              position: "relative", 
              background: "transparent", 
              border: "none",
              cursor: "pointer", 
              padding: 8, 
              color: "var(--color-text-secondary)", 
              display: "flex",
              alignItems: "center", 
              justifyContent: "center", 
              borderRadius: 8,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-sidebar-hover)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 ? (
              <span style={{
                position: "absolute", 
                top: 4, 
                right: 4, 
                minWidth: 18, 
                height: 18,
                borderRadius: 9, 
                background: "var(--color-status-error)", 
                color: "#ffffff",
                fontSize: 10, 
                fontWeight: 700, 
                display: "flex",
                alignItems: "center", 
                justifyContent: "center",
                padding: "0 5px", 
                lineHeight: 1,
                border: "2px solid var(--color-bg-primary)",
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : (
              <span style={{ 
                position: "absolute", 
                top: 6, 
                right: 6, 
                width: 6, 
                height: 6, 
                borderRadius: "50%", 
                background: "var(--color-text-disabled)",
                border: "1.5px solid var(--color-bg-primary)",
              }} />
            )}
          </Link>
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="Account"
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
              style={{
                width: 36, 
                height: 36, 
                borderRadius: "50%",
                background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                border: dropdownOpen ? "2px solid var(--color-accent-teal)" : "2px solid var(--color-border-default)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "#ffffff", 
                fontSize: 12, 
                fontWeight: 600,
                flexShrink: 0, 
                cursor: "pointer", 
                padding: 0,
                transition: "all 0.15s",
              }}
            >
              <HeaderAvatar />
            </button>
            {dropdownOpen && (
              <ProfileDropdown
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  if (isLoginPage) {
    return <div style={{ background: "var(--color-bg-primary)", minHeight: "100vh" }}>{children}</div>;
  }

  if (signOutOpen) {
    return <SignOutOverlay onClose={() => setSignOutOpen(false)} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}>
      <DesktopSidebar collapsed={collapsed} setCollapsed={setCollapsed} onNavigate={() => {}} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div
        style={{
          display: "flex", 
          flexDirection: "column", 
          minWidth: 0,
          transition: "margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)", 
          marginLeft: 0, 
          paddingBottom: 72,
        }}
        className="lg:pb-0"
        data-collapsed={collapsed ? "true" : "false"}
      >
        <style>{`
          @media (min-width: 1024px) {
            [data-collapsed="true"] { margin-left: 72px !important; }
            [data-collapsed="false"] { margin-left: 256px !important; }
          }
        `}</style>
        <AdminTopbar onMobileMenuOpen={() => setDrawerOpen(true)} collapsed={collapsed} onRequestSignOut={() => setSignOutOpen(true)} />
        <main style={{ 
          flex: 1, 
          overflow: "auto", 
          width: "100%", 
          paddingTop: 64,
          paddingLeft: 16,
          paddingRight: 16,
        }} className="lg:pt-0 lg:px-6">
          <div style={{ 
            padding: "16px 0",
            maxWidth: 1400,
            margin: "0 auto",
            width: "100%",
          }}>
            {children}
          </div>
        </main>
      </div>
      <MobileTabBar onMenuOpen={() => setDrawerOpen(true)} />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuardWrapper loadingFallback={<AdminLoadingSpinner />}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthGuardWrapper>
  );
}

function AuthGuardWrapper({ children, loadingFallback }: { children: React.ReactNode; loadingFallback: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <AuthGuard loadingFallback={loadingFallback}>{children}</AuthGuard>;
}

function AuthGuard({ children, loadingFallback }: any) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 0); }, []);
  if (!ready) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg-primary)" }}>{loadingFallback}</div>;
  return <>{children}</>;
}

function AdminLoadingSpinner() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "var(--color-bg-primary)",
      flexDirection: "column",
      gap: 16,
    }}>
      <div style={{ 
        width: 40, 
        height: 40, 
        borderRadius: 10,
        background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
        animation: "spin 1s linear infinite",
      }} />
      <p style={{
        fontSize: 13, 
        fontWeight: 500, 
        color: "var(--color-text-secondary)",
        letterSpacing: "0.02em",
      }}>
        Loading dashboard…
      </p>
    </div>
  );
}