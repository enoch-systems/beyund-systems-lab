"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import BeyundLogo from "@/components/BeyundLogo";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "Admin LMS - Beyund Labs Academy | Student & Program Management";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Admin LMS dashboard for Beyund Labs Academy. Manage students, track registrations, monitor program visibility, and organize academic operations efficiently.");
  }, []);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Hold the spinner for 2.5 seconds so the user sees it before redirect
    await new Promise(r => setTimeout(r, 2500));
    router.push("/adminportal");
  }

  return (
    <>
      {/* Full‑screen spinner overlay — independent, shows only while signing in */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div className="loader" style={{ width: 60, aspectRatio: 1, color: "#25b09b", position: "relative" }} />
        </div>
      )}

      <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] flex items-center justify-center px-4 transition-colors">
        <div className="w-full max-w-sm">
          {/* Logo — same as landing page */}
          <div className="flex items-center justify-center mb-10">
            <BeyundLogo className="h-7 md:h-9 lg:h-11" />
          </div>

          {/* Login Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">Welcome back</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Sign in to access the admin dashboard
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@beyund.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10 focus:border-neutral-300 dark:focus:border-neutral-600 transition-all"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-[13px] font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10 focus:border-neutral-300 dark:focus:border-neutral-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>

          <style>{`
.loader {
  width: 60px;
  aspect-ratio: 1;
  color: #25b09b;
  position: relative;
}
.loader::before,
.loader::after {
  content: "";
  position: absolute;
  inset:0;
  background:
    linear-gradient(currentColor 0 0) 0 calc(var(--s,0)*-100%)/100% calc(100%/3),
    repeating-linear-gradient(90deg,currentColor 0 25%,#0000 0 50%) calc(var(--s,0)*100%) 50%/calc(4*100%/3) calc(100%/3);
  background-repeat: no-repeat;
  animation: l26 2s infinite;
}
.loader::after {
  --s:-1;
}
@keyframes l26 {
    0%,
    10%  {transform:translateY(calc(var(--s,1)*0));   background-position: 0 calc(var(--s,0)*-100%),calc(var(--s,0)*100%) 50%}
    33%  {transform:translateY(calc(var(--s,1)*-20%));background-position: 0 calc(var(--s,0)*-100%),calc(var(--s,0)*100%) 50%}
    66%  {transform:translateY(calc(var(--s,1)*-20%));background-position: 0 calc(var(--s,0)*-100%),calc(var(--s,0)*100% + 100%) 50%}
    90%,
    100%  {transform:translateY(calc(var(--s,1)*0));  background-position: 0 calc(var(--s,0)*-100%),calc(var(--s,0)*100% + 100%) 50%}
}
          `}</style>

          <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-6">
            <a href="/" className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">
              ← Back to landing page
            </a>
          </p>
        </div>
      </div>
    </>
  );
}