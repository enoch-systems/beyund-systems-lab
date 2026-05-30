"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero({ children }: { children: React.ReactNode }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-12">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-2 -mb-10 pt-10 md:pt-32 lg:px-8">
        <div className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center">
          <div className="relative z-20 flex flex-col items-center justify-center gap-8">
            <div className="relative mx-auto">
              <div className="relative w-[90vw] h-[90vw] sm:w-[440px] sm:h-[440px] md:w-[520px] md:h-[520px] max-w-[520px] max-h-[520px]">
                {/* Decorative circle outline only */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 540 540" aria-hidden="true">
                  <circle cx="270" cy="270" r="250" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                </svg>

                {/* Marquee: items scroll left-to-right above the circle */}
                <div className="absolute -top-12 sm:-top-14 md:-top-16 left-0 w-full overflow-hidden">
                  <div className="flex whitespace-nowrap animate-marquee">
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Video lessons</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Live Classes</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Assignments</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">PDFs / notes</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Community</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Assignments</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Progress tracking</span>
                    {/* Duplicate for seamless loop */}
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Video lessons</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Live Classes</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Assignments</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">PDFs / notes</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Community</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Assignments</span>
                    <span className="mx-6 sm:mx-8 text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] font-light text-white/70 uppercase tracking-[0.15em]">Progress tracking</span>
                  </div>
                </div>

                {/* Image container — fades in from bottom on mount with glassmorphism */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`relative w-[90%] h-[90%] rounded-full overflow-hidden bg-white/10 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-1000 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>
                    <Image
                      src="https://res.cloudinary.com/djdbcoyot/image/upload/v1777316852/construction/about/eng3.png"
                      alt="Enoch Chukwudi"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left mb-4">
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl animate-slide-in-left">
                Enoch Chukwudi
              </h1>
              <p className="mt-4 text-xl sm:text-2xl md:text-3xl tracking-wide text-white/80 animate-slide-in-right" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
                <span className="font-light">Fullstack Developer</span>
                <span className="block sm:inline text-sm sm:text-base md:text-lg text-white/50 font-thin"> (Mentor at Beyond Systems Lab)</span>
              </p>
              <p className="mt-6 text-sm md:text-base lg:text-lg text-white/60 max-w-2xl mx-auto animate-fade-in-center" style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}>
                Learn fullstack development with me at Beyond Systems Lab, a structured learning program focused on building real world operational systems using modern web technologies.
              </p>
              <div className="mt-8 mb-15 flex flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-white/90 cursor-pointer"
                >
                  Contact Me
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20 cursor-pointer"
                >
                  View Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}