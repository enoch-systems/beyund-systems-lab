"use client";

import { useState, useEffect, useCallback } from "react";

const layersData = [
  {
    name: "Client Layer",
    build: ["responsive UIs", "component architecture", "state management"],
    tools: ["Next.js", "React", "Tailwind CSS", "Flutter"],
    concepts: ["SSR / SSG / ISR", "auth flows (JWT / OAuth2)", "role-based UI"],
  },
  {
    name: "Communication / API Layer",
    build: ["RESTful endpoints", "real-time connections", "webhooks"],
    tools: ["Firebase", "Supabase", "Express.js", "Hono", "tRPC"],
    concepts: ["versioning", "middleware chains", "rate limiting", "request validation"],
  },
  {
    name: "Backend / Application Logic Layer",
    build: ["service modules", "business rules", "multi-tenant architecture"],
    tools: ["Node.js", "Next.js API Routes", "NestJS"],
    concepts: ["separation of concerns", "event-driven design", "dependency injection"],
  },
  {
    name: "Data Access Layer",
    build: ["data modeling", "query optimization", "schema migrations"],
    tools: ["Firebase Firestore", "Supabase", "Prisma", "Drizzle"],
    concepts: ["ORM vs raw SQL tradeoffs", "query optimization", "type-safe queries"],
  },
  {
    name: "Storage Layer",
    build: ["file upload pipelines", "image optimization", "caching strategies"],
    tools: ["Supabase Storage", "Cloudinary", "PostgreSQL", "Redis"],
    concepts: ["ACID transactions", "indexing strategy", "cache invalidation"],
  },
  {
    name: "Workflow / Background Jobs Layer",
    build: ["email automation", "scheduled tasks", "async processing"],
    tools: ["Firebase Cloud Functions", "Supabase Edge Functions", "BullMQ", "Inngest"],
    concepts: ["job queues", "retry & backoff", "idempotency"],
  },
  {
    name: "Integration Layer",
    build: ["payment flows", "third-party syncs", "webhook handlers"],
    tools: ["Firebase Auth", "Supabase Auth", "Stripe", "Clerk / Auth0"],
    concepts: ["OAuth 2.0 flows", "webhook verification (HMAC)", "idempotent payments"],
  },
  {
    name: "Monitoring / Observability Layer",
    build: ["error tracking", "usage analytics", "logging pipelines"],
    tools: ["Sentry", "PostHog", "Google Analytics", "OpenTelemetry"],
    concepts: ["structured logging", "error alerting", "observability"],
  },
  {
    name: "Architecture Layer",
    build: ["project scaffolding", "CI/CD pipelines", "deployment configs"],
    tools: ["Vercel", "Netlify", "Docker", "GitHub Actions", "Turborepo"],
    concepts: ["serverless vs containerized", "zero-downtime deploys", "scalability planning"],
  },
];

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs lg:text-sm font-normal rounded-full border border-white/15 bg-white/[0.07] text-white/70">
      {label}
    </span>
  );
}

const layerColors = [
  "from-blue-500/10 to-blue-500/5",
  "from-cyan-500/10 to-cyan-500/5",
  "from-teal-500/10 to-teal-500/5",
  "from-emerald-500/10 to-emerald-500/5",
  "from-green-500/10 to-green-500/5",
  "from-yellow-500/10 to-yellow-500/5",
  "from-orange-500/10 to-orange-500/5",
  "from-red-500/10 to-red-500/5",
  "from-purple-500/10 to-purple-500/5",
];

const layerAccents = [
  "border-blue-500/30",
  "border-cyan-500/30",
  "border-teal-500/30",
  "border-emerald-500/30",
  "border-green-500/30",
  "border-yellow-500/30",
  "border-orange-500/30",
  "border-red-500/30",
  "border-purple-500/30",
];

const numberColors = [
  "bg-blue-500/20 text-blue-300",
  "bg-cyan-500/20 text-cyan-300",
  "bg-teal-500/20 text-teal-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-green-500/20 text-green-300",
  "bg-yellow-500/20 text-yellow-300",
  "bg-orange-500/20 text-orange-300",
  "bg-red-500/20 text-red-300",
  "bg-purple-500/20 text-purple-300",
];

export default function Layers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = layersData.length;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [goNext, isPaused]);

  const layer = layersData[currentIndex];

  return (
    <section
      id="layers"
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:py-20 lg:px-8">
        {/* Title */}
        <div className="flex items-start gap-4 md:gap-6 mb-10 md:mb-14 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              the fullstack toolkit
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-none">
              Everything You Will{" "}
              <span className="text-green-300">Learn to Use</span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              From frontend to database. You touch every layer.
            </p>
          </div>
        </div>

        {/* Carousel container */}
        <div className="max-w-5xl mx-auto">
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/60 transition-all duration-700 ease-in-out"
                style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/40 whitespace-nowrap">
              {currentIndex + 1} / {totalSlides}
            </span>
          </div>

          {/* Slide area */}
          <div className="relative">
            {/* Left Chevron */}
            <button
              onClick={goPrev}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/15 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all duration-200"
              aria-label="Previous layer"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Chevron */}
            <button
              onClick={goNext}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/15 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all duration-200"
              aria-label="Next layer"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Card */}
            <div
              key={currentIndex}
              className={`rounded-2xl border bg-gradient-to-r ${layerColors[currentIndex]} backdrop-blur-sm overflow-hidden transition-all duration-500 ease-in-out ${layerAccents[currentIndex]}`}
            >
              {/* Header */}
              <div className="px-5 md:px-7 py-5 md:py-6">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                  <span className={`flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl text-sm md:text-base font-normal ${numberColors[currentIndex]}`}>
                    {currentIndex + 1}
                  </span>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-normal tracking-[0.2em] md:tracking-[0.25em] uppercase text-white">
                    {layer.name}
                  </h3>
                </div>

                {/* Details */}
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/35 mb-2 font-mono">what you learn</p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {layer.build.map((item) => (
                        <Pill key={item} label={item} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/35 mb-2 font-mono">tools you use</p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {layer.tools.map((tool) => (
                        <span key={tool} className="inline-block px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs lg:text-sm font-normal rounded-full border border-green-500/30 bg-green-500/15 text-green-200">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/35 mb-2 font-mono">concepts you master</p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {layer.concepts.map((concept) => (
                        <Pill key={concept} label={concept} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {layersData.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-6 h-2 bg-white/70"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to layer ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}