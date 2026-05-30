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

        {/* Right side — empty, just pushes logo left */}
        <div />
      </div>
    </nav>
  );
}