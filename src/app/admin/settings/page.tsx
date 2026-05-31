"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useTheme } from "@/lib/theme-context";

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
        // Use email prefix as default name
        const emailPrefix = session.user.email?.split("@")[0] ?? "Admin";
        setAdminName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
      }
    }
    getProfile();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
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

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage your admin profile and dashboard preferences.
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-6">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Admin Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Name</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Email</label>
            <input
              type="email"
              value={adminEmail}
              disabled
              className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-500 text-sm cursor-not-allowed"
            />
            <p className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-1">Email cannot be changed here</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 dark:border-neutral-900/30 border-t-white dark:border-t-neutral-900" />
                Saving...
              </>
            ) : saved ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-6">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Password</h3>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-4">
          A password reset link will be sent to your email address.
        </p>
        <button
          onClick={handlePasswordReset}
          className="px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[13px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          Reset Password
        </button>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-6">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-neutral-700 dark:text-neutral-300">Theme</p>
            <p className="text-[12px] text-neutral-400 dark:text-neutral-600">Switch between light and dark mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-11 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors"
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white dark:bg-neutral-900 shadow transition-transform ${theme === "dark" ? "translate-x-[22px]" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 p-6">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Account</h3>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-4">
          Sign out from your admin account.
        </p>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/admin/login";
          }}
          className="px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}