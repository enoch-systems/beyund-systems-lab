"use client";

import { useState } from "react";

const layersData = [
  {
    name: "Client Layer",
    build: ["web apps", "dashboards", "mobile apps", "admin panels"],
    tools: ["Next.js", "React", "Flutter"],
    concepts: ["SSR / SSG / ISR", "auth flows (JWT / OAuth2)", "role-based UI"],
  },
  {
    name: "Communication / API Layer",
    build: ["REST APIs", "real-time endpoints", "webhooks"],
    tools: ["Express.js", "Hono", "FastAPI", "tRPC"],
    concepts: ["versioning", "middleware chains", "rate limiting", "request validation"],
  },
  {
    name: "Backend / Application Logic Layer",
    build: ["business logic", "service modules", "multi-tenant systems"],
    tools: ["Node.js", "NestJS", "Next.js API Routes"],
    concepts: ["separation of concerns", "event-driven design", "dependency injection"],
  },
  {
    name: "Data Access Layer",
    build: ["data models", "query layers", "migrations"],
    tools: ["Prisma", "Drizzle", "Supabase (PostgREST)"],
    concepts: ["ORM vs raw SQL tradeoffs", "query optimization", "type-safe queries"],
  },
  {
    name: "Storage Layer",
    build: ["file uploads", "image pipelines", "caching layers"],
    tools: ["PostgreSQL", "Redis", "Cloudinary"],
    concepts: ["ACID transactions", "indexing strategy", "cache invalidation"],
  },
  {
    name: "Workflow / Background Jobs Layer",
    build: ["email pipelines", "scheduled tasks", "async processing"],
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
    name: "Intelligence / Monitoring Layer",
    build: ["error tracking", "usage analytics", "logging pipelines"],
    tools: ["Sentry", "PostHog", "OpenAI / Anthropic APIs"],
    concepts: ["structured logging", "error alerting", "RAG pipelines"],
  },
  {
    name: "Architecture Layer",
    build: ["project scaffolds", "CI/CD pipelines", "deployment configs"],
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="layers" className="relative overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:py-20 lg:px-8">
        {/* Title */}
        <div className="flex items-start gap-4 md:gap-6 mb-10 md:mb-14 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              [09]&nbsp;&nbsp;the stack
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              LAYERS
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              I work on
            </p>
          </div>
        </div>

        {/* Simple accordion list */}
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-5">
          {layersData.map((layer, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={layer.name} className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-5 md:px-7 py-4 md:py-5 text-left group"
                >
                  <span className={`text-sm md:text-base lg:text-lg font-medium tracking-[0.2em] md:tracking-[0.25em] uppercase transition-colors duration-200 ${isOpen ? "text-white" : "text-white/60 group-hover:text-white/90"}`}>
                    {layer.name}
                  </span>
                  <svg
                    className={`w-5 h-5 md:w-6 md:h-6 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-yellow-300" : "text-yellow-300/50"}`}
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
                      <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/35 mb-2.5 font-mono">what i build</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.build.map((item) => (
                          <Pill key={item} label={item} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/35 mb-2.5 font-mono">tools i use</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.tools.map((tool) => (
                          <span key={tool} className="inline-block px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm lg:text-base font-medium rounded-full border border-yellow-500/30 bg-yellow-500/15 text-yellow-200">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/35 mb-2.5 font-mono">concepts i consider</p>
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