"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/app/providers";
import {
  Lock,
  Sun,
  Moon,
  LogOut,
  Loader2,
  Check,
  Mail,
  RotateCcw,
  Shield,
  Palette,
  Camera,
  Pencil,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("admin@beyund.com");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Load settings (stubbed)
  useEffect(() => {
    setAdminName("Admin");
    setAdminEmail("admin@beyund.com");
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordReset = async () => {
    if (!adminEmail) return;
    setResetting(true);
    await new Promise((r) => setTimeout(r, 400));
    setResetting(false);
    setShowResetModal(false);
    alert("Password reset email sent. Check your inbox.");
  };

  const handleImageClick = () => {
    document.getElementById("profile-image-input")?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await new Promise((r) => setTimeout(r, 200));
    window.location.href = "/admin/login";
  };

  return (
    <div className="w-full space-y-5">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          Settings
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
          Manage your admin profile and dashboard preferences.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Admin Profile Card ── */}
        <div className="rounded-2xl border p-5 lg:row-span-2" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
          <div className="mb-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Admin Profile
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              Your account information
            </p>
          </div>

          {/* Profile Image */}
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex items-center gap-3 mb-4 rounded-xl border p-3" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
            <div
              role="button"
              tabIndex={0}
              onClick={handleImageClick}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleImageClick(); }}
              className="relative w-14 h-14 shrink-0 cursor-pointer"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover"
                  style={{ border: "2px solid var(--color-border-default)" }}
                />
              ) : (
                <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden" style={{ background: "var(--color-bg-secondary)", border: "2px solid var(--color-border-default)" }}>
                  <Camera className="w-5 h-5" style={{ color: "var(--color-text-tertiary)" }} />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--color-text-primary)", border: "2px solid var(--color-bg-elevated)" }}>
                <Pencil className="w-2.5 h-2.5" style={{ color: "var(--color-bg-elevated)" }} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                Profile Photo
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                Click to upload a profile photo
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border p-3" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-xs transition-all"
                style={{
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border-default)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--color-text-tertiary)" }} />
                <input
                  type="email"
                  value={adminEmail}
                  disabled
                  className="w-full h-9 pl-9 pr-3 rounded-lg text-xs cursor-not-allowed"
                  style={{
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border-default)",
                    color: "var(--color-text-tertiary)",
                  }}
                />
              </div>
              <p className="text-[11px] mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                Email cannot be changed here
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              style={{
                background: "var(--color-accent-teal)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>

        {/* ── Password Card ── */}
        <div className="rounded-2xl border p-5" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg border flex items-center justify-center" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-secondary)" }}>
              <Lock className="w-4 h-4" style={{ color: "var(--color-text-tertiary)" }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Password
              </h2>
              <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                Reset your password
              </p>
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--color-text-secondary)" }}>
            A password reset link will be sent to your email address.
          </p>
          <button
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border text-xs font-medium transition-all cursor-pointer"
            style={{
              borderColor: "var(--color-border-default)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--color-border-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--color-border-default)";
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            Reset Password
          </button>
        </div>

        {/* ── Appearance Card ── */}
        <div className="rounded-2xl border p-5" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg border flex items-center justify-center" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-secondary)" }}>
              <Palette className="w-4 h-4" style={{ color: "#f59e0b" }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Appearance
              </h2>
              <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                Customize your view
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-4 h-4" style={{ color: "var(--color-text-tertiary)" }} />
              ) : (
                <Sun className="w-4 h-4" style={{ color: "#f59e0b" }} />
              )}
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                  Theme
                </p>
                <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
                  {theme === "dark" ? "Dark mode" : "Light mode"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-12 h-7 rounded-full transition-colors"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <div
                className="absolute top-[3px] w-[22px] h-[22px] rounded-full shadow transition-transform duration-200"
                style={{
                  background: "var(--color-bg-elevated)",
                  transform: theme === "dark" ? "translateX(25px)" : "translateX(3px)",
                }}
              />
            </button>
          </div>
        </div>

        {/* ── Account Card ── */}
        <div className="rounded-2xl border p-5" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
          <div className="mb-3">
            <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Account
            </h2>
            <p className="text-[11px]" style={{ color: "var(--color-text-tertiary)" }}>
              Sign out from your admin account
            </p>
          </div>

          <div className="p-3 rounded-xl border" style={{ borderColor: "var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
            <p className="text-xs mb-2.5" style={{ color: "var(--color-text-secondary)" }}>
              Sign out from your admin account. You will need to sign in again.
            </p>
            <button
              onClick={() => setShowSignOutModal(true)}
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border text-xs font-medium transition-all cursor-pointer"
              style={{
                borderColor: "rgba(239, 68, 68, 0.3)",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* PASSWORD RESET MODAL */}
      {showResetModal && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowResetModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-sm rounded-2xl border overflow-hidden"
              style={{
                background: "var(--color-bg-elevated)",
                borderColor: "var(--color-border-default)",
                boxShadow: "var(--shadow-xl)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: "#f59e0b" }} />
                </div>
                <h3 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Reset Password?
                </h3>
                <p className="text-xs mt-2 max-w-[280px]" style={{ color: "var(--color-text-secondary)" }}>
                  A reset link will be sent to <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>{adminEmail}</span>.
                  You will need to use the new password to sign back in.
                </p>
              </div>
              <div className="flex items-center gap-2.5 p-6 pt-5">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 h-10 rounded-xl text-xs font-medium transition-colors"
                  style={{
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border-default)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-bg-tertiary)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-bg-secondary)"}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  disabled={resetting}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "var(--color-text-primary)",
                    color: "var(--color-bg-elevated)",
                  }}
                >
                  {resetting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SIGN OUT MODAL */}
      {showSignOutModal && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowSignOutModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-sm rounded-2xl border overflow-hidden"
              style={{
                background: "var(--color-bg-elevated)",
                borderColor: "var(--color-border-default)",
                boxShadow: "var(--shadow-xl)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
                  <LogOut className="w-6 h-6" style={{ color: "#ef4444" }} />
                </div>
                <h3 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Sign Out?
                </h3>
                <p className="text-xs mt-2 max-w-[280px]" style={{ color: "var(--color-text-secondary)" }}>
                  You will be signed out of your admin account. You will need to sign in again to access the dashboard.
                </p>
              </div>
              <div className="flex items-center gap-2.5 p-6 pt-5">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 h-10 rounded-xl text-xs font-medium transition-colors"
                  style={{
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border-default)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-bg-tertiary)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-bg-secondary)"}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                  }}
                >
                  {signingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}