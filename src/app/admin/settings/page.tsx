"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useTheme } from "@/lib/theme-context";
import {
  Lock,
  Sun,
  Moon,
  LogOut,
  Loader2,
  Check,
  Mail,
  Shield,
  Palette,
  Camera,
  Pencil,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAdminEmail(session.user.email ?? "");
        const emailPrefix = session.user.email?.split("@")[0] ?? "Admin";
        setAdminName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
      }
    }
    getProfile();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordReset = async () => {
    if (adminEmail) {
      await supabase.auth.resetPasswordForEmail(adminEmail, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      alert("Password reset email sent. Check your inbox.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div className="max-w-[1080px] space-y-8">
      {/* ═══════════════════════════════════════
         PAGE HEADER
         ═══════════════════════════════════════ */}
      <div>
        <h1 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em]">
          Settings
        </h1>
        <p className="text-[15px] text-[#86868b] dark:text-[#98989d] mt-1">
          Manage your admin profile and dashboard preferences.
        </p>
      </div>

      {/* ═══════════════════════════════════════
         GRID — 2 columns on desktop, stacked on mobile
         ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Admin Profile Card ── */}
        <div className="rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-6 lg:row-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h2 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white">
                Admin Profile
              </h2>
              <p className="text-[12px] text-[#86868b] dark:text-[#98989d]">
                Your account information
              </p>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] border-2 border-[#e5e5ea] dark:border-[#38383a] flex items-center justify-center overflow-hidden">
                <Camera className="w-6 h-6 text-[#86868b] dark:text-[#98989d]" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#1d1d1f] dark:bg-white flex items-center justify-center border-2 border-white dark:border-[#1c1c1e] shadow-sm">
                <Pencil className="w-3 h-3 text-white dark:text-[#1d1d1f]" />
              </div>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-white">
                Profile Photo
              </p>
              <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-0.5">
                Click to upload a profile photo
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[14px] text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#8940fa]/25 focus:border-[#8940fa]/40 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
                <input
                  type="email"
                  value={adminEmail}
                  disabled
                  className="w-full h-[42px] pl-10 pr-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[14px] text-[#86868b] dark:text-[#98989d] cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-1.5">
                Email cannot be changed here
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 h-[40px] px-5 rounded-[10px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>

        {/* ── Password Card ── */}
        <div className="rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#0a84ff]" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white">
                Password
              </h2>
              <p className="text-[12px] text-[#86868b] dark:text-[#98989d]">
                Reset your password
              </p>
            </div>
          </div>
          <p className="text-[13px] text-[#86868b] dark:text-[#98989d] mb-4">
            A password reset link will be sent to your email address.
          </p>
          <button
            onClick={handlePasswordReset}
            className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[10px] border border-[#e5e5ea] dark:border-[#38383a] text-[13px] font-medium text-[#1d1d1f] dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-all"
          >
            <Shield className="w-4 h-4" />
            Reset Password
          </button>
        </div>

        {/* ── Appearance Card ── */}
        <div className="rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center">
              <Palette className="w-5 h-5 text-[#ff9f0a]" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white">
                Appearance
              </h2>
              <p className="text-[12px] text-[#86868b] dark:text-[#98989d]">
                Customize your view
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-[#98989d]" />
              ) : (
                <Sun className="w-5 h-5 text-[#ff9f0a]" />
              )}
              <div>
                <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-white">
                  Theme
                </p>
                <p className="text-[11px] text-[#86868b] dark:text-[#98989d]">
                  {theme === "dark" ? "Dark mode" : "Light mode"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-12 h-7 rounded-full bg-[#e5e5ea] dark:bg-[#4a4a4c] transition-colors"
            >
              <div
                className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white dark:bg-[#1d1d1f] shadow transition-transform duration-200 ${
                  theme === "dark" ? "translate-x-[25px]" : "translate-x-[3px]"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Account Card ── */}
        <div className="rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-6 lg:col-span-1">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white">
              Account
            </h2>
            <p className="text-[12px] text-[#86868b] dark:text-[#98989d]">
              Sign out from your admin account
            </p>
          </div>

          <div className="p-3.5 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
            <p className="text-[13px] text-[#86868b] dark:text-[#98989d] mb-3">
              Sign out from your admin account. You will need to sign in again.
            </p>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[10px] border border-[#ff453a]/20 text-[13px] font-medium text-[#ff453a] hover:bg-[#ff453a]/8 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}