"use client";

import { useEffect, useState } from "react";

export default function PricingBadge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed right-0 md:right-4 top-28 md:top-32 z-40 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
      }`}
    >
      <div className="relative group">
        {/* Main badge body - slanted right side */}
        <div
          className="relative bg-gradient-to-b from-green-900 to-green-950 border border-green-500/25 pl-3 md:pl-4 pr-5 md:pr-6 py-2 md:py-2.5 shadow-lg shadow-green-500/10"
          style={{
            clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
          }}
        >
          {/* Inner border accent */}
          <div
            className="absolute inset-[1px] border border-green-400/10 pointer-events-none"
            style={{
              clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
            }}
          />

          {/* Top light streak */}
          <div className="absolute top-0 left-0 right-4 h-px bg-gradient-to-r from-green-400/30 via-green-400/20 to-transparent" />

          {/* Content */}
          <div className="relative flex items-center gap-2 md:gap-2.5">
            {/* Left accent bar */}
            <div className="w-0.5 h-8 md:h-9 bg-gradient-to-b from-green-400 to-green-600 rounded-full" />

            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] font-mono tracking-[0.25em] text-green-400/60 uppercase leading-tight">
                Cohort 1
              </span>
              <span className="text-lg md:text-xl font-normal text-green-300 leading-tight tracking-tight">
                ₦60,000
              </span>
              <span className="text-[8px] md:text-[9px] text-white/40 font-mono tracking-wide leading-tight">
                12 weeks &middot; ₦5k/week
              </span>
            </div>
          </div>
        </div>

        {/* Hover tooltip - subtle */}
        <div className="absolute -bottom-6 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[9px] text-green-400/50 font-mono whitespace-nowrap">
            first intake pricing
          </span>
        </div>
      </div>
    </div>
  );
}