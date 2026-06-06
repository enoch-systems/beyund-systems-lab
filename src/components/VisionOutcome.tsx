"use client";

import { useEffect, useRef, useState } from "react";

const studentProjects = [
  {
    title: "Student Wallet App",
    desc: "Real transaction flows with fraud detection, balance management, and ledger history. Built with Node.js + PostgreSQL.",
    tags: ["Fintech", "Transactions", "Fraud Detection"],
  },
  {
    title: "Payment Settlement System",
    desc: "Connecting to Paystack, handling dispute logic, reconciliation, and idempotent retries for failed transactions.",
    tags: ["Payments", "Paystack", "Idempotency"],
  },
  {
    title: "Logistics API",
    desc: "Full logistics backend consumed by other students' frontend teams — routes, delivery tracking, real-time status updates.",
    tags: ["Logistics", "Real-time", "API Design"],
  },
  {
    title: "Multi-tenant SaaS Backend",
    desc: "Auth, role-based access, tenant isolation, billing webhooks — a production-ready SaaS backend scaffold.",
    tags: ["SaaS", "Multi-tenant", "Auth"],
  },
];

export default function VisionOutcome() {
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
              what cohort 1 is building
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              Real Systems,{" "}
              <span className="text-green-300">Not Tutorials</span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              This is what learning looks like
            </p>
          </div>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {studentProjects.map((project, i) => (
            <div
              key={project.title}
              className={`group relative p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-700 ease-out hover:border-green-500/30 hover:bg-white/[0.06] ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              {/* Hover glow */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-green-500/0 via-transparent to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/15 text-green-300 text-sm font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-green-200 transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-white/60 leading-relaxed mb-4">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] md:text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.05] text-white/50 font-mono tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Teaching video placeholder */}
        <div
          className={`mt-16 max-w-2xl mx-auto transition-all duration-1000 ease-out delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs md:text-sm font-mono tracking-[0.25em] text-white/30 uppercase mb-4 text-center">
            See how they learn
          </p>
          <div className="relative aspect-video rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-all duration-300">
                <svg className="w-7 h-7 text-green-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white/50 text-sm md:text-base text-center">
                <span className="text-white/70 font-medium">VIDEO PLACEHOLDER</span>
                <br />
                Loom: 2–3 min — Enoch drawing out a system architecture on screen
                <br />
                <span className="text-white/30 text-xs">Real pedagogy — layers, decisions, tradeoffs</span>
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}