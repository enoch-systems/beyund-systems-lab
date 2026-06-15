"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-2xl border-b border-white/[0.08]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo — blended image + text */}
        <a href="#" className="flex items-center group">
          <div className="relative flex items-center">
            {/* Logo image with gradient mask to seamlessly fade into text */}
            <img
              src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
              alt="Beyund Labs Academy logo"
              className="h-7 w-auto md:h-9 lg:h-11 shrink-0"
              style={{
                maskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
              }}
            />
            {/* Text overlapping the faded edge for seamless blend */}
            <div
              className="flex items-baseline -ml-2 md:-ml-2.5 lg:-ml-3 mix-blend-screen select-none"
              style={{ textShadow: "0 0 30px rgba(255,255,255,0.08)" }}
            >
              <span className="text-white text-base md:text-xl lg:text-2xl font-light tracking-wide group-hover:text-white transition-colors duration-300">
                eyund
              </span>
              <span
                className="text-slate-300/90 group-hover:text-slate-200 transition-colors duration-300 ml-1 text-sm md:text-lg lg:text-xl font-mono"
                style={{ fontVariant: "small-caps" }}
              >
                𝙻𝚊𝚋𝚜.
              </span>
              <span className="group-hover:text-green-300 transition-colors duration-300 ml-1 font-light tracking-widest uppercase flex items-baseline">
                <span className="text-green-400/80 text-sm md:text-lg lg:text-xl font-normal">A</span>
                <span className="text-green-300/80 text-xs md:text-sm lg:text-base">cademy</span>
              </span>
            </div>
          </div>
        </a>

        {/* Right side — Student Portal link */}
        <div className="flex items-center">
          <a
            href="/students-portal/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-medium text-white/80 hover:text-white bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] hover:border-white/[0.20] rounded-lg transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            Student Portal
          </a>
        </div>
      </div>
    </nav>
  );
}