"use client";

import { useEffect, useRef, useState } from "react";
import { File } from "lucide-react";
import { africanProjects, globalProjects } from "@/lib/data";

const PER_PAGE = 4;

export default function Projects() {
  const [tab, setTab] = useState<"african" | "global">("african");
  const [page, setPage] = useState(1);
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

  const allProjects = tab === "african" ? africanProjects : globalProjects;
  const totalPages = Math.ceil(allProjects.length / PER_PAGE);
  const projects = allProjects.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const switchTab = (t: "african" | "global") => {
    setTab(t);
    setPage(1);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const goToPage = (p: number) => {
    setPage(p);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

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
            onClick={() => switchTab("african")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-[0.15em] uppercase transition-all duration-200 ${
              tab === "african"
                ? "bg-white text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90"
            }`}
          >
            African Focus
          </button>
          <button
            onClick={() => switchTab("global")}
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
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {projects.map((project, i) => (
            <div
              key={project.name}
              className={`relative flex flex-col min-h-[280px] border border-white/[0.15] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-700 ease-out ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Glass background matching WhatsApp bubble */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-white/[0.05] backdrop-blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/10 to-transparent" />
              <div className="relative z-10 p-4 md:p-5 flex flex-col flex-1">
                <div className="mb-2">
                  <span className="inline-block text-[10px] md:text-xs font-mono uppercase rounded-full px-2 py-0.5 border border-yellow-500/30 bg-yellow-500/15 text-yellow-200 mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-xs md:text-sm font-semibold text-white leading-snug">
                    {project.name}
                  </h3>
                </div>
                <p className="text-[10px] md:text-xs text-white/50 font-mono mb-2 leading-relaxed">
                  {project.platforms}
                </p>
                <p className="text-[11px] md:text-sm text-white/60 leading-relaxed mb-3">
                  {project.description}
                </p>
                <button className="w-full mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] md:text-xs font-medium rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 group mt-5">
                  View Project
                  <File className="w-3 h-3 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => { if (page > 1) goToPage(page - 1); }}
              disabled={page === 1}
              className="w-9 h-9 rounded-full text-xs font-medium flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {(() => {
              const maxVisible = 3;
              let start = Math.max(1, page - 1);
              if (start + maxVisible - 1 > totalPages) start = Math.max(1, totalPages - maxVisible + 1);
              const visiblePages = Array.from({ length: Math.min(maxVisible, totalPages) }, (_, i) => start + i);
              return visiblePages.map((p) => (
                <button
                  key={p}
              onClick={() => goToPage(p)}
              className={`w-9 h-9 rounded-full text-xs font-medium transition-all duration-200 ${
                    page === p
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90"
                  }`}
                >
                  {p}
                </button>
              ));
            })()}
            <button
              onClick={() => { if (page < totalPages) goToPage(page + 1); }}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-full text-xs font-medium flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}