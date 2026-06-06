"use client";

import { useEffect, useState } from "react";

export default function PricingBadge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed right-3 md:right-6 top-28 md:top-32 z-40 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
      }`}
    >
      <div className="relative group">
        {/* Glow behind badge */}
        <div className="absolute -inset-2 rounded-2xl bg-green-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge body */}
        <div className="relative rounded-xl border border-green-500/30 bg-gradient-to-b from-green-900/80 to-green-950/80 backdrop-blur-md px-3 md:px-4 py-2.5 md:py-3 shadow-lg shadow-green-500/10">
          {/* Top accent line */}
          <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />

          {/* Ribbon fold corner */}
          <div className="absolute -top-[3px] -right-[3px] w-3 h-3 bg-green-500/30 rotate-45 rounded-sm" />

          {/* Content */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-green-400/70 uppercase">
              Cohort 1
            </span>
            <span className="text-lg md:text-xl font-bold text-green-300 leading-none">
              ₦60,000
            </span>
            <span className="text-[9px] md:text-[10px] text-white/40 font-mono">
              12 weeks &middot; ₦5k/week
            </span>
          </div>

          {/* Subtle shine overlay */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
        </div>

        {/* Decorative dots */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1 h-1 rounded-full bg-green-500/30" />
          <div className="w-1 h-1 rounded-full bg-green-500/20" />
          <div className="w-1 h-1 rounded-full bg-green-500/10" />
        </div>
      </div>
    </div>
  );
}