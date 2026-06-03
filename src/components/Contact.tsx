"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* -------------------------------------------------------------------------- */
/*  Storage helpers                                                            */
/* -------------------------------------------------------------------------- */

const DRAFT_KEY = "beyund-registration-draft";

type FormState = {
  name: string;
  email: string;
  mobile: string;
  dialCode: string;
  sex: "" | "male" | "female";
  country: string;
  state: string;
  course: string;
  employment: "" | "employed" | "unemployed" | "student" | "freelancer";
  laptop: "" | "yes" | "no";
  reason: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  mobile: "",
  dialCode: "+234",
  sex: "",
  country: "",
  state: "",
  course: "fullstack",
  employment: "",
  laptop: "",
  reason: "",
};

type DraftEnvelope = { form: FormState; step: number; savedAt: number };

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

function saveDraft(form: FormState, step: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ form, step, savedAt: Date.now() } satisfies DraftEnvelope)
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

function bestGuessCountry(): string {
  if (typeof navigator === "undefined") return "NG";
  const locale = (navigator.language || "en-NG").toLowerCase();
  if (locale.includes("ng")) return "NG";
  if (locale.includes("gb")) return "GB";
  if (locale.includes("us")) return "US";
  if (locale.includes("ca")) return "CA";
  if (locale.includes("gh")) return "GH";
  if (locale.includes("ke")) return "KE";
  if (locale.includes("za")) return "ZA";
  return "NG";
}

/* -------------------------------------------------------------------------- */
/*  Steps                                                                      */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { id: 1, label: "You",    heading: "Hey, what should we call you?",   subtext: "Just the basics so we can reach you." },
  { id: 2, label: "About",  heading: "A few quick taps.",               subtext: "Tap to pick — no typing needed." },
  { id: 3, label: "Done",   heading: "One last thing.",                 subtext: "Optional. You can always tell us later." },
] as const;

/* -------------------------------------------------------------------------- */
/*  Tap-tile component                                                         */
/* -------------------------------------------------------------------------- */

type TileProps = {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md";
};

