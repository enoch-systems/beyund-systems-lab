"use client";

import { useState } from "react";

const layersData = [
  {
    name: "Client Layer",
    build: ["responsive UIs", "component architecture", "state management"],
    tools: ["Next.js", "React", "Flutter"],
    concepts: ["SSR / SSG / ISR", "auth flows (JWT / OAuth2)", "role-based UI"],
  },
  {
    name: "Communication / API Layer",
    build: ["RESTful endpoints", "real-time connections", "webhooks"],
    tools: ["Express.js", "Hono", "FastAPI", "tRPC"],
    concepts: ["versioning", "middleware chains", "rate limiting", "request validation"],
  },
  {
    name: "Backend / Application Logic Layer",
    build: ["service modules", "business rules", "multi-tenant architecture"],
    tools: ["Node.js", "NestJS", "Next.js API Routes"],
    concepts: ["separation of concerns", "event-driven design", "dependency injection"],
  },
  {
    name: "Data Access Layer",
    build: ["data modeling", "query optimization", "schema migrations"],
    tools: ["Prisma", "Drizzle", "Supabase (PostgREST)"],
    concepts: ["ORM vs raw SQL tradeoffs", "query optimization", "type-safe queries"],
  },
  {
    name: "Storage Layer",
    build: ["file upload pipelines", "image optimization", "caching strategies"],
    tools: ["PostgreSQL", "Redis", "Cloudinary"],
    concepts: ["ACID transactions", "indexing strategy", "cache invalidation"],
  },
  {
    name: "Workflow / Background Jobs Layer",
    build: ["email automation", "scheduled tasks", "async processing"],
    tools: ["BullMQ", "Inngest", "Puppeteer"],
    concepts: ["job queues", "retry & backoff", "idempotency"],
  },
  {
    name: "Integration Layer",
    build: ["payment flows", "third-party syncs", "webhook handlers"],
    tools: ["Stripe", "Clerk / Auth0", "Resend"],
    concepts: ["OAuth 2.0 flows", "webhook verification (HMAC)", "idempotent payments"],
  },
  {
    name: "Monitoring / Observability Layer",
    build: ["error tracking", "usage analytics", "logging pipelines"],
    tools: ["Sentry", "PostHog", "OpenTelemetry"],
    concepts: ["structured logging", "error alerting", "observability"],
  },
  {
    name: "Architecture Layer",
    build: ["project scaffolding", "CI/CD pipelines", "deployment configs"],
    tools: ["Vercel", "Docker", "GitHub Actions", "Turborepo"],
    concepts: ["serverless vs containerized", "zero-downtime deploys", "scalability planning"],
  },
];

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm lg:text-base font-medium rounded-full border border-white/15 bg-white/[0.07] text-white/70">
      {label}
    </span>
  );
}

export default function Layers() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Start first open

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

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
    "border-blue-500/20 group-hover:border-blue-500/40",
    "border-cyan-500/20 group-hover:border-cyan-500/40",
    "border-teal-500/20 group-hover:border-teal-500/40",
    "border-emerald-500/20 group-hover:border-emerald-500/40",
    "border-green-500/20 group-hover:border-green-500/40",
    "border-yellow-500/20 group-hover:border-yellow-500/40",
    "border-orange-500/20 group-hover:border-orange-500/40",
    "border-red-500/20 group-hover:border-red-500/40",
    "border-purple-500/20 group-hover:border-purple-500/40",
  ];

  return (
    <section id="layers" className="relative overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:py-20 lg:px-8">
        {/* Title */}
        <div className="flex items-start gap-4 md:gap-6 mb-10 md:mb-14 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              the architecture
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              The Full Stack{" "}
              <span className="text-green-300">Stack</span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              Every layer of a production system. You build them all.
            </p>
          </div>
        </div>

        {/* Architecture stack — visual layers from bottom (storage) to top (client) */}
        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {/* Visual stack indicator */}
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-400 via-green-400 to-purple-400" />
            <div>
              <p className="text-xs font-mono tracking-[0.2em] text-white/40 uppercase">
                Production architecture
              </p>
              <p className="text-xs text-white/30">Click any layer to explore what you build and learn</p>
            </div>
          </div>

          {layersData.map((layer, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={layer.name}
                className={`group rounded-2xl border bg-gradient-to-r ${layerColors[i]} backdrop-blur-sm overflow-hidden transition-all duration-300 ${
                  isOpen ? layerAccents[i] : "border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-5 md:px-7 py-4 md:py-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    {/* Layer number badge */}
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold transition-all duration-300 ${
                      isOpen
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/70"
                    }`}>
                      {i + 1}
                    </span>
                    <span className={`text-sm md:text-base lg:text-lg font-medium tracking-[0.2em] md:tracking-[0.25em] uppercase transition-colors duration-200 ${
                      isOpen ? "text-white" : "text-white/60 group-hover:text-white/90"
                    }`}>
                      {layer.name}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 md:w-6 md:h-6 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-white" : "text-white/50"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 md:px-7 pb-6 md:pb-7 space-y-4 md:space-y-5 border-t border-white/10 pt-4 md:pt-5">
                    <div>
                      <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/35 mb-2.5 font-mono">what you learn</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.build.map((item) => (
                          <Pill key={item} label={item} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/35 mb-2.5 font-mono">tools you use</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.tools.map((tool) => (
                          <span key={tool} className="inline-block px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm lg:text-base font-medium rounded-full border border-green-500/30 bg-green-500/15 text-green-200">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/35 mb-2.5 font-mono">concepts you master</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.concepts.map((concept) => (
                          <Pill key={concept} label={concept} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}