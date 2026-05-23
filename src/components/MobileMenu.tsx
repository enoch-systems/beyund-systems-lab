"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "#", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#case-studies", label: "Case Studies" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden relative inline-flex items-center justify-center p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden transition-opacity duration-300"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 shadow-2xl z-50 md:hidden transform transition-all duration-300 ease-out">
            <div className="flex flex-col h-full min-h-screen">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white tracking-tight">Navigation</h2>
                <button
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-6 py-6 bg-gray-900 overflow-y-auto">
                <ul className="space-y-2">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block px-4 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 font-medium text-lg"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="px-6 py-5 border-t border-gray-800 bg-gray-900/50">
                <a
                  href="#"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download CV
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
