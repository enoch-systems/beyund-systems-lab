"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const mentorshipPoints: { icon: React.ReactNode; title: string; desc: string }[] = [];

export default function MeetTheMentor() {
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
    <section id="mentor" className="relative overflow-hidden py-20 md:py-28">
      <div ref={sectionRef} className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 ">
        {/* Section header */}
        <div className="flex items-start gap-4 md:gap-6 mb-12 md:mb-16 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              why Enoch created this program
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-none">
              The Mentor
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              Someone who has been where you are
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Image */}
          <div
            className={`transition-all duration-1000 ease-out ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            }`}
          >
            <div className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0">
              {/* Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-white/5 blur-2xl" />
              <div className="relative h-full w-full rounded-3xl bg-white/[0.06] ring-1 ring-white/15 shadow-xl overflow-hidden backdrop-blur-sm">
                <Image
                  src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780761367/p1jq9al0zrcd89wuah15.jpg"
                  alt="Enoch Chukwudi, Mentor"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {/* Quote instantly below image */}
            <div className="text-center mt-6">
              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                &ldquo;The insight almost never comes from inside your own world. Friction between domains is where vision lives.&rdquo;
                <br />
                <span className="not-italic text-white/40">_ Enoch</span>
              </p>
            </div>
          </div>

          {/* Right — Content */}
          <div
            className={`space-y-6 transition-all duration-1000 ease-out delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-normal text-white">
              Built for beginners, backed by real experience
            </h3>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              Enoch started exactly where you are. Self taught. Building side projects. Figuring
              things out one error at a time. He went on to build and ship systems across fintech,
              logistics, identity and enterprise. But more importantly he has learned how to{" "}
              <strong className="text-white/90">teach what took him years to figure out.</strong>
            </p>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
            His approach is simple. You do not need to master everything at once. You start with the
            frontend, something visual and rewarding. Then you layer in authentication, databases
            and deployment step by step. Firebase, Supabase, Next.js, Tailwind. Tools that
            let you <em className="text-white/80">build real things without feeling overwhelmed.</em>
            </p>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
            At Beyund Labs Academy he has built a curriculum that takes you from &ldquo;I can
            follow a tutorial&rdquo; to &ldquo;I built this app from scratch and it is live.&rdquo;
            No gatekeeping. No assumed knowledge. Just a clear path forward.
            </p>

            {/* Mentorship highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
              {mentorshipPoints.map((point, i) => (
                <div
                  key={point.title}
                  className={`p-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-700 ease-out ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: `${400 + i * 150}ms`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/15 text-green-300">
                      {point.icon}
                    </span>
                    <div>
                      <p className="text-sm font-normal text-white mb-1">{point.title}</p>
                      <p className="text-xs text-white/60 leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              className={`-pt-6 transition-all duration-1000 ease-out delay-[800ms] ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-0 px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 text-sm font-normal"
              >
                Join Cohort 1 and start building
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}