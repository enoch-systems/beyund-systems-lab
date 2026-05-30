"use client";

import { useEffect, useRef, useState } from "react";
import { File } from "lucide-react";

const featuredProjects = [
  {
    name: "National Logistics Visibility Platform",
    category: "SaaS",
    platforms: "Web Dashboard + Mobile App + API Platform",
    description: "Interstate shipment visibility with real-time tracking across multiple carriers.",
  },
  {
    name: "Distributed Fraud Intelligence Network",
    category: "Fintech",
    platforms: "Web Dashboard + API Platform",
    description: "Shared fraud detection across financial institutions with ML-powered scoring.",
  },
  {
    name: "Merchant Operating System",
    category: "B2B",
    platforms: "Web Dashboard + Mobile App + POS",
    description: "Inventory, sales, accounting — all-in-one merchant management platform.",
  },
];

export default function Projects() {
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
              what you should be able to build
            </p>
          </div>
        </div>

        {/* Project grid - 3 featured projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
          {featuredProjects.map((project, i) => (
            <div
              key={project.name}
              className={`relative flex flex-col min-h-[280px] border border-white/[0.15] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-700 ease-out ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
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
                <button className="w-full mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] md:text-xs font-medium rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 group cursor-pointer">
                  View Project
                  <File className="w-3 h-3 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}