function Tile({ active, onClick, children, fullWidth, size = "md" }: TileProps) {
  return (
    <button
      type="button"
      onClick={onClick ?? (() => {})}
      aria-disabled={!onClick}
      className={[
        "relative rounded-xl border text-left transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60",
        size === "md" ? "px-4 py-3.5" : "px-3 py-2.5",
        fullWidth ? "w-full" : "",
        active
          ? "border-green-400/60 bg-green-400/10 text-white shadow-[0_0_0_1px_rgba(74,222,128,0.25)]"
          : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/25 hover:bg-white/[0.07] hover:text-white",
      ].join(" ")}
    >
      {active && (
        <span className="absolute top-2.5 right-2.5 text-green-400 text-xs leading-none">✓</span>
      )}
      <span className="block text-sm font-medium">{children}</span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function Contact() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [draft, setDraft] = useState<DraftEnvelope | null>(null);
  const [showResume, setShowResume] = useState(false);

  const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
  const [states, setStates] = useState<{ code: string; name: string }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    name: string;
    courseLabel: string;
    email: string;
  } | null>(null);
  const [showingApproval, setShowingApproval] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    status: "idle" | "checking" | "available" | "duplicate";
    message: string;
  }>({ status: "idle", message: "" });

  const [slideOffset, setSlideOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  /* ----------------------------- mount: draft check -------------------- */
  // Read localStorage *after* hydration to avoid SSR/CSR mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const d = loadDraft();
    if (d && (d.form.name || d.form.email || d.form.mobile)) {
      setDraft(d);
      setShowResume(true);
    } else {
      setForm((prev) => ({ ...prev, country: bestGuessCountry() }));
    }
  }, []);

  /* ----------------------------- silent autosave ------------------------ */
  useEffect(() => {
    if (submitted) return;
    const t = window.setTimeout(() => saveDraft(form, currentStep), 350);
    return () => window.clearTimeout(t);
  }, [form, currentStep, submitted]);

  /* ----------------------------- countries/states ----------------------- */
  type CountryApi = { cca2: string; name: { common: string } };
  type StatesApiCountry = { iso2?: string; iso3?: string; states?: { state_code?: string; name: string }[] };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=cca2,name");
        const data = (await res.json()) as CountryApi[];
        setCountries(
          data
            .map((c) => ({ code: c.cca2, name: c.name.common }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch {
        setCountries([
          { code: "NG", name: "Nigeria" },
          { code: "US", name: "United States" },
          { code: "GB", name: "United Kingdom" },
          { code: "CA", name: "Canada" },
          { code: "AU", name: "Australia" },
          { code: "DE", name: "Germany" },
          { code: "KE", name: "Kenya" },
          { code: "GH", name: "Ghana" },
          { code: "OTHER", name: "Other" },
        ]);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!form.country || form.country === "OTHER") {
        setStates([]);
        return;
      }
      setLoadingStates(true);
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data?.data && Array.isArray(data.data)) {
          const cd = (data.data as StatesApiCountry[]).find(
            (i) => i.iso2 === form.country || i.iso3 === form.country
          );
          if (cd?.states && Array.isArray(cd.states)) {
            setStates(
              cd.states
                .map((s) => ({ code: s.state_code || s.name, name: s.name }))
                .sort((a, b) => a.name.localeCompare(b.name))
            );
          } else {
            setStates([]);
          }
        } else {
          setStates([]);
        }
      } catch {
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, [form.country]);

  /* ----------------------------- mutations ----------------------------- */
  const updateForm = useCallback(
    (field: keyof FormState, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const n = { ...prev };
        delete n[field];
        return n;
      });
      if (field === "email") setEmailStatus({ status: "idle", message: "" });
    },
    []
  );

  const checkEmailDuplicate = useCallback(async (email: string) => {
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
  }, []);

  /* ----------------------------- validation ---------------------------- */
  const validateStep = (step: number): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.name.trim()) e.name = "We need a name to address you by.";
      else if (/\d/.test(form.name)) e.name = "Names don't usually have numbers.";
      else if (form.name.trim().split(/\s+/).filter((w) => w.length > 0).length < 2)
        e.name = "Please add your last name too.";
    }
    if (step === 2) {
      if (!form.email.trim()) e.email = "We need an email to send your confirmation.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "That doesn't look like a valid email.";
      else if (emailStatus.status === "duplicate") e.email = emailStatus.message;
      if (!form.mobile.trim()) e.mobile = "We need a WhatsApp number for updates.";
      else {
        const d = form.mobile.replace(/\D/g, "");
        if (/^0+$/.test(d) || /^(\d)\1{4,}$/.test(d) || d.length < 7 || d.length > 15)
          e.mobile = "That number doesn't look right.";
      }
      if (!form.sex) e.sex = "Tap one to continue.";
      if (!form.country) e.country = "Tap a country.";
      if (!form.employment) e.employment = "Tap one to continue.";
      if (!form.laptop) e.laptop = "Tap one to continue.";
    }
    if (step === 3) {
      if (form.reason.trim() && form.reason.trim().length < 5)
        e.reason = "Just a sentence or two helps us help you.";
    }
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstError = Object.keys(e)[0];
      const el = document.getElementById(`err-${firstError}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(e).length === 0;
  };

  /* ----------------------------- navigation ---------------------------- */
  const animateTo = (next: number, dir: "next" | "back") => {
    setSlideOffset(dir === "next" ? -30 : 30);
    setTimeout(() => {
      setCurrentStep(next);
      setSlideOffset(dir === "next" ? 30 : -30);
      setTimeout(() => setSlideOffset(0), 50);
    }, 50);
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < STEPS.length) animateTo(currentStep + 1, "next");
    else void handleSubmit();
  };

  const goBack = () => {
    if (currentStep > 1) animateTo(currentStep - 1, "back");
  };

  /* ----------------------------- submit -------------------------------- */
  const handleSubmit = async () => {
    setSubmitting(true);
    const dialCode = form.dialCode || "+234";
    const fullPhone = `${dialCode}${form.mobile}`;
    const countryName =
      countries.find((c) => c.code === form.country)?.name || form.country;
    const courseLabel = "Full Stack Development";

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone_whatsapp: fullPhone,
          sex: form.sex,
          country: countryName,
          state: form.state || null,
          course_applying_for: courseLabel,
          employment_status: form.employment,
          has_laptop: form.laptop,
          heard_about_us: "registration",
          learning_reason: form.reason.trim(),
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
            courseLabel,
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
        "Network hiccup. Please check your connection and try again — your progress is saved."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setSubmitted(null);
    setCurrentStep(1);
    setForm({ ...EMPTY_FORM, country: bestGuessCountry() });
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
      goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, submitted, form, emailStatus]);

  /* ----------------------------- resume draft -------------------------- */
  const resumeDraft = () => {
    if (!draft) return;
    setForm(draft.form);
    setCurrentStep(draft.step);
    setShowResume(false);
  };

  const discardDraft = () => {
    clearDraft();
    setDraft(null);
    setShowResume(false);
    setForm({ ...EMPTY_FORM, country: bestGuessCountry() });
  };

  /* ----------------------------- derived ------------------------------- */
  const progress = useMemo(
    () => (currentStep / STEPS.length) * 100,
    [currentStep]
  );
  const countryLabel =
    countries.find((c) => c.code === form.country)?.name || "Not selected";
  const stateLabel = states.find((s) => s.code === form.state)?.name || "";
  const employmentLabel: Record<string, string> = {
    employed: "Employed",
    unemployed: "Looking for work",
    student: "Student",
    freelancer: "Freelancer",
  };

  /* ----------------------------- approval animation ----------------------- */
  if (showingApproval) {
    return (
      <section
        id="contact"
        className="py-24 relative overflow-hidden min-h-screen flex items-center justify-center"
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
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
        className="py-24 relative overflow-hidden min-h-screen flex items-center justify-center"
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              You're in, {submitted.name.split(" ")[0]}.
            </h2>
            <p className="text-white/60 text-sm sm:text-base mb-10 max-w-md mx-auto">
              We'll reach you on WhatsApp within 24 hours with next steps for{" "}
              <span className="text-white/90 font-medium">
                {submitted.courseLabel}
              </span>
              .
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
                  <p className="text-white text-sm font-medium">{item.title}</p>
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
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="flex items-start gap-4 md:gap-6 mb-10 md:mb-14 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              embrace clarity
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              READY TO KICKOFF YOUR JOURNEY?
            </h2>
            {/* Note: heading already ends with "?" not "'" so no escape needed here */}
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              Register Now
            </p>
          </div>
        </div>

        <div className="max-w-xl mx-auto text-center mb-8">
          <p className="text-xs sm:text-sm md:text-base text-white/70 leading-relaxed">
            Ready to acquire building skills in software fullstack development at{" "}
            <span className="text-white font-medium">Beyund Labs Academy</span>?
            Takes about 60 seconds.
          </p>
        </div>

        {/* Resume banner */}
        {showResume && draft && (
          <div className="max-w-xl mx-auto mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-sm">
            <span className="text-white/70">
              You started this before.{" "}
              <span className="text-white/40">Pick up where you left off?</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={resumeDraft}
                className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition"
              >
                Resume
              </button>
              <button
                onClick={discardDraft}
                className="px-3 py-1.5 rounded-lg text-white/50 text-xs hover:text-white/80 transition"
              >
                Start fresh
              </button>
            </div>
          </div>
        )}

        {/* Wizard Card */}
        <div
          ref={cardRef}
          className="max-w-xl mx-auto"
          style={{
            transform: `translateY(${slideOffset}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* Progress dots */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] text-white/40 font-mono tracking-wider uppercase">
                {STEPS[currentStep - 1].label}
              </span>
              <span className="text-[11px] text-white/30">
                Step {currentStep} of {STEPS.length}
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {STEPS[currentStep - 1].heading}
              </h3>
              <p className="text-white/50 text-sm">
                {STEPS[currentStep - 1].subtext}
              </p>
            </div>

            {/* STEP 1 — Name only */}
            {currentStep === 1 && (
              <div className="space-y-4">
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        goNext();
                      }
                    }}
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
              </div>
            )}

            {/* STEP 2 — All the taps */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Email + WhatsApp */}
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const next = document.getElementById(
                            "err-mobile"
                          ) as HTMLInputElement | null;
                          next?.focus();
                        }
                      }}
                      className={`w-full px-5 py-3.5 rounded-xl bg-white/10 border text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200 ${
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
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                    WhatsApp number
                  </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={form.dialCode}
                      onChange={(e) => updateForm("dialCode", e.target.value)}
                      className="shrink-0 px-2 py-3.5 rounded-xl bg-neutral-900 border border-white/20 text-white/70 text-xs sm:text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                      style={{ colorScheme: "dark", minWidth: 90 }}
                    >
                      <option value="+234">+234</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                      <option value="+254">+254</option>
                      <option value="+233">+233</option>
                      <option value="+27">+27</option>
                      <option value="+256">+256</option>
                      <option value="+260">+260</option>
                    </select>
                    <input
                      id="err-mobile"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="801 234 5678"
                      value={form.mobile}
                      onChange={(e) =>
                        updateForm(
                          "mobile",
                          e.target.value.replace(/\D/g, "").slice(0, 15)
                        )
                      }
                      className={`flex-1 px-5 py-3.5 rounded-xl bg-white/10 border text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200 ${
                        errors.mobile ? "border-red-500/50" : "border-white/20"
                      }`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-red-400 text-xs mt-1.5">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Sex */}
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                    Sex
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Tile
                      active={form.sex === "female"}
                      onClick={() => updateForm("sex", "female")}
                    >
                      Female
                    </Tile>
                    <Tile
                      active={form.sex === "male"}
                      onClick={() => updateForm("sex", "male")}
                    >
                      Male
                    </Tile>
                  </div>
                  {errors.sex && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.sex}</p>
                  )}
                </div>

                {/* Course (pre-selected, single option) */}
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                    Course
                  </label>
                  <Tile active fullWidth>
                    Full Stack Development
                    <span className="block text-[11px] text-white/40 mt-0.5 font-normal">
                      Currently the only open cohort.
                    </span>
                  </Tile>
                </div>

                {/* Country + State */}
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                    Where are you?
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      id="err-country"
                      value={form.country}
                      onChange={(e) => {
                        updateForm("country", e.target.value);
                        updateForm("state", "");
                      }}
                      className={`flex-1 px-4 py-3 rounded-xl bg-neutral-900 border text-white/80 text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer ${
                        errors.country ? "border-red-500/50" : "border-white/20"
                      }`}
                    >
                      <option value="" disabled>
                        {loadingCountries ? "Loading…" : "Country"}
                      </option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {states.length > 0 && (
                      <select
                        value={form.state}
                        onChange={(e) => updateForm("state", e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-white/20 text-white/80 text-sm focus:outline-none focus:border-yellow-500/50 transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          {loadingStates ? "Loading…" : "State"}
                        </option>
                        {states.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {errors.country && (
                    <p className="text-red-400 text-xs mt-1.5">
                      {errors.country}
                    </p>
                  )}
                </div>

                {/* Employment */}
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                    You are currently…
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["employed", "Employed"],
                        ["freelancer", "Freelancer"],
                        ["student", "A student"],
                        ["unemployed", "Looking for work"],
                      ] as const
                    ).map(([val, label]) => (
                      <Tile
                        key={val}
                        active={form.employment === val}
                        onClick={() => updateForm("employment", val)}
                      >
                        {label}
                      </Tile>
                    ))}
                  </div>
                  {errors.employment && (
                    <p className="text-red-400 text-xs mt-1.5">
                      {errors.employment}
                    </p>
                  )}
                </div>

                {/* Laptop */}
                <div>
                  <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                    Do you have a laptop?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Tile
                      active={form.laptop === "yes"}
                      onClick={() => updateForm("laptop", "yes")}
                    >
                      Yes, I do
                    </Tile>
                    <Tile
                      active={form.laptop === "no"}
                      onClick={() => updateForm("laptop", "no")}
                    >
                      Not yet
                    </Tile>
                  </div>
                  {errors.laptop && (
                    <p className="text-red-400 text-xs mt-1.5">
                      {errors.laptop}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 — Optional why + review */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label className="block text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40">
                      Why do you want to learn?
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        updateForm("reason", "");
                        goNext();
                      }}
                      className="text-white/40 text-[11px] hover:text-white/70 transition"
                    >
                      Skip
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="A sentence or two. What would you build if you had these skills?"
                    value={form.reason}
                    onChange={(e) => updateForm("reason", e.target.value)}
                    className={`w-full px-5 py-4 rounded-xl bg-white/10 border text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200 resize-none ${
                      errors.reason ? "border-red-500/50" : "border-white/20"
                    }`}
                  />
                  {errors.reason && (
                    <p className="text-red-400 text-xs mt-1.5">
                      {errors.reason}
                    </p>
                  )}
                  <p className="text-white/30 text-[11px] mt-2">
                    Optional. Skip if you would rather tell us on the call.
                  </p>
                </div>

                {/* Read-only review summary */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] divide-y divide-white/5">
                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                      You
                    </span>
                    <span className="text-white/80 text-sm text-right truncate">
                      {form.name || "—"}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                      Reach you
                    </span>
                    <span className="text-white/80 text-sm text-right truncate">
                      {form.email || "—"} · {form.dialCode}
                      {form.mobile}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                      Course
                    </span>
                    <span className="text-white/80 text-sm">Full Stack Development</span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                      About
                    </span>
                    <span className="text-white/80 text-sm text-right truncate">
                      {form.sex ? (form.sex === "male" ? "Male" : "Female") : "—"}{" "}
                      · {employmentLabel[form.employment] || "—"} · Laptop:{" "}
                      {form.laptop === "yes" ? "Yes" : form.laptop === "no" ? "No" : "—"}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                      From
                    </span>
                    <span className="text-white/80 text-sm text-right truncate">
                      {countryLabel}
                      {stateLabel ? `, ${stateLabel}` : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-5 border-t border-white/5">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 transition"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
              ) : (
                <div />
              )}
              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={currentStep === 2 && emailChecking}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 1 ? "Continue" : "Almost done"}
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
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Let's go
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
              )}
            </div>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (i + 1 < currentStep) animateTo(i + 1, "back");
                }}
                aria-label={`Go to step ${i + 1}: ${s.label}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 === currentStep
                    ? "bg-green-400 w-6"
                    : i + 1 < currentStep
                    ? "bg-green-400/40 w-1.5 cursor-pointer hover:bg-green-400/60"
                    : "bg-white/10 w-1.5 cursor-default"
                }`}
              />
            ))}
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
    </section>
  );
}
