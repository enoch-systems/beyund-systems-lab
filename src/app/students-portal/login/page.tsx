"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/server/integration/supabase.client";
import { useTheme } from "@/contexts/theme-context";
import { getColors } from "@/config/theme-colors";
import { GraduationCap, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Link from "next/link";

export default function StudentLoginPage() {
  const { theme } = useTheme();
  const C = getColors(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const normalizedEmail = email.toLowerCase().trim();

      // IMPORTANT: Check registration status FIRST, before calling signInWithPassword.
      // Calling signInWithPassword overwrites any existing Supabase session cookie
      // (e.g. an admin session in another tab). If we then call signOut because the
      // student is pending/restricted, the admin gets logged out entirely.
      // By checking registration status FIRST, we never call signInWithPassword
      // for blocked accounts — preserving the admin's session.
      const { data: regData } = await supabase
        .from("student_registrations")
        .select("status")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (regData) {
        if (regData.status === "pending") {
          setError("Your access is pending. Please contact the admin to complete your enrollment.");
          setLoading(false);
          return;
        }
        if (regData.status === "restricted") {
          setError("Your access has been restricted. Please contact admin for more information.");
          setLoading(false);
          return;
        }
      }

      // Registration check passed (enrolled or no record) — now attempt login
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Verify they are a student in the students table
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("auth_user_id", data.user.id)
        .single();

      if (studentError || !student) {
        // Don't call signOut() — it clears the shared Supabase cookie
        // which would log out the admin in another tab.
        // Just redirect; the students table check will always fail.
        setError("Access denied. You are not registered as a student.");
        setLoading(false);
        return;
      }

      // Use window.location.href for a full page navigation after login.
      // This ensures the Supabase auth cookie is fully propagated before
      // the dashboard layout tries to read it — fixing the "login freeze" issue.
      window.location.href = "/students-portal/dashboard";
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: `1px solid ${C.border}`,
    background: theme === "dark" ? "#171717" : "#fff",
    color: C.text,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter','SF Pro',system-ui,sans-serif",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: C.bg, padding: 16,
    }}>
      <div style={{
        width: "100%", maxWidth: 380,
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
        padding: "32px 28px", boxShadow: "0 12px 36px rgba(0,0,0,0.2)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: C.teal, display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 14px",
          }}>
            <GraduationCap size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>
            Student Portal
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
            Sign in to access your courses, assignments & progress
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "8px 12px", borderRadius: 6, marginBottom: 16,
            background: "rgba(239,68,68,0.1)", border: `1px solid ${C.red}`,
            fontSize: 11, color: C.red,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
              style={inputStyle}
              autoComplete="email"
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.text, display: "block", marginBottom: 4 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ ...inputStyle, paddingRight: 36 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                  background: "transparent", border: "none", cursor: "pointer", padding: 4, color: C.muted, display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "10px 0", borderRadius: 6,
              border: "none", background: loading ? C.dim : C.teal,
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4,
            }}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <LogIn size={14} />
            )}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Forgot PIN */}
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button
            onClick={async () => {
              if (!email) { setError("Please enter your email first."); return; }
              setLoading(true);
              setError("");
              try {
                const supabase = createSupabaseBrowserClient();
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: window.location.origin + "/students-portal/login",
                });
                if (error) throw error;
                alert("✅ Password reset link has been sent to your email. Check your inbox (including spam).");
              } catch (err: any) {
                setError(err.message || "Failed to send reset link.");
              } finally {
                setLoading(false);
              }
            }}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 11, color: C.muted, textDecoration: "none",
              fontFamily: "'Inter','SF Pro',system-ui,sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
          >
            Forgot PIN? Reset it here
          </button>
        </div>

        {/* Back to home */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/" style={{
            fontSize: 11, color: C.muted, textDecoration: "none",
            transition: "color 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.teal)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}