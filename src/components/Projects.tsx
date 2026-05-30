"use client";

import { useEffect, useRef, useState } from "react";
import { africanProjects, globalProjects } from "@/lib/data";

export default function Projects() {
  const [tab, setTab] = useState<"african" | "global">("african");
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const projects = tab === "african" ? africanProjects : globalProjects;

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div ref={sectionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className={`flex items-start gap-4 md:gap-6 mb-10 md:mb-14 max-w-2xl mx-auto transition-all duration-1000 ease-out ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              [10]&nbsp;&nbsp;projects
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              PROJECTS
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              I ship
            </p>
          </div>
        </div>

        {/* Tab toggle */}
        <div className={`flex justify-center gap-2 mb-10 transition-all duration-1000 ease-out delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <button
            onClick={() => setTab("african")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-[0.15em] uppercase transition-all duration-200 ${
              tab === "african"
                ? "bg-white text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90"
            }`}
          >
            African Focus
          </button>
          <button
            onClick={() => setTab("global")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-[0.15em] uppercase transition-all duration-200 ${
              tab === "global"
                ? "bg-white text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90"
            }`}
          >
            Global
          </button>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {projects.map((project, i) => (
            <div
              key={project.name}
              className={`flex flex-col bg-white/[0.04] border border-white/10 rounded-xl p-4 md:p-5 transition-all duration-700 ease-out ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-xs md:text-sm font-semibold text-white leading-snug">
                  {project.name}
                </h3>
                <span className="shrink-0 text-[10px] md:text-xs font-mono uppercase rounded-full px-2 py-0.5 border border-yellow-500/30 bg-yellow-500/15 text-yellow-200">
                  {project.category}
                </span>
              </div>
              <p className="text-[10px] md:text-xs text-white/50 font-mono mb-2 leading-relaxed">
                {project.platforms}
              </p>
              <p className="text-[11px] md:text-sm text-white/60 leading-relaxed mb-3">
                {project.description}
              </p>
              <button
                className="w-full mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-[11px] md:text-xs font-medium rounded-lg border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 group"
              >
                View Project
                <svg className="w-3 h-3 text-yellow-400 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}