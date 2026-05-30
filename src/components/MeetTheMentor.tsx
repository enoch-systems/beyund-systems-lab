"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const mentorshipPoints = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Production Systems",
    desc: "Experience building fintech, logistics, and enterprise systems that handle real transactions.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Structured Curriculum",
    desc: "A layered approach covering API design, deployment, architecture, and production monitoring.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Direct Mentorship",
    desc: "Guidance from an engineer who has shipped and architected operational systems.",
  },
];

export default function MeetTheMentor() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="mentor" className="relative overflow-hidden py-20 md:py-28">
      <div ref={sectionRef} className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 ">
        {/* Section header */}
        <div className="flex items-start gap-4 md:gap-6 mb-12 md:mb-16 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              meet your mentor
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              Meet Your Mentor
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              Fullstack Developer & Mentor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Image */}
          <div
            className={`transition-all duration-1000 ease-out ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            }`}
          >
            <div className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0">
              {/* Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-white/5 blur-2xl" />
              <div className="relative h-full w-full rounded-3xl bg-white/[0.06] ring-1 ring-white/15 shadow-xl overflow-hidden backdrop-blur-sm">
                <Image
                  src="https://res.cloudinary.com/djdbcoyot/image/upload/v1777316852/construction/about/eng3.png"
                  alt="Enoch Chukwudi — Mentor"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {/* Quote instantly below image */}
            <div className="text-center mt-6">
              <p className="text-sm md:text-base text-white/60 italic leading-relaxed">
                &ldquo;The insight almost never comes from inside your own world. Friction between domains is where vision lives.&rdquo;
                <br />
                <span className="not-italic text-white/40">_ Enoch</span>
              </p>
            </div>
          </div>

          {/* Right — Content */}
          <div
            className={`space-y-6 transition-all duration-1000 ease-out delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-white">
              Engineering Mentor at{" "}
              <span className="text-green-300 font-light">Beyund systems labs</span>
            </h3>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              Enoch Chukwudi is a fullstack developer and engineer who has architected and shipped
              production systems across fintech, logistics, identity, and enterprise domains.
              At Beyund systems labs, he translates that real world experience into a structured
              curriculum designed to take you from foundational concepts to production ready skills.
            </p>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              His teaching methodology is rooted in <strong className="text-white/90">layered architecture</strong>
              the same approach used by top engineering teams. You will learn more than syntax. You will
              learn how to <strong className="text-white/90 ">think in systems</strong>, design for scale,
              and ship code that works in production.
            </p>

            {/* Mentorship highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {mentorshipPoints.map((point, i) => (
                <div
                  key={point.title}
                  className={`p-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-700 ease-out ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: `${400 + i * 150}ms`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/15 text-green-300">
                      {point.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">{point.title}</p>
                      <p className="text-xs text-white/60 leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              className={`pt-4 transition-all duration-1000 ease-out delay-[800ms] ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-white/90 cursor-pointer"
              >
                Learn from Enoch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
