"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { personalData } from "@/lib/data";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div ref={sectionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — image slides in from left */}
          <div
            className={`relative transition-all duration-1000 ease-out ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            }`}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute -inset-4 rounded-3xl bg-black/20 blur-2xl" />
              <div className="relative h-full w-full rounded-3xl bg-white/10 ring-1 ring-white/20 shadow-xl overflow-hidden backdrop-blur-sm">
                <Image
                  src="https://res.cloudinary.com/djdbcoyot/image/upload/v1777316852/construction/about/eng3.png"
                  alt={personalData.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right — text slides in from right, location/timezone fade from center */}
          <div>
            <div className="flex items-start gap-4 md:gap-6 mb-10 md:mb-14 max-w-2xl mx-auto">
              <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
              <div>
                <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
                  about
                </p>
                <h2
                  className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none transition-all duration-1000 ease-out delay-100 ${
                    visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
                  }`}
                >
                  About Us
                </h2>
              </div>
            </div>
            <div
              className={`space-y-4 transition-all duration-1000 ease-out delay-200 ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
              }`}
            >
              <p className="text-white/70 leading-relaxed">
                Learn fullstack development with us at Beyund systems labs, a structured learning program focused on building real world operational systems using modern web technologies.
              </p>
              
              <p className="text-white/70 leading-relaxed">
                We teach how to design APIs, business workflows, transaction systems, authentication flows, and scalable backend architectures while also building clean frontend experiences.
              </p>
              
              <p className="text-white/70 leading-relaxed">
                Our curriculum covers fintech systems, logistics operations, fraud aware workflows, and fullstack applications with structured architecture, everything you need to ship production grade software.
              </p>

              {/* What You Stand to Get */}
              <div className="mt-6 p-5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white text-sm font-bold">
                    ✓
                  </span>
                  <div>
                    <p className="text-base md:text-lg text-white leading-relaxed font-semibold mb-4">
                      What you stand to get
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/70 leading-relaxed">
                          <span className="text-white font-semibold mr-2">1.</span> Hands on training on real world projects that prepare you for freelance and full time roles.
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/70 leading-relaxed">
                          <span className="text-white font-semibold mr-2">2.</span> You will build a portfolio of production grade systems, get mentorship from an experienced engineer, and gain the confidence to work on any fullstack application independently.
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/70 leading-relaxed">
                          <span className="text-white font-semibold mr-2">3.</span> Become freelance ready and develop your own things.
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/70 leading-relaxed">
                          <span className="text-white font-semibold mr-2">4.</span> Start your freelance journey with resilience and deeper mastery.
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/70 leading-relaxed">
                          <span className="text-white font-semibold mr-2">5.</span> Job possibility with resilience and deeper mastery.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`mt-10 space-y-4 transition-all duration-1000 ease-out delay-500 ${
              visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/80">
                  <span className="font-semibold">Location:</span> Nigeria Remote
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80">
                  <span className="font-semibold">Classes:</span> Virtual
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80">
                  <span className="font-semibold">Timezone:</span> {personalData.timezone}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}