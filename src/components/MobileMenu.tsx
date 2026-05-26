"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact Me" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button — sits in navbar */}
      <button
        onClick={toggleMenu}
        className="md:hidden relative inline-flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="sr-only">Menu</span>
        <span className="absolute flex flex-col gap-[5px] items-center justify-center w-5">
          <span
            className={`block h-px w-5 bg-current transition-all duration-300 origin-center ${
              isOpen ? "rotate-45 translate-y-[3px]" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-current transition-all duration-300 ${
              isOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-current transition-all duration-300 origin-center ${
              isOpen ? "-rotate-45 -translate-y-[3px]" : ""
            }`}
          />
        </span>
      </button>

      {/* FULL-SCREEN OVERLAY — rendered via portal to document.body to avoid parent stacking context issues */}
      {mounted && createPortal(
        <div
          className={`fixed inset-0 md:hidden transition-all duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{ zIndex: 9999 }}
        >
          {/* Dark backdrop — fully opaque black */}
          <div
            className="absolute inset-0 bg-black"
            onClick={closeMenu}
          />

          {/* Menu panel — solid dark background, no blur filter */}
          <div className="absolute inset-0 flex flex-col px-8 py-8 bg-[#0a0a0a]">
            {/* Close button — top-right */}
            <div className="flex justify-end">
              <button
                onClick={closeMenu}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Close menu"
              >
                <span className="relative flex items-center justify-center w-5 h-5">
                  <span className="absolute block h-px w-5 bg-current rotate-45" />
                  <span className="absolute block h-px w-5 bg-current -rotate-45" />
                </span>
              </button>
            </div>

            {/* Nav links — centered */}
            <nav className="flex-1 flex flex-col justify-center">
              <ul className="space-y-0">
                {navItems.map((item, index) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="block py-7 border-b border-white/[0.06]"
                      style={{
                        transitionDelay: isOpen ? `${100 + index * 80}ms` : "0ms",
                        transitionDuration: "400ms",
                        transitionTimingFunction: "ease-out",
                        transitionProperty: "opacity, transform",
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? "translateY(0)" : "translateY(16px)",
                      }}
                    >
                      <span className="block text-[34px] sm:text-[40px] font-semibold tracking-[0.08em] text-white/90 transition-colors duration-200 hover:text-white">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Download CV */}
              <div
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(16px)",
                  transitionDelay: "400ms",
                  transitionDuration: "400ms",
                  transitionTimingFunction: "ease-out",
                  transitionProperty: "opacity, transform",
                }}
              >
                <a
                  href="#"
                  onClick={closeMenu}
                  className="mt-12 flex items-center justify-center gap-3 w-full rounded-xl border border-white/40 bg-transparent px-6 py-4 text-lg font-medium tracking-[0.06em] text-white transition-all duration-200 hover:bg-white hover:text-black hover:border-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download CV</span>
                </a>
              </div>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
