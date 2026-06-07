"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import Link from "next/link";
import { BarChart3, ArrowLeft } from "lucide-react";
import {
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/lib/theme-context";
import { getColors, type Colors } from "@/lib/theme-colors";

type Student = { id: string; full_name: string; email: string; course_applying_for: string; status: string; country: string; state?: string; created_at: string; };

const normaliseState = (raw: string) =>
  raw.replace(/\s+State$/i, "").replace(/\s+LGA$/i, "").trim();

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  Nigeria: "ng", "United States": "us", "United States of America": "us", USA: "us",
  Canada: "ca", Ghana: "gh",
};

const countryDisplayOrder = ["ng", "us", "ca", "gh"];
const countryColorMap: Record<string, string> = {
  ng: "#10b981", us: "#3b82f6", ca: "#ef4444", gh: "#f59e0b",
};
const countryLabelMap: Record<string, string> = {
  ng: "Nigeria", us: "United States", ca: "Canada", gh: "Ghana",
};
const TARGET_COUNTRY_CODES = new Set(["ng", "us", "ca", "gh"]);

type DeepRow = {
  country: string; shortCode: string; flagUrl: string | null;
  state: string; count: number; yLabel: string; barLabel: string;
  fill: string; fillOpacity: number;
};

const fmt = (n: number) => n === 0 ? "₦0" : `₦${n.toLocaleString()}`;
const ts = () => {
  const d = new Date();
  return d.toLocaleString("en-US", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });
};

