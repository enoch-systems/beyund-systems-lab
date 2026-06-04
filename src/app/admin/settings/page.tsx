"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useTheme } from "@/lib/theme-context";
import { useProfile } from "@/lib/profile-context";
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
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { profileImage, setProfileImage } = useProfile();
  const supabase = createSupabaseBrowserClient();

  // Load settings from Supabase
  useEffect(() => {
    async function loadSettings() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setAdminEmail(session.user.email ?? "");

      // Load saved settings
      const { data: settings } = await supabase
        .from("admin_settings")
        .select("key, value");

      if (settings) {
        const settingsMap = Object.fromEntries(
          settings.map((s) => [s.key, s.value])
        );

        if (settingsMap.admin_name) setAdminName(settingsMap.admin_name);
        else {
          const emailPrefix = session.user.email?.split("@")[0] ?? "Admin";
          setAdminName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
        }

        if (settingsMap.profile_image) setProfileImage(settingsMap.profile_image);
      } else {
        const emailPrefix = session.user.email?.split("@")[0] ?? "Admin";
        setAdminName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
      }
    }
    loadSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save settings to Supabase
  const handleSave = async () => {
    setSaving(true);

    const userId = (await supabase.auth.getSession()).data.session?.user?.id;
    const now = new Date().toISOString();

    const settingsToSave = [
      { key: "admin_name", value: adminName, updated_at: now, updated_by: userId },
    ];

    if (profileImage) {
      settingsToSave.push({ key: "profile_image", value: profileImage, updated_at: now, updated_by: userId });
    }

    for (const setting of settingsToSave) {
      await supabase.from("admin_settings").upsert(setting, { onConflict: "key" });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordReset = async () => {
    if (!adminEmail) return;
    setResetting(true);
    await supabase.auth.resetPasswordForEmail(adminEmail, {
      redirectTo: `${window.location.origin}/admin/login`,
    });
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
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <div className="w-full space-y-5">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-[13px] font-semibold text-neutral-900 dark:text-white tracking-[-0.02em]">
          Settings
        </h1>
        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
          Manage your admin profile and dashboard preferences.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Admin Profile Card ── */}
        <div className="rounded-[14px] border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#1c1c1e] p-5 lg:row-span-2">
          <div className="mb-4">
            <h2 className="text-[13px] font-semibold text-neutral-900 dark:text-white">
              Admin Profile
            </h2>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
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
          <div className="flex items-center gap-3 mb-4">
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
                  className="w-14 h-14 rounded-full object-cover border-2 border-neutral-200/60 dark:border-neutral-800/60"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-neutral-50 dark:bg-neutral-800/60 border-2 border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-center overflow-hidden">
                  <Camera className="w-5 h-5 text-neutral-400" />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center border-2 border-white dark:border-[#1c1c1e] shadow-sm">
                <Pencil className="w-2.5 h-2.5 text-white dark:text-neutral-900" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium text-neutral-900 dark:text-white">
                Profile Photo
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Click to upload a profile photo
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-900 dark:text-white mb-1">
                Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full h-[36px] px-3 rounded-[8px] bg-white dark:bg-[#1c1c1e] border border-neutral-200/80 dark:border-neutral-800 text-[12px] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 dark:focus:ring-white/10 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-900 dark:text-white mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  value={adminEmail}
                  disabled
                  className="w-full h-[36px] pl-9 pr-3 rounded-[8px] bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 text-[12px] text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                Email cannot be changed here
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 h-[34px] px-4 rounded-[8px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer"
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
        <div className="rounded-[14px] border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#1c1c1e] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-[10px] bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-center">
              <Lock className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <h2 className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                Password
              </h2>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Reset your password
              </p>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
            A password reset link will be sent to your email address.
          </p>
          <button
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 h-[32px] px-3.5 rounded-[8px] border border-neutral-200 dark:border-neutral-700 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            Reset Password
          </button>
        </div>

        {/* ── Appearance Card ── */}
        <div className="rounded-[14px] border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#1c1c1e] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-[10px] bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-center">
              <Palette className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                Appearance
              </h2>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Customize your view
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-[10px] bg-neutral-50 dark:bg-neutral-800/60">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-neutral-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <div>
                <p className="text-[11px] font-medium text-neutral-900 dark:text-white">
                  Theme
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  {theme === "dark" ? "Dark mode" : "Light mode"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-12 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors cursor-pointer"
            >
              <div
                className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white dark:bg-neutral-900 shadow transition-transform duration-200 ${
                  theme === "dark" ? "translate-x-[25px]" : "translate-x-[3px]"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Account Card ── */}
        <div className="rounded-[14px] border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#1c1c1e] p-5 lg:col-span-1">
          <div className="mb-3">
            <h2 className="text-[13px] font-semibold text-neutral-900 dark:text-white">
              Account
            </h2>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
              Sign out from your admin account
            </p>
          </div>

          <div className="p-3 rounded-[10px] bg-neutral-50 dark:bg-neutral-800/60">
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2.5">
              Sign out from your admin account. You will need to sign in again.
            </p>
            <button
              onClick={() => setShowSignOutModal(true)}
              className="inline-flex items-center gap-1.5 h-[32px] px-3.5 rounded-[8px] border border-red-500/20 text-[11px] font-medium text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setShowResetModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-sm bg-white dark:bg-[#1c1c1e] rounded-[20px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-[#e5e5ea]/60 dark:border-[#38383a]/60 overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#ff9f0a]/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-[#ff9f0a]" />
                </div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.01em]">
                  Reset Password?
                </h3>
                <p className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-2 max-w-[280px]">
                  A reset link will be sent to{" "}
                  <span className="font-medium text-[#1d1d1f] dark:text-white">{adminEmail}</span>.
                  You will need to use the new password to sign back in.
                </p>
              </div>
              <div className="flex items-center gap-2.5 p-6 pt-5">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 h-[40px] rounded-[10px] text-[13px] font-medium text-[#86868b] dark:text-[#98989d] bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  disabled={resetting}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-[40px] rounded-[10px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setShowSignOutModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-sm bg-white dark:bg-[#1c1c1e] rounded-[20px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-[#e5e5ea]/60 dark:border-[#38383a]/60 overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#ff453a]/10 flex items-center justify-center mb-4">
                  <LogOut className="w-6 h-6 text-[#ff453a]" />
                </div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.01em]">
                  Sign Out?
                </h3>
                <p className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-2 max-w-[280px]">
                  You will be signed out of your admin account. You will need to sign in again to access the dashboard.
                </p>
              </div>
              <div className="flex items-center gap-2.5 p-6 pt-5">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 h-[40px] rounded-[10px] text-[13px] font-medium text-[#86868b] dark:text-[#98989d] bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#38383a] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-[40px] rounded-[10px] bg-[#ff453a] text-white text-[13px] font-semibold hover:bg-[#e53e36] transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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