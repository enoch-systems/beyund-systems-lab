"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-sm">
        {/* Logo — blended image + text */}
        <div className="flex items-center justify-center mb-10 group">
          <div className="relative flex items-center">
            {/* Logo image with gradient mask to seamlessly fade into text */}
            <img
              src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
              alt="Beyund systems labs logo"
              className="h-7 w-auto md:h-9 lg:h-11 shrink-0"
              style={{
                maskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
              }}
            />
            {/* Text overlapping the faded edge for seamless blend */}
            <div
              className="flex items-baseline -ml-2 md:-ml-5 lg:-ml-6 mix-blend-screen select-none"
              style={{ textShadow: "0 0 30px rgba(255,255,255,0.08)" }}
            >
              <span className="text-white text-base md:text-xl lg:text-2xl font-light tracking-wide group-hover:text-white transition-colors duration-300">
                eyund
              </span>
              <span
                className="text-slate-300/90 group-hover:text-slate-200 transition-colors duration-300 ml-1 text-sm md:text-lg lg:text-xl font-mono"
                style={{ fontVariant: "small-caps" }}
              >
                𝙻𝚊𝚋𝚜.
              </span>
              <span className="text-slate-400/70 group-hover:text-slate-300 transition-colors duration-300 ml-1 text-xs md:text-sm lg:text-base font-light tracking-widest uppercase">
                LMS
              </span>
            </div>
          </div>
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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/10 focus:border-neutral-300 dark:focus:border-neutral-600 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-6">
          <a href="/" className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">
            ← Back to landing page
          </a>
        </p>
      </div>
    </div>
  );
}