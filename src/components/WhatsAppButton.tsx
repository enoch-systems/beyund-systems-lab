"use client";

import { useEffect, useRef, useState } from "react";

export default function WhatsAppButton() {
  const [phase, setPhase] = useState<"hidden" | "entering" | "visible" | "exiting">("hidden");
  const [dismissed, setDismissed] = useState(false);
  const [suppressed, setSuppressed] = useState(false);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // IntersectionObserver to suppress tooltip when Contact or Footer is in view
  useEffect(() => {
    const targets = [document.getElementById("contact"), document.querySelector("footer")].filter(Boolean) as Element[];
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const anyIntersecting = entries.some((e) => e.isIntersecting);
        setSuppressed(anyIntersecting);
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Animation cycle
  useEffect(() => {
    if (dismissed || suppressed) {
      // When suppressed or dismissed, force hide the tooltip
      setPhase("hidden");
      if (cycleTimerRef.current) {
        clearTimeout(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
      return;
    }

    const SHOW_DURATION = 2500;
    const HIDE_DURATION = 3000;
    const TRANSITION_MS = 300;

    let enterTimer: ReturnType<typeof setTimeout>;
    let showTimer: ReturnType<typeof setTimeout>;
    let exitTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    function cycle() {
      setPhase("entering");

      enterTimer = setTimeout(() => {
        setPhase("visible");
      }, TRANSITION_MS);

      showTimer = setTimeout(() => {
        setPhase("exiting");
      }, SHOW_DURATION + TRANSITION_MS);

      exitTimer = setTimeout(() => {
        setPhase("hidden");
      }, SHOW_DURATION + TRANSITION_MS * 2);

      hideTimer = setTimeout(() => {
        cycleTimerRef.current = setTimeout(() => cycle(), 0);
      }, SHOW_DURATION + TRANSITION_MS * 2 + HIDE_DURATION);
    }

    const initTimer = setTimeout(() => {
      cycle();
    }, 1000);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(enterTimer);
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      if (cycleTimerRef.current) {
        clearTimeout(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
    };
  }, [dismissed, suppressed]);

  const isVisible = phase === "visible" || phase === "entering";
  const isEntering = phase === "entering";
  const isExiting = phase === "exiting";

  const whatsappUrl = `https://wa.me/2349162919586?text=${encodeURIComponent("Hi Enoch, I would like to connect with you regarding...")}`;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6 transition-opacity duration-300 ${suppressed ? "pointer-events-none opacity-0" : ""}`}>
      {/* Prompt tooltip */}
      {!dismissed && !suppressed && (
        <div
          className="relative"
          style={{
            transform: isVisible
              ? "scale(1) translateY(0)"
              : "scale(0.15) translateY(24px)",
            opacity: isEntering ? 1 : isExiting ? 0 : isVisible ? 1 : 0,
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease-out",
            transformOrigin: "bottom right",
          }}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/60 text-[9px] flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-200 z-10"
            aria-label="Close prompt"
          >
            ✕
          </button>
          {/* Compact glass card */}
          <div className="relative w-[200px] sm:w-[220px] bg-black backdrop-blur-xl border border-white/[0.12] rounded-xl px-3.5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {/* Inner green glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#25D366]/5 to-transparent pointer-events-none" />
            <div className="relative flex items-start gap-2.5">
              {/* Mini WhatsApp icon */}
              <div className="shrink-0 w-8 h-8 rounded-lg bg-[#25D366]/20 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-white/90 text-xs font-semibold leading-tight tracking-wide">
                  Speak to Enoch
                </p>
                <p className="text-white/45 text-[10px] mt-1 leading-snug">
                  Chat or book a call to make enquiries
                </p>
              </div>
            </div>
            {/* Bubble tail */}
            <div className="absolute -bottom-1.5 right-5 w-3 h-3 rotate-45 bg-white/[0.05] border-r border-b border-white/[0.15]" />
          </div>
        </div>
      )}

      {/* WhatsApp floating button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

        {/* WhatsApp SVG icon */}
        <svg
          className="relative w-6 h-6 sm:w-7 sm:h-7 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}