export default function CountryDeepDivePage() {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [now, setNow] = useState(ts());
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const C = getColors(theme);

  useEffect(() => { document.title = "Country Deep Dive — Beyund Labs Academy"; }, []);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    const i = setInterval(() => setNow(ts()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    async function load() {
      const { data: s } = await supabase
        .from("student_registrations")
        .select("*")
        .eq("status", "enrolled")
        .order("created_at", { ascending: false });
      if (s) setStudents(s as Student[]);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const enrolledStudents = students;

  // Filter to target countries
  const targetedEnrolled = enrolledStudents.filter(s => {
    const code = COUNTRY_NAME_TO_CODE[s.country?.trim() || ""];
    return code && TARGET_COUNTRY_CODES.has(code);
  });

  // Group by country then state
  const deepStateCounts: Record<string, Record<string, number>> = {};
  targetedEnrolled.forEach(s => {
    const country = (s.country && s.country.trim()) || "Unknown";
    const rawState = (s.state && s.state.trim()) || country;
    const state = normaliseState(rawState);
    if (!deepStateCounts[country]) deepStateCounts[country] = {};
    deepStateCounts[country][state] = (deepStateCounts[country][state] || 0) + 1;
  });

  // Build data rows — 12 per country
  const deepData: DeepRow[] = [];
  countryDisplayOrder.forEach(code => {
    const fullName = Object.entries(countryLabelMap).find(([, v]) => v === code)?.[0];
    if (!fullName || !deepStateCounts[fullName]) return;
    const states = deepStateCounts[fullName];
    const entries = Object.entries(states).sort(([, a], [, b]) => b - a).slice(0, 12);
    const maxForCountry = Math.max(...entries.map(([, c]) => c), 1);
    const baseColor = countryColorMap[code] || C.teal;
    entries.forEach(([state, count]) => {
      const opacity = 0.30 + (count / maxForCountry) * 0.55;
      deepData.push({
        country: fullName,
        shortCode: code.toUpperCase(),
        flagUrl: `https://flagcdn.com/w20/${code}.png`,
        state,
        count,
        yLabel: `${code.toUpperCase()} ${state}`,
        barLabel: `${state} (${count})`,
        fill: baseColor,
        fillOpacity: opacity,
      });
    });
  });

  const deepTotalStates = deepData.length;
  const deepCountryCount = countryDisplayOrder.filter(c =>
    Object.values(countryLabelMap).some(v => v === c && deepStateCounts[Object.entries(countryLabelMap).find(([, v2]) => v2 === c)?.[0] || ""])
  ).length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[100vh]" style={{ background: C.bg }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border border-t-transparent animate-spin" style={{ borderColor: C.dim, borderTopColor: C.teal }} />
        <p className="text-xs" style={{ color: C.muted }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "10px", fontFamily: "'Inter','SF Pro',system-ui,sans-serif", maxWidth: 1280, margin: "0 auto" }} className="sm:p-4 md:p-6 xl:p-8">
      {/* ── Top Bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <Link href="/adminportal" style={{ display: "flex", alignItems: "center", gap: 6, color: C.teal, fontSize: 12, fontWeight: 500, textDecoration: "none", cursor: "pointer" }}>
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
            <BarChart3 size={13} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: C.text, letterSpacing: "-0.02em" }}>Country Deep Dive</span>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 10, color: C.muted, fontFamily: "'JetBrains Mono','SF Mono',monospace", opacity: 0.75 }}>{now}</span>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: "grid", gap: 10, marginBottom: 20 }} className="sm:gap-4 sm:grid-cols-4">
        {countryDisplayOrder.map(code => {
          const states = deepData.filter(d => d.shortCode === code.toUpperCase());
          const total = states.reduce((s, d) => s + d.count, 0);
          return (
            <div key={code} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <img src={`https://flagcdn.com/w20/${code}.png`} alt={code.toUpperCase()} style={{ width: 22, height: 15, borderRadius: 1 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: countryColorMap[code], fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{code.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>{total}</p>
              <p style={{ fontSize: 9, color: C.muted, margin: "2px 0 0" }}>{states.length} state{states.length !== 1 ? "s" : ""}</p>
            </div>
          );
        })}
      </div>

      {/* ── Full Bar Chart ── */}
      {deepData.length > 0 ? (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Enrollment by State</span>
            <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto", fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>
              {deepTotalStates} states · {deepCountryCount} countries
            </span>
          </div>

          <div style={{ height: Math.max(400, deepData.length * 44 + 40) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deepData} layout="vertical" margin={{ top: 4, right: 24, left: isMobile ? 0 : 4, bottom: 4 }} barCategoryGap={isMobile ? 8 : 14}>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={false} axisLine={false} tickLine={false} />
                <YAxis
                  type="category" dataKey="yLabel"
                  axisLine={false} tickLine={false}
                  width={isMobile ? 60 : 90}
                  tick={(props: any) => {
                    const { x, y, payload } = props;
                    const item = deepData.find(d => d.yLabel === payload.value);
                    if (!item) return null;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={-4} y={0} dy={4} textAnchor="end" fill={C.text} fontSize={isMobile ? 8 : 10} fontWeight={600} fontFamily="'Inter','SF Pro',system-ui,sans-serif">
                          {item.state.length > 20 ? item.state.slice(0, 19) + "…" : item.state}
                        </text>
                      </g>
                    );
                  }}
                />
                <Tooltip cursor={{ fill: "transparent" }} content={<CTip C={C} />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Students" barSize={isMobile ? 24 : 32} isAnimationActive={false}
                  label={{
                    position: "center", fill: "#f8fafc", fontSize: isMobile ? 8 : 10, fontWeight: 800,
                    fontFamily: "'JetBrains Mono','SF Mono',monospace",
                    content: (props: any) => {
                      const { index, x, y, width, height } = props;
                      const item = deepData[index];
                      if (!item) return null;
                      const flagW = isMobile ? 18 : 26;
                      const flagH = isMobile ? 12 : 17;
                      const flagX = x + 8;
                      const flagY = y + height / 2 - flagH / 2;
                      const labelX = flagX + flagW + (isMobile ? 4 : 8);
                      const label = `${item.count} student${item.count !== 1 ? "s" : ""}`;
                      return (
                        <g>
                          <image href={item.flagUrl || undefined} x={flagX} y={flagY} width={flagW} height={flagH} preserveAspectRatio="xMidYMid meet" style={{ borderRadius: 1, outline: "1px solid rgba(255,255,255,0.25)" }} />
                          <text x={labelX} y={y + height / 2} fill="#f8fafc" fontSize={isMobile ? 8 : 10} fontWeight={800} fontFamily="'JetBrains Mono','SF Mono',monospace" textAnchor="start" dominantBaseline="central">{label}</text>
                        </g>
                      );
                    },
                  }}
                >
                  {deepData.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={e.fillOpacity} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, color: C.muted }}>No enrollment data for NG, US, CA, GH yet.</span>
        </div>
      )}
    </div>
  );
}

function CTip({ active, payload, label, C }: any) {
  if (!active || !payload) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "6px 8px", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
      {label && <p style={{ fontSize: 9, color: C.muted, margin: "0 0 2px" }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 10, fontWeight: 600, color: C.text, margin: 0, fontFamily: "'JetBrains Mono','SF Mono',monospace" }}>
          {p.name}: {typeof p.value === "number" && p.value > 100000 ? `₦${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}