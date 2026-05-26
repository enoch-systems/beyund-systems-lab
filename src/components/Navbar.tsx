"use client";

import { useState, useEffect } from "react";
import MobileMenu from "./MobileMenu";

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
          ? "bg-black/30 backdrop-blur-xl border-b border-white/[0.08]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left spacer / logo area */}
        <div />

        {/* Right side: links + button */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10 xl:gap-12">
            <a
              href="#about"
              className="group relative text-[15px] font-medium tracking-[0.12em] text-white/80 transition-all duration-200 hover:text-white"
            >
              About
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#skills"
              className="group relative text-[15px] font-medium tracking-[0.12em] text-white/80 transition-all duration-200 hover:text-white"
            >
              Skills
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#contact"
              className="group relative text-[15px] font-medium tracking-[0.12em] text-white/80 transition-all duration-200 hover:text-white"
            >
              Contact Me
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          {/* Download CV button — desktop */}
          <a
            href="#"
            className="hidden md:group inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-medium tracking-[0.08em] text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-black hover:border-white hover:shadow-xl hover:shadow-white/20"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download CV</span>
          </a>

          {/* Hamburger — mobile */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}