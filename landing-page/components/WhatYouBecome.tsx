"use client";

import { useState, useEffect, useCallback } from "react";

const identityStatements = [
  {
    from: "Following tutorials without understanding",
    to: "Building apps you can actually show off",
    title: "You build real apps, not just exercises",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    from: "Scared of authentication and databases",
    to: "Adding auth, storing data, deploying with confidence",
    title: "You go from idea to deployed app",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 6.75v4.5m0-4.5h-4.5m4.5 0L15 15" />
      </svg>
    ),
  },
  {
    from: "Writing frontend only code",
    to: "Connecting frontend to Firebase and Supabase",
    title: "You master the fullstack flow",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    from: "No portfolio and no confidence",
    to: "A portfolio of live apps and skills to freelance",
    title: "You become ready to freelance or land a role",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 016.835-5.665m0 0a60.44 60.44 0 0111.344 5.644m-11.344-5.644L12 2.25l3.18 3.618m-3.18-3.618v11.64M18 12a6 6 0 01-6 6m0 0a6 6 0 01-6-6" />
      </svg>
    ),
  },
];

export default function WhatYouBecome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = identityStatements.length;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide right-to-left every 3 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goNext, 3000);
    return () => clearInterval(interval);
  }, [goNext, isPaused]);

  const item = identityStatements[currentIndex];

  return (
    <section
      id="what-you-become"
      className="relative overflow-hidden py-20 md:py-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-start gap-4 md:gap-6 mb-12 md:mb-16 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              what you will walk away with
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-none">
              What{" "}
              <span className="text-green-300">You Will Be Able to Do</span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              Not what you learn. What you build.
            </p>
          </div>
        </div>

        {/* Carousel container */}
        <div className="max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/60 transition-all duration-700 ease-in-out"
                style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/40 whitespace-nowrap">
              {currentIndex + 1} / {totalSlides}
            </span>
          </div>

          {/* Slide area */}
          <div className="relative">
            {/* Card */}
            <div
              key={currentIndex}
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm overflow-hidden transition-all duration-500 ease-in-out hover:border-white/20"
            >
              <div className="relative z-10 p-6 md:p-8 lg:p-10">
                {/* Icon + Number */}
                <div className="flex items-center gap-3 md:gap-4 mb-5">
                  <span className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-300 text-sm md:text-base font-normal">
                    {currentIndex + 1}
                  </span>
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-green-500/15 text-green-300">
                    {item.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-white mb-5 group-hover:text-green-200 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* From → To */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] md:text-xs font-mono tracking-wider text-white/30 uppercase w-14 shrink-0">From:</span>
                    <span className="text-sm md:text-base text-white/50 line-through">{item.from}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] md:text-xs font-mono tracking-wider text-green-400/60 uppercase w-14 shrink-0">To:</span>
                    <span className="text-sm md:text-base text-green-200/90 font-normal">{item.to}</span>
                  </div>
                </div>
              </div>

              {/* Subtle border accent on hover */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-green-500/20 transition-colors duration-500 pointer-events-none" />
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {identityStatements.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-6 h-2 bg-white/70"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="mt-12 text-center text-sm md:text-base text-white/50 max-w-xl mx-auto">
          This is not about watching videos or passing quizzes. It is about
          becoming the developer who can take an idea, build it and put it live
          <span className="text-white/80 font-normal">, on your own.</span>
        </p>
      </div>
    </section>
  );
}