"use client";

import { useEffect, useRef, useState } from "react";

const identityStatements = [
  {
    from: "Theoretical knowledge",
    to: "Deployed production code",
    title: "You ship production systems",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    from: "CRUD apps",
    to: "Versioning, migrations, real-time logic",
    title: "You design for scale",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 6.75v4.5m0-4.5h-4.5m4.5 0L15 15" />
      </svg>
    ),
  },
  {
    from: "Following tutorials",
    to: "Designing tradeoffs, picking tech for constraints",
    title: "You architect like a senior",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    from: "Scared of interviews",
    to: "Confident in system design questions",
    title: "You're freelance-ready or job-ready",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 016.835-5.665m0 0a60.44 60.44 0 0111.344 5.644m-11.344-5.644L12 2.25l3.18 3.618m-3.18-3.618v11.64M18 12a6 6 0 01-6 6m0 0a6 6 0 01-6-6" />
      </svg>
    ),
  },
];

export default function WhatYouBecome() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 md:py-28">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-start gap-4 md:gap-6 mb-12 md:mb-16 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              the transformation
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              What{" "}
              <span className="text-green-300">You Become</span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              Not what you learn. Who you become.
            </p>
          </div>
        </div>

        {/* Identity cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {identityStatements.map((item, i) => (
            <div
              key={item.title}
              className={`group relative p-6 md:p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm transition-all duration-700 ease-out hover:border-white/20 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              <div className="relative z-10">
                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15 text-green-300 mb-4 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* From → To */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono tracking-wider text-white/30 uppercase w-12 shrink-0">From:</span>
                    <span className="text-sm text-white/50 line-through">{item.from}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono tracking-wider text-green-400/60 uppercase w-12 shrink-0">To:</span>
                    <span className="text-sm text-green-200/90 font-medium">{item.to}</span>
                  </div>
                </div>
              </div>

              {/* Subtle border accent on hover */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-green-500/20 transition-colors duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          className={`mt-12 text-center text-sm md:text-base text-white/50 max-w-xl mx-auto transition-all duration-1000 ease-out delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          This isn't about completing modules or passing tests. It's about
          becoming the engineer who can walk into any codebase and{" "}
          <span className="text-white/80 font-medium">architect with confidence</span>.
        </p>
      </div>
    </section>
  );
}