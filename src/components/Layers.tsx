"use client";

import { useState } from "react";

const layersData = [
  {
    name: "Client Layer",
    dotColor: "bg-blue-400 ring-blue-400/30",
    toolColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    build: ["web apps", "dashboards", "landing pages", "mobile apps", "admin panels"],
    tools: ["Next.js", "React", "Flutter", "React Native"],
    concepts: ["SSR / SSG / ISR", "auth flows (JWT / OAuth2)", "responsive design", "API consumption", "state management", "role-based UI"],
  },
  {
    name: "Communication / API Layer",
    dotColor: "bg-teal-400 ring-teal-400/30",
    toolColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    build: ["REST APIs", "real-time endpoints", "API docs", "webhooks", "business email setup"],
    tools: ["Express.js", "Hono", "FastAPI", "tRPC", "Supabase Realtime", "Firebase Realtime DB", "IMAP / SMTP", "OpenAPI / Swagger"],
    concepts: ["versioning", "middleware chains", "rate limiting", "request validation", "error envelopes", "CORS", "email parsing & routing", "MX / DNS record config"],
  },
  {
    name: "Backend / Application Logic Layer",
    dotColor: "bg-purple-400 ring-purple-400/30",
    toolColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    build: ["business logic", "server actions", "service modules", "multi-tenant systems", "email-to-receipt pipelines", "document generation logic"],
    tools: ["Node.js", "NestJS", "Next.js API Routes", "Supabase Edge Functions", "Firebase Cloud Functions", "Deno"],
    concepts: ["separation of concerns", "dependency injection", "event-driven design", "role & permission logic", "message parsing & extraction", "structured data transformation", "feature flags"],
  },
  {
    name: "Data Access Layer",
    dotColor: "bg-orange-400 ring-orange-400/30",
    toolColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    build: ["data models", "query layers", "RLS policies", "migrations"],
    tools: ["Supabase (PostgREST)", "Firebase Firestore", "Prisma", "Drizzle", "Kysely"],
    concepts: ["Row Level Security (RLS)", "Firestore security rules", "ORM vs raw SQL tradeoffs", "connection pooling (PgBouncer)", "query optimization", "type-safe queries"],
  },
  {
    name: "Storage Layer",
    dotColor: "bg-green-400 ring-green-400/30",
    toolColor: "bg-green-500/20 text-green-300 border-green-500/30",
    build: ["file uploads", "image pipelines", "user-scoped storage", "generated PDF storage", "caching layers"],
    tools: ["PostgreSQL", "Supabase Storage", "Firebase Storage", "Cloudinary", "Redis", "AWS S3", "Cloudflare R2"],
    concepts: ["ACID transactions", "indexing strategy", "CDN + signed URLs", "image transforms (crop, resize, format)", "cache invalidation", "storage buckets & policies"],
  },
  {
    name: "Workflow / Background Jobs Layer",
    dotColor: "bg-amber-400 ring-amber-400/30",
    toolColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    build: ["email pipelines", "scheduled tasks", "async processing", "notification systems", "PDF generation jobs", "inbound email processing"],
    tools: ["BullMQ", "Inngest", "Trigger.dev", "Supabase pg_cron", "Firebase Cloud Messaging", "Resend", "Puppeteer / Playwright"],
    concepts: ["job queues", "retry & backoff", "idempotency", "cron scheduling", "dead-letter handling", "event-driven triggers", "headless PDF rendering"],
  },
  {
    name: "Integration Layer",
    dotColor: "bg-pink-400 ring-pink-400/30",
    toolColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    build: ["payment flows", "third-party syncs", "webhook handlers", "OAuth connections", "end-to-end email automation", "message-to-document flows"],
    tools: ["Stripe", "Twilio", "Resend", "SendGrid", "Zapier / Make", "Clerk / Auth0", "Firebase Auth", "Cloudinary Upload API", "Google Workspace API", "Nodemailer"],
    concepts: ["webhook verification (HMAC)", "OAuth 2.0 flows", "IMAP polling & push (IDLE)", "email parsing (MIME)", "receipt / invoice generation", "PDF export & delivery", "idempotent payments", "API key management"],
  },
  {
    name: "Intelligence / Monitoring Layer",
    dotColor: "bg-sky-400 ring-sky-400/30",
    toolColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    build: ["error tracking", "usage analytics", "AI-powered features", "logging pipelines"],
    tools: ["Sentry", "PostHog", "Firebase Analytics", "OpenAI / Anthropic APIs", "Langchain", "Logtail / Axiom"],
    concepts: ["structured logging", "error alerting", "RAG pipelines", "embeddings & vector search", "product analytics"],
  },
  {
    name: "Architecture Layer",
    dotColor: "bg-slate-400 ring-slate-400/30",
    toolColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    build: ["full project scaffolds", "CI/CD pipelines", "deployment configs", "monorepos"],
    tools: ["Vercel", "Railway", "Docker", "GitHub Actions", "Turborepo", "AWS (EC2 / Lambda)"],
    concepts: ["serverless vs containerized", "monorepo structure", "environment management", "zero-downtime deploys", "scalability planning"],
  },
];

