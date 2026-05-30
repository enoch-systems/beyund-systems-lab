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
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img
            src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780133162/mnteqbivqp3h4rd5umcn.png"
            alt="Logo"
            className="h-6 w-auto"
          />
          <span className="text-base md:text-xl font-light tracking-wide -ml-0.5"><span className="text-white">beyond</span><span className="text-green-300"> systems lab</span></span>
        </a>

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
              href="#projects"
              className="group relative text-[15px] font-medium tracking-[0.12em] text-white/80 transition-all duration-200 hover:text-white"
            >
              Projects
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

          {/* Hamburger — mobile */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}