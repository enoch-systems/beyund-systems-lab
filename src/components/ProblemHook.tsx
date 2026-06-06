"use client";

import { useEffect, useRef, useState } from "react";

export default function ProblemHook() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation immediately
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28"
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-8">
        {/* Eyebrow */}
        <div
          className={`transition-all duration-1000 ease-out mb-6 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block text-[10px] md:text-xs font-mono tracking-[0.35em] text-green-400/70 uppercase border border-green-400/20 px-4 py-2 rounded-full bg-green-400/5">
            Beyund Labs Academy — Cohort 1
          </span>
        </div>

        {/* Main hook */}
        <h1
          className={`transition-all duration-1000 ease-out delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            You can code.{" "}
            <span className="text-white/50">You can build.</span>
          </span>
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white/80 leading-[1.15] mt-3">
            But most backend developers{" "}
            <span className="text-green-300 underline decoration-green-500/30 decoration-2 underline-offset-8">
              never architect a system in production
            </span>
            .
          </span>
        </h1>

        {/* Sub-copy */}
        <p
          className={`mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-white/60 leading-relaxed transition-all duration-1000 ease-out delay-400 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          They learn Express, Databases, APIs. Then they hit a wall: versioning,
          scaling, real-time systems, fraud logic, integrations. The tools exist.
          <em className="text-white/80 not-italic"> The knowledge doesn't.</em>
        </p>

        {/* Stats / credibility line */}
        <div
          className={`mt-10 flex flex-wrap gap-6 md:gap-10 transition-all duration-1000 ease-out delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <span className="text-2xl md:text-3xl font-bold text-white">50%</span>
            <p className="text-xs md:text-sm text-white/40 mt-1 max-w-[180px]">
              of self-taught devs plateau within 2 years — they never see a production system get built
            </p>
          </div>
          <div className="hidden md:block w-px bg-white/10" />
          <div>
            <span className="text-2xl md:text-3xl font-bold text-white">15</span>
            <p className="text-xs md:text-sm text-white/40 mt-1 max-w-[180px]">
              builders per cohort. Deep work, not mass enrollment.
            </p>
          </div>
        </div>

        {/* Video embed placeholder */}
        <div
          className={`mt-12 transition-all duration-1000 ease-out delay-600 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative aspect-video max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden group cursor-pointer">
            {/* Placeholder content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-all duration-300">
                <svg className="w-7 h-7 text-green-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white/50 text-sm md:text-base text-center">
                <span className="text-white/70 font-medium">VIDEO PLACEHOLDER</span>
                <br />
                Loom: 60–90s — Enoch on screen explaining the problem from first principles
                <br />
                <span className="text-white/30 text-xs">Show a real code screenshot or architecture diagram while talking</span>
              </p>
            </div>
            {/* Glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`mt-16 flex flex-col items-center gap-2 transition-all duration-1000 ease-out delay-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-white/30 uppercase">
            Scroll to see how Cohort 1 changes this
          </span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-white/50 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}