function Pill({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[10px] md:text-xs font-medium rounded-full border transition-colors duration-200 ${className || "bg-white/10 text-white/70 border-white/20"}`}
    >
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
        {/* --- TASK 1: EDITORIAL STAGGERED TITLE --- */}
        <div className="flex items-start gap-4 md:gap-6 mb-10 md:mb-14 max-w-2xl mx-auto">
          {/* Accent vertical rule */}
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

        {/* --- TASKS 2 & 3: TIMELINE WITH ACCORDION --- */}
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical trunk line — more visible with gradient */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-white/30 via-white/10 to-white/5" />

          {layersData.map((layer, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={layer.name} className="relative">
                {/* Subtle divider between collapsed rows */}
                {i > 0 && (
                  <div className="ml-12 h-px bg-white/5 my-1" />
                )}

                {/* Branch wire from trunk to dot — brighter on hover */}
                <div className={`absolute left-[18px] top-[22px] w-[18px] h-px transition-colors duration-300 ${isOpen ? "bg-white/40" : "bg-white/20"}`} />

                {/* Dot — larger, with pulse on open */}
                <div className="relative z-10 shrink-0 w-6 flex justify-center pt-3">
                  <div className={`w-3 h-3 rounded-full ring-[4px] transition-all duration-300 ${layer.dotColor} ${isOpen ? "scale-110" : ""}`} />
                </div>

                {/* Clickable row */}
                <button
                  onClick={() => toggle(i)}
                  className={`relative z-10 w-full text-left ml-4 -mt-[26px] pl-0 cursor-pointer group rounded-lg transition-all duration-200 ${
                    isOpen
                      ? "bg-white/5 py-2.5 px-3 -ml-1"
                      : "py-2.5 px-3 -ml-1 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs md:text-sm font-medium tracking-[0.25em] md:tracking-[0.3em] uppercase transition-colors duration-200 ${
                        isOpen ? "text-white" : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {layer.name}
                    </span>
                    {/* Chevron — more visible, consistently right-aligned */}
                    <svg
                      className={`w-4 h-4 transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 text-white/60"
                          : "text-white/30 group-hover:text-white/60"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expandable content */}
                <div
                  className={`overflow-hidden transition-all duration-400 ease-in-out ml-3 ${
                    isOpen ? "max-h-[800px] opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-8 border-l border-white/15 pb-4 space-y-3.5">
                    {/* What you build */}
                    <div>
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/40 mb-1.5 font-mono">what you build</p>
                      <div className="flex flex-wrap gap-1.5">
                        {layer.build.map((item) => (
                          <Pill key={item} label={item} className="bg-white/10 text-white/60 border-white/15" />
                        ))}
                      </div>
                    </div>

                    {/* Tools */}
                    <div>
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/40 mb-1.5 font-mono">tools</p>
                      <div className="flex flex-wrap gap-1.5">
                        {layer.tools.map((tool) => (
                          <Pill key={tool} label={tool} className={layer.toolColor} />
                        ))}
                      </div>
                    </div>

                    {/* Concepts */}
                    <div>
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/40 mb-1.5 font-mono">concepts</p>
                      <div className="flex flex-wrap gap-1.5">
                        {layer.concepts.map((concept) => (
                          <Pill key={concept} label={concept} className="bg-white/10 text-white/60 border-white/15" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Root node */}
          <div className="flex justify-start ml-[14px] mt-4">
            <div className="w-4 h-4 rounded-full bg-indigo-300/60 ring-[5px] ring-indigo-300/20 shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}