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
            <h2
              className={`text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6 transition-all duration-1000 ease-out delay-100 ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
              }`}
            >
              <a href="#contact" className="hover:text-green-300 transition-colors duration-200 group">
                About Us
                <span className="inline-block ml-2 text-lg text-white/30 group-hover:text-green-300 transition-colors duration-200">→</span>
              </a>
            </h2>
            <div
              className={`space-y-4 transition-all duration-1000 ease-out delay-200 ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
              }`}
            >
              <p className="text-lg text-white/70 leading-relaxed">
                Learn fullstack development with us at <span className="text-green-300 font-semibold">Beyond Systems Lab</span>, a structured learning program focused on building real world operational systems using modern web technologies.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                We teach how to design APIs, business workflows, transaction systems, authentication flows, and scalable backend architectures while also building clean frontend experiences.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                Our curriculum covers fintech systems, logistics operations, fraud aware workflows, and fullstack applications with structured architecture, everything you need to ship production grade software.
              </p>
              <div className="mt-6 p-4 md:p-5 rounded-xl border border-green-500/30 bg-green-500/10">
                <p className="text-base md:text-lg text-green-200 leading-relaxed font-medium">
                  Become freelance ready and job ready with further mastery. After completing our program you will have the skills and portfolio to take on real world freelance projects or land a full time role as a fullstack developer.
                </p>
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