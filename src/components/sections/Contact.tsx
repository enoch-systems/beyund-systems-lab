"use client";

import { useState, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*  Storage helpers                                                            */
/* -------------------------------------------------------------------------- */

const DRAFT_KEY = "beyund-registration-draft";

type FormState = {
  name: string;
  email: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
};

type DraftEnvelope = { form: FormState; savedAt: number };

function loadDraft(): DraftEnvelope | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftEnvelope;
    // Don't restore anything older than 7 days
    if (Date.now() - parsed.savedAt > 7 * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDraft(form: FormState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ form, savedAt: Date.now() } satisfies DraftEnvelope)
    );
  } catch {
    /* private mode etc. */
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [draft, setDraft] = useState<DraftEnvelope | null>(null);
  const [showResume, setShowResume] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [showingApproval, setShowingApproval] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    status: "idle" | "checking" | "available" | "duplicate";
    message: string;
  }>({ status: "idle", message: "" });

  /* ----------------------------- mount: fresh start ---------------------- */
  // On every page load/refresh, start afresh: clear any saved draft
  useEffect(() => {
    clearDraft();
    setForm(EMPTY_FORM);
    setShowResume(false);
    setDraft(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------------- mutations ----------------------------- */
  const updateForm = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const n = { ...prev };
      delete n[field];
      return n;
    });
    if (field === "email") setEmailStatus({ status: "idle", message: "" });
  };

  const checkEmailDuplicate = async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailStatus({ status: "idle", message: "" });
      return;
    }
    setEmailChecking(true);
    setEmailStatus({ status: "checking", message: "Checking email..." });
    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const r = await res.json();
      if (r.exists) {
        setEmailStatus({ status: "duplicate", message: "This email has already been registered. Please use a different email or contact support." });
      } else {
        setEmailStatus({ status: "available", message: "" });
      }
    } catch {
      setEmailStatus({ status: "idle", message: "" });
    } finally {
      setEmailChecking(false);
    }
  };

  /* ----------------------------- validation ---------------------------- */
  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    
    if (!form.name.trim()) e.name = "We need a name to address you by.";
    else if (/\d/.test(form.name)) e.name = "Names don't usually have numbers.";
    else if (form.name.trim().split(/\s+/).filter((w) => w.length > 0).length < 2)
      e.name = "Please add your last name too.";
    
    if (!form.email.trim()) e.email = "We need an email to send your confirmation.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "That doesn't look like a valid email.";
    else if (emailStatus.status === "duplicate") e.email = emailStatus.message;
    
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstError = Object.keys(e)[0];
      const el = document.getElementById(`err-${firstError}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(e).length === 0;
  };

  /* ----------------------------- submit -------------------------------- */
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    saveDraft(form);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name.trim(),
          email: form.email.trim().toLowerCase(),
        }),
      });
      if (res.ok) {
        setShowingApproval(true);
        const approvalName = form.name.trim();
        const approvalEmail = form.email.trim().toLowerCase();
        setTimeout(() => {
          setShowingApproval(false);
          setSubmitted({
            name: approvalName,
            email: approvalEmail,
          });
          clearDraft();
        }, 3000);
      } else {
        const r = await res.json();
        alert(
          `We couldn't save your application: ${
            r.error || "Please try again in a moment."
          }`
        );
      }
    } catch {
      alert(
        "Network hiccup. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setSubmitted(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setEmailStatus({ status: "idle", message: "" });
  };

  /* ----------------------------- enter-key ----------------------------- */
  useEffect(() => {
    if (submitted) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "TEXTAREA") return;
      e.preventDefault();
      handleSubmit();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, form, emailStatus]);

  /* ----------------------------- approval animation ----------------------- */
  if (showingApproval) {
    return (
      <section
        id="contact"
        className="relative overflow-hidden min-h-screen flex items-center justify-center"
      >
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center animate-[fade-in_0.4s_ease-out]">
              <svg
                className="w-12 h-12 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal text-white mb-2">
              Application approved!
            </h2>
            <p className="text-white/50 text-sm">Setting things up...</p>
          </div>
        </div>
      </section>
    );
  }

  /* ----------------------------- success screen ------------------------ */
  if (submitted) {
    return (
      <section
        id="contact"
        className="relative overflow-hidden min-h-screen flex items-center justify-center"
      >
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center">
          <div className="text-center w-full max-w-md mx-auto">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center animate-[fade-in_0.6s_ease-out]">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-white mb-2">
              You're in, {submitted.name.split(" ")[0]}.
            </h2>
            <p className="text-white/60 text-sm sm:text-base mb-10 max-w-md mx-auto">
              We'll reach you on WhatsApp within 24 hours with next steps.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-10 text-left">
              {[
                { icon: "💬", title: "WhatsApp ping", body: "A quick hello from the team." },
                { icon: "📧", title: "Email confirmation", body: `Sent to ${submitted.email}.` },
                { icon: "🗓️", title: "Onboarding link", body: "Class schedule + materials." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="text-xl mb-1.5">{item.icon}</div>
                  <p className="text-white text-sm font-normal">{item.title}</p>
                  <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={resetAll}
              className="text-white/40 text-xs hover:text-white/70 transition"
            >
              Register another student
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ----------------------------- main render --------------------------- */
  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="max-w-2xl mx-auto text-center">
          {/* Title */}
          <div className="mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
              <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20" />
              <div>
                <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
                  ready to start building?
                </p>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-none">
                  Build Your First{" "}
                  <span className="text-green-300">Real Fullstack App</span>
                </h2>
                <p className="text-xl sm:text-2xl md:text-3xl font-normal tracking-[0.2em] text-white/60 uppercase mt-1">
                  Apply for Cohort 1
                </p>
              </div>
              <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20" />
            </div>

            <p className="text-xs sm:text-sm md:text-base text-white/70 leading-relaxed max-w-md mx-auto">
              No prior experience required, just the willingness to build. 60 seconds to apply.
            </p>

            {/* Pricing card */}
            <div className="inline-flex items-center gap-3 md:gap-5 px-5 md:px-7 py-3 md:py-4 rounded-2xl border border-white/20 bg-white/[0.05] backdrop-blur-sm mt-6">
              <div className="text-left">
                <p className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
                  Cohort 1 pricing
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl md:text-4xl font-normal text-white">₦60,000</span>
                  <span className="text-sm text-white/50">for 12 weeks</span>
                </div>
                <p className="text-xs text-white/40 mt-0.5">
                  That is ₦5,000 per week for all 9 layers with direct mentorship.
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="max-w-xl mx-auto">
            <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-normal text-white mb-1">
                  Hey, what should we call you?
                </h3>
                <p className="text-white/50 text-sm">
                  Just the basics so we can reach you.
                </p>
              </div>

              <div className="space-y-4">
                {/* Name field */}
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                    Your name
                  </label>
                  <input
                    id="err-name"
                    type="text"
                    placeholder="e.g. Ada Lovelace"
                    value={form.name}
                    autoFocus
                    onChange={(e) =>
                      updateForm("name", e.target.value.replace(/[0-9]/g, ""))
                    }
                    className={`w-full px-5 py-4 rounded-xl bg-white/10 border text-white placeholder-white/30 text-base focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200 ${
                      errors.name ? "border-red-500/50" : "border-white/20"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
                  )}
                  <p className="text-white/30 text-[11px] mt-2">
                    First and last name. We use it to greet you.
                  </p>
                </div>

                {/* Email field */}
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="err-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@somewhere.com"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      onBlur={(e) => checkEmailDuplicate(e.target.value)}
                      className={`w-full px-5 py-4 rounded-xl bg-white/10 border text-white placeholder-white/30 text-base focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200 ${
                        errors.email
                          ? "border-red-500/50"
                          : emailStatus.status === "duplicate"
                          ? "border-red-500/50"
                          : emailStatus.status === "available"
                          ? "border-green-500/50"
                          : "border-white/20"
                      } ${emailChecking ? "opacity-70" : ""}`}
                    />
                    {emailStatus.status === "checking" && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                      </div>
                    )}
                    {emailStatus.status === "available" && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-sm">
                        ✓
                      </div>
                    )}
                    {emailStatus.status === "duplicate" && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-sm">
                        ✗
                      </div>
                    )}
                  </div>
                  {emailStatus.status === "duplicate" && emailStatus.message && (
                    <p className="text-red-400 text-xs mt-1.5">{emailStatus.message}</p>
                  )}
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-green-500 text-white text-base font-normal hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-6"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Submit
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-center text-white/30 text-[11px] mt-5 flex items-center justify-center gap-1.5">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Your info is safe. We never spam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}