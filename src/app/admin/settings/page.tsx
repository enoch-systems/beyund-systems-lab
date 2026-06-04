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
    <div className="w-full space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-[20px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em]">
          Settings
        </h1>
        <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-0.5">
          Manage your admin profile and dashboard preferences.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Admin Profile Card ── */}
        <div className="rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] p-6 lg:row-span-2">
          <div className="mb-6">
            <h2 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-white">
              Admin Profile
            </h2>
            <p className="text-[12px] text-[#86868b] dark:text-[#98989d]">
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
          <div className="flex items-center gap-4 mb-6">
            <div
              role="button"
              tabIndex={0}
              onClick={handleImageClick}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleImageClick(); }}
              className="relative w-16 h-16 shrink-0 cursor-pointer"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#e5e5ea] dark:border-[#38383a]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] border-2 border-[#e5e5ea] dark:border-[#38383a] flex items-center justify-center overflow-hidden">
                  <Camera className="w-6 h-6 text-[#86868b] dark:text-[#98989d]" />
                </div>
              )}
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
              className="inline-flex items-center gap-2 h-[40px] px-5 rounded-[10px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer"
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
              <Lock className="w-5 h-5 text-[#86868b] dark:text-[#98989d]" />
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
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[10px] border border-[#e5e5ea] dark:border-[#38383a] text-[13px] font-medium text-[#1d1d1f] dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-all cursor-pointer"
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
              className="relative w-12 h-7 rounded-full bg-[#e5e5ea] dark:bg-[#4a4a4c] transition-colors cursor-pointer"
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
              onClick={() => setShowSignOutModal(true)}
              className="inline-flex items-center gap-2 h-[38px] px-4 rounded-[10px] border border-[#ff453a]/20 text-[13px] font-medium text-[#ff453a] hover:bg-[#ff453a]/8 